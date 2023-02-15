import { PDFDocument, PDFForm, PDFTextField } from 'pdf-lib'
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

export class ArmorClass {
    cap: number|null;
    unarmored: Proficiency;
    light = Proficiency.U;
    medium = Proficiency.U;
    heavy = Proficiency.U;
    current = Proficiency.U;
    otherBonus: number|null;

    constructor(
        cap: number|null = null,
        unarmored = Proficiency.U,
        light = Proficiency.U,
        medium = Proficiency.U,
        heavy = Proficiency.U,
        current = Proficiency.U,
        otherBonus: number|null = null
    ) {
        this.cap = cap;
        this.unarmored = unarmored;
        this.light = light;
        this.medium = medium;
        this.heavy = heavy;
        this.current = current;
        this.otherBonus = otherBonus;
    }
}

export class SavingThrow {
    proficiency: Proficiency;
    otherBonus: number;

    constructor(proficiency: Proficiency, otherBonus: number|null = null) {
        this.proficiency = proficiency;
        this.otherBonus = otherBonus;
    }
}

export class HitPoints {
    max: number;
    current: number;
    temporary: number|null = null;
    dying: number|null = null;
    wounded: number|null = null;
    resistances: string[] = [];
    conditions: string[] = [];

    constructor(
        max: number,
        current: number,
        temporary: number|null = null,
        dying: number|null = null,
        wounded: number|null = null,
        resistances: string[]|string = [],
        conditions: string[]|string = [],
    ) {
        this.max = max;
        this.current = current;
        this.temporary = temporary;
        this.dying = dying;
        this.wounded = wounded;
        this.resistances = Array.isArray(resistances) ? resistances : [resistances];
        this.conditions = Array.isArray(conditions) ? conditions : [conditions];
    }
}

export class Perception {
    proficiency: Proficiency;
    otherBonus: number|null;
    senses: string[];

    constructor(proficency: Proficiency = Proficiency.U, otherBonus: number|null = null, senses: string|string[] = []) {
        this.proficiency = proficency;
        this.otherBonus = otherBonus;
        this.senses = Array.isArray(senses) ? senses : [senses];
    }
}

export class WeaponProficiencies {
    simple: Proficiency;
    martial: Proficiency;
    other: Map<string, Proficiency>;

    constructor(
        simple: Proficiency = null,
        martial: Proficiency = null,
        other: Map<string, Proficiency> = null
    ) {
        this.simple = simple;
        this.martial = martial;
        this.other = other ? other : new Map();
    }
}

export class Skill {
    proficiency: Proficiency;
    otherBonus: number|null;
    armorMalus: number | null;

    constructor(proficiency: Proficiency = Proficiency.U, otherBonus: number|null = null, armorMalus: number | null = null) {
        this.proficiency = proficiency
        this.otherBonus = otherBonus;
        this.armorMalus = armorMalus;
    }
}

export class Lore extends Skill {
    name: string;

    constructor(name: string, proficiency: Proficiency = Proficiency.U, otherBonus: number|null = null, armorMalus: number | null = null) {
        super(proficiency, otherBonus, armorMalus);
        this.name = name;
    }
}

export class Strike {
    weapon: string;
    keyAbility: Ability;
    proficiency: Proficiency;
    damageDice: string;
    damageBonus: string;
    damageType: string;
    otherNotes: string[];
    traits: string[];
    special: number;
    wSpec: number;
    otherBonus: number

    constructor(
        weapon: string,
        keyAbility: Ability,
        proficiency: Proficiency,
        damageDice: string,
        damageBonus: string,
        damageType: string,
        other: string[] | string = [],
        traits: string[] | string = [],
        special: number = null,
        wSpec: number = null,
        otherBonus: number = null
    ) {
        this.weapon = weapon;
        this.keyAbility = keyAbility;
        this.proficiency = proficiency;
        this.damageDice = damageDice;
        this.damageBonus = damageBonus;
        this.damageType = damageType;
        this.otherNotes = Array.isArray(other) ? other : [other];
        this.traits = Array.isArray(traits) ? traits : [traits];
        this.special = special;
        this.wSpec = wSpec;
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
        this.setProficiencyFields('DC_PROF', value.proficiency);
        this.setTextField('DC_ITEM_BONUS', this.formatModifier(value.otherBonus))
    }

    public set armorClass(value: ArmorClass) {
        const modBonus = this._abilityScores.modifier(Ability.DEX);
        const profBonus = Proficiency.bonus(value.current, this.level);
        const armorClassValue = 10 + Math.min(modBonus, value.cap) + profBonus + value.otherBonus;

        this.setTextField('AC_VALUE', armorClassValue);
        this.setTextField('AC_CAP', this.formatModifier(value.cap));
        this.setProficiencyFields('AC_PROF', value.current);
        this.setTextField('AC_ITEM_BONUS', this.formatModifier(value.otherBonus));

        this.setProficiencyFields('AC_PROF_UNARMORED', value.unarmored);
        this.setProficiencyFields('AC_PROF_LIGHT', value.light);
        this.setProficiencyFields('AC_PROF_MEDIUM', value.medium);
        this.setProficiencyFields('AC_PROF_HEAVY', value.heavy);
    }

    public set fortitude(value: SavingThrow) {
        this.setSavingThrow(value, Ability.CON, 'FORT');
    }

    public set reflex(value: SavingThrow) {
        this.setSavingThrow(value, Ability.DEX, 'REFL');
    }

    public set will(value: SavingThrow) {
        this.setSavingThrow(value, Ability.WIS, 'WILL');
    }

    public set hitPoints(value: HitPoints) {
        this.setTextField('HP_MAX', value.max);
        this.setTextField('HP_CURRENT', value.current);
        this.setTextField('TEMPORARY', value.temporary);
        this.setTextField('DYING', value.dying);
        this.setTextField('WOUNDED', value.wounded);

        this.setTextField('RESISTANCES', this.formatList(value.resistances));
        this.setTextField('CONDITIONS', this.formatList(value.conditions));
    }

    public set perception(value: Perception) {
        const modBonus = this._abilityScores.modifier(Ability.WIS);
        const profBonus = Proficiency.bonus(value.proficiency, this.level);
        const perceptionValue = modBonus + profBonus + value.otherBonus

        this.setTextField('PERCEPTION_VALUE', perceptionValue);
        this.setProficiencyFields('PERCEPTION_PROF', value.proficiency);
        this.setTextField('PERCEPTION_ITEM_BONUS', this.formatModifier(value.otherBonus));
        this.setTextField('SENSES', this.formatList(value.senses));
    }

    public set speed(value: number) {
        this.setTextField('SPEED', value);
    }

    public set movementNotes(value: string) {
        this.setTextField('MOVEMENT_NOTES', value);
    }

    public set acrobatics(value: Skill) {
        this.setSkill(value, Ability.DEX, 'ACROBATICS');
    }

    public set arcana(value: Skill) {
        this.setSkill(value, Ability.INT, 'ARCANA');
    }

    public set athletics(value: Skill) {
        this.setSkill(value, Ability.STR, 'ATHLETICS');
    }

    public set crafting(value: Skill) {
        this.setSkill(value, Ability.INT, 'CRAFTING')
    }

    public set deception(value: Skill) {
        this.setSkill(value, Ability.CHA, 'DECEPTION');
    }

    public set diplomacy(value: Skill) {
        this.setSkill(value, Ability.CHA, 'DIPLOMACY');
    }

    public set intimidation(value: Skill) {
        this.setSkill(value, Ability.CHA, 'INTIMIDATION');
    }

    public set medicine(value: Skill) {
        this.setSkill(value, Ability.WIS, 'MEDICINE');
    }

    public set nature(value: Skill) {
        this.setSkill(value, Ability.WIS, 'NATURE');
    }

    public set occultism(value: Skill) {
        this.setSkill(value, Ability.INT, 'OCCULTISM');
    }

    public set performance(value: Skill) {
        this.setSkill(value, Ability.CHA, 'PERFORMANCE');
    }

    public set religion(value: Skill) {
        this.setSkill(value, Ability.WIS, 'RELIGION');
    }

    public set society(value: Skill) {
        this.setSkill(value, Ability.INT, 'SOCIETY');
    }

    public set stealth(value: Skill) {
        this.setSkill(value, Ability.DEX, 'STEALTH');
    }

    public set survival(value: Skill) {
        this.setSkill(value, Ability.WIS, 'SURVIVAL');
    }

    public set thievery(value: Skill) {
        this.setSkill(value, Ability.DEX, 'THIEVERY');
    }

    public set lore1(value: Lore) {
        this.setTextField('LORE_DESC_1', value.name);
        this.setSkill(value, Ability.INT, 'LORE_1');
    }

    public set lore2(value: Lore) {
        this.setTextField('LORE_DESC_2', value.name);
        this.setSkill(value, Ability.INT, 'LORE_2');
    }

    public set meeleeStrikes(value: Strike[]) {
        value.slice(0, 3).forEach((strike, i) => {
            const idx = i + 1;
            this.setStrike(strike, idx);
        });
    }
    public set rangedStrikes(value: Strike[]) {
        value.slice(0, 3).forEach((strike, i) => {
            const idx = i + 4;
            this.setStrike(strike, idx);
        });
    }

    public set weaponProficiencies(value: WeaponProficiencies) {
        this.setProficiencyFields('WP_SIMPLE', value.simple);
        this.setProficiencyFields('WP_MARTIAL', value.martial);

        const inverseMap = new Map<Proficiency, string[]>;
        for (const [name, prof] of value.other.entries()) {
            if (inverseMap.has(prof)) {
                inverseMap.get(prof).push(name);
            } else {
                inverseMap.set(prof, [name]);
            }
        }

        let count = 1;
        [Proficiency.L, Proficiency.M, Proficiency.E, Proficiency.T].forEach((prof) => {
            if (count > 2) {
                return;
            }

            if (inverseMap.has(prof)) {
                const weapons = inverseMap.get(prof).sort();
                this.setProficiencyFields(`WP_OTHER_${count}`, prof);
                this.setTextField(`WP_OTHER_${count}_DESC`, this.formatList(weapons));

                count++;
            }
        });
    }

    public set languages(value: string[]) {
        this.setTextField('LANGUAGES', this.formatList(value));
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

    private setTextField(name: string, value: string|number|null, strict: boolean = false) {
        if (value === null) {
            return;
        }

        if (strict) {
            const field = this.form.getTextField(name);
            field.setText(value.toString());
        } else {
            const field = this.form.getFieldMaybe(name);
            if (field && field instanceof PDFTextField) {
                field.setText(value.toString());
            }
        }

    }

    private setModField(name: string, value: number) {
        const modTextField = this.form.getTextField(name);
        modTextField.setText(this.formatModifier(value));
    }

    private setCheckBox(fieldName: string) {
        const checkboxField = this.form.getCheckBox(fieldName);
        checkboxField.check();
    }

    private setProficiencyFields(proficiencyName: string, value: Proficiency) {
        if (value == Proficiency.U) {
            return;
        }

        const profBonus = Proficiency.bonus(value, this.level);
        this.setTextField(`${proficiencyName}_BONUS`, this.formatModifier(profBonus));

        // Use switch fallthrough to check all the boxes lower than current proficiency
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch#breaking_and_fall-through
        switch (value) {
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

    private setSavingThrow(value: SavingThrow, keyAbility: Ability, fieldName: string) {
        const modBonus = this._abilityScores.modifier(keyAbility);
        const profBonus = Proficiency.bonus(value.proficiency, this.level);
        const saveValue = modBonus + profBonus + value.otherBonus;

        this.setTextField(`${fieldName}_VALUE`, saveValue);
        this.setProficiencyFields(`${fieldName}_PROF`, value.proficiency);
        this.setTextField(`${fieldName}_ITEM_BONUS`, this.formatModifier(value.otherBonus));
    }

    private setSkill(value: Skill, keyAbility: Ability, skillName: string) {
        const modBonus = this._abilityScores.modifier(keyAbility);
        const profBonus = Proficiency.bonus(value.proficiency, this.level);
        const skillValue = modBonus + profBonus + value.otherBonus - value.armorMalus;

        this.setTextField(`${skillName}_VALUE`, skillValue);
        this.setProficiencyFields(`${skillName}_PROF`, value.proficiency);
        this.setTextField(`${skillName}_ITEM_BONUS`, this.formatModifier(value.otherBonus));
        this.setTextField(`${skillName}_ARMOR_BONUS`, value.armorMalus);
    }

    private setStrike(strike: Strike, idx: number) {
        const keyAttackBonus = this._abilityScores.modifier(strike.keyAbility);
        this.setTextField(`W${idx}_NAME`, strike.weapon);

        this.setTextField(`W${idx}_KEY_BONUS`, keyAttackBonus);
        this.setProficiencyFields(`W${idx}_PROF`, strike.proficiency);
        this.setTextField(`W${idx}_ITEM_BONUS`, strike.otherBonus);

        this.setTextField(`W${idx}_DAMAGE_DICE`, strike.damageDice);
        this.setTextField(`W${idx}_DAMAGE_BONUS`, strike.damageBonus);
        this.setCheckBox(`W${idx}_${strike.damageType}`);
        this.setTextField(`W${idx}_OTHER`, this.formatList(strike.otherNotes));
        this.setTextField(`W${idx}_TRAITS`, this.formatList(strike.traits));
    }
}
