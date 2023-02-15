import { PDFDocument, PDFForm } from 'pdf-lib'
import PDF from './character_sheet.pdf'
import Ability from './Ability'
import Proficiency from './Proficiency'

export class AbilityScores {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;

    constructor(STR: number, DEX: number, CON: number, INT: number, WIS: number, CHA: number) {
        this.STR = STR;
        this.DEX = DEX;
        this.CON = CON;
        this.INT = INT;
        this.WIS = WIS;
        this.CHA = CHA;
    }

    modifier(ability: Ability): number {
        return (this[ability] - 10) / 2;
    }
}

class ClassDC {
    keyAbility: Ability;
    proficiency: Proficiency;
    otherBonus: number|null;

    constructor(keyAbility: Ability, proficiency: Proficiency = Proficiency.U, otherBonus: number|null = null) {
        this.keyAbility = keyAbility;
        this.proficiency = proficiency;
        this.otherBonus = otherBonus;
    }
}

export default class Pf2 {
    pdfDoc: PDFDocument;
    form: PDFForm;

    _abilityScores: AbilityScores;
    _level: number;

    public set characterName(name: string) {
        this.setTextField('CHARACTER_NAME', name);
    }

    public set playerName(name: string) {
        this.setTextField('PLAYER_NAME', name);
    }

    public set ancestryAndHeritage(value: string) {
        this.setTextField('ANCESTRY', value);
    }

    public set class(value: string) {
        this.setTextField('CLASS', value);
    }

    public set background(value: string) {
        this.setTextField('BACKGROUND', value);
    }

    public set size(value: string) {
        this.setTextField('SIZE', value);
    }

    public set abilityScores(scores: AbilityScores) {
        this._abilityScores = scores;

        for (const [name, value] of Object.entries(scores)) {
            this.setTextField(`${name.toUpperCase()}_SCORE`, value);
            this.setModField(`${name.toUpperCase()}_MOD`, scores.modifier(name as Ability));
        }
    }

    public set alignement(value: string) {
        this.setTextField('ALIGNMENT', value);
    }

    public set traits(value: string | string[]) {
        const printable = Array.isArray(value) ? this.formatList(value) : value;
        this.setTextField('TRAITS', printable);
    }

    public set deity(value: string) {
        this.setTextField('DEITY', value);
    }

    public set level(value: number) {
        this._level = value;
        this.setTextField('LEVEL', value);
    }

    public get level(): number {
        return this._level;
    }

    public set heroPoints(value: number) {
        this.setTextField('HERO_POINTS', value);
    }

    public set experiencePointsXp(value: number) {
        this.setTextField('EXPERIENCE_POINTS_XP', value);
    }

    public set classDc(value: ClassDC) {
        const modBonus = this._abilityScores.modifier(value.keyAbility);
        const profBonus = Proficiency.bonus(value.proficiency, this.level);
        const dcValue = 10 + modBonus + profBonus + value.otherBonus;

        this.setTextField('DC_VALUE', dcValue);
        this.setTextField('DC_KEY_BONUS', this.formatModifier(modBonus));
        this.setProficiencyFields('DC_PROF', value);
        this.setTextField('DC_ITEM_BONUS', this.formatModifier(value.otherBonus))
    }

    public dataUri(): Promise<string> {
        return this.pdfDoc.saveAsBase64({ dataUri: true });
    }

    static async create(): Promise<Pf2> {
        const instance = new Pf2();
        await instance.loadPdf();
        return instance;
    }

    private constructor() {
    }

    private async loadPdf() {
        const pdfBytes = await fetch(PDF).then(res => res.arrayBuffer());
        this.pdfDoc = await PDFDocument.load(pdfBytes);
        this.form = this.pdfDoc.getForm();
    }

    private formatModifier(mod: number|null): string {
        if (mod === null) {
            return '';
        }

        return mod < 0 ? `${mod}` : `+${mod}`;
    }

    private formatList(value: string[]) {
        return value.join(", ");
    }

    private setTextField(name: string, value: string|number|null) {
        if (value === null) {
            return;
        }

        const field = this.form.getTextField(name);
        field.setText(value.toString());
    }

    private setModField(name: string, value: number) {
        const modTextField = this.form.getTextField(name);
        modTextField.setText(this.formatModifier(value));
    }

    private setCheckBox(proficiency: string) {
        const checkboxField = this.form.getCheckBox(proficiency);
        checkboxField.check();
    }

    private setProficiencyFields(proficiencyName: string, value: ClassDC) {
        const profBonus = Proficiency.bonus(value.proficiency, this.level);
        this.setTextField(`${proficiencyName}_BONUS`, this.formatModifier(profBonus));

        // Use switch fallthrough to check all the boxes lower than current proficiency
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch#breaking_and_fall-through
        switch (value.proficiency) {
            case Proficiency.L:
                this.setCheckBox(`${proficiencyName}_L`);
            case Proficiency.M:
                this.setCheckBox(`${proficiencyName}_M`);
            case Proficiency.E:
                this.setCheckBox(`${proficiencyName}_E`);
            case Proficiency.T:
                this.setCheckBox(`${proficiencyName}_T`);
        }
    }
}
