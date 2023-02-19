import {
  PDFButton,
  PDFDocument,
  PDFForm,
  PDFImage,
  PDFTextField,
} from 'pdf-lib';

import Ability from './Ability';
import AbilityScores from './AbilityScore';
import Action from './Action';
import ArmorClass from './ArmorClass';
import ClassDC from './ClassDC';
import Feat from './Feat';
import FeatRecapPage from './FeatRecapPage';
import HitPoints from './HitPoints';
import InventoryItem from './InventoryItem';
import Lore from './Lore';
import Perception from './Perception';
import Proficiency from './Proficiency';
import Purse from './Purse';
import SavingThrow from './SavingThrows';
import Skill from './Skill';
import Strike from './Strike';
import WeaponProficiencies from './WeaponProficiencies';

import PDF from './character_sheet.pdf';

interface SpellAttackDC {
  key: Ability;
  attackProficiency?: Proficiency;
  dcProficiency?: Proficiency;
}

interface MagicTraditions {
  prepared?: boolean;
  spontaneous ?: boolean;
  arcane?: boolean;
  occult?: boolean;
  primal?: boolean;
  divine?: boolean;
}

interface SpellSlot {
  level: number;
  total: number;
  remaining: number;
}

interface SpellSlots {
  cantripLevel: number;
  spellSlots?: SpellSlot[];
}

interface FocusPoints {
  current: number;
  maximum: number;
}

class Spell {
  readonly name: string;
  readonly description: string;
  readonly actions: number;
  readonly prepared: boolean;
  readonly material: boolean;
  readonly somatic: boolean;
  readonly verbal: boolean;

  constructor(name: string, description: string, actions: number, prepared: boolean = false, material: boolean = false, somatic: boolean = false, verbal: boolean = false) {
    this.name = name;
    this.description = description;
    this.actions = actions;
    this.prepared = prepared;
    this.material = material;
    this.somatic = somatic;
    this.verbal = verbal;
  }
}

export default class Pf2 {
  pdfDoc: PDFDocument;
  form: PDFForm;

  _abilityScores: AbilityScores;
  _level: number;

  allFeats: Feat[] = [];
  private characterSketch: PDFImage;
  private wornItemsBulk: number;
  private readiedItemsBulk: number;
  private otherItemsBulk: number;
  private purseBulk: number;
  private freeActionsAndReactions: Action[];
  private actionsAndActivities: Action[];

  set characterName(name: string) {
    this.setTextField('CHARACTER_NAME', name);
  }

  set playerName(name: string) {
    this.setTextField('PLAYER_NAME', name);
  }

  set ancestryAndHeritage(value: string) {
    this.setTextField('ANCESTRY', value);
  }

  set class(value: string) {
    this.setTextField('CLASS', value);
  }

  set background(value: string) {
    this.setTextField('BACKGROUND', value);
  }

  set size(value: string) {
    this.setTextField('SIZE', value);
  }

  set abilityScores(scores: AbilityScores) {
    this._abilityScores = scores;
    for (const [ability, value] of this._abilityScores.entries()) {
      this.setTextField(`${ability}_SCORE`, value);
      this.setModField(`${ability}_MOD`, scores.modifier(ability));
    }
  }

  set alignement(value: string) {
    this.setTextField('ALIGNMENT', value);
  }

  set traits(value: string | string[]) {
    const printable = Array.isArray(value) ? this.formatList(value) : value;
    this.setTextField('TRAITS', printable);
  }

  set deity(value: string) {
    this.setTextField('DEITY', value);
  }

  set level(value: number) {
    this._level = value;
    this.setTextField('LEVEL', value);
  }

  get level(): number {
    return this._level;
  }

  set heroPoints(value: number) {
    this.setTextField('HERO_POINTS', value);
  }

  set experiencePointsXp(value: number) {
    this.setTextField('EXPERIENCE_POINTS_XP', value);
  }

  set classDc(value: ClassDC) {
    const modBonus = this._abilityScores.modifier(value.keyAbility);
    const profBonus = value.proficiency.bonus(this.level);
    const dcValue = 10 + modBonus + profBonus + value.otherBonus;

    this.setTextField('DC_VALUE', dcValue);
    this.setTextField('DC_KEY_BONUS', this.formatModifier(modBonus));
    this.setProficiencyFields('DC_PROF', value.proficiency);
    this.setTextField('DC_ITEM_BONUS', this.formatModifier(value.otherBonus));
  }

  set armorClass(value: ArmorClass) {
    const modBonus = this._abilityScores.modifier(Ability.DEX);
    const profBonus = value.current.bonus(this.level);
    const dexBonus = value.cap ? Math.min(modBonus, value.cap) : modBonus;
    const armorClassValue = 10 + dexBonus + profBonus + value.otherBonus;

    this.setTextField('AC_VALUE', armorClassValue);
    this.setTextField('AC_CAP', this.formatModifier(value.cap));
    this.setProficiencyFields('AC_PROF', value.current);
    this.setTextField('AC_ITEM_BONUS', this.formatModifier(value.otherBonus));

    this.setProficiencyFields('AC_PROF_UNARMORED', value.unarmored);
    this.setProficiencyFields('AC_PROF_LIGHT', value.light);
    this.setProficiencyFields('AC_PROF_MEDIUM', value.medium);
    this.setProficiencyFields('AC_PROF_HEAVY', value.heavy);
  }

  set fortitude(value: SavingThrow) {
    this.setSavingThrow(value, Ability.CON, 'FORT');
  }

  set reflex(value: SavingThrow) {
    this.setSavingThrow(value, Ability.DEX, 'REFL');
  }

  set will(value: SavingThrow) {
    this.setSavingThrow(value, Ability.WIS, 'WILL');
  }

  set hitPoints(value: HitPoints) {
    this.setTextField('HP_MAX', value.max);
    this.setTextField('HP_CURRENT', value.current);
    this.setTextField('TEMPORARY', value.temporary);
    this.setTextField('DYING', value.dying);
    this.setTextField('WOUNDED', value.wounded);

    this.setTextField('RESISTANCES', this.formatList(value.resistances));
    this.setTextField('CONDITIONS', this.formatList(value.conditions));
  }

  set perception(value: Perception) {
    const modBonus = this._abilityScores.modifier(Ability.WIS);
    const profBonus = value.proficiency.bonus(this.level);
    const perceptionValue = modBonus + profBonus + value.otherBonus;

    this.setTextField('PERCEPTION_VALUE', perceptionValue);
    this.setProficiencyFields('PERCEPTION_PROF', value.proficiency);
    this.setTextField(
      'PERCEPTION_ITEM_BONUS',
      this.formatModifier(value.otherBonus),
    );
    this.setTextField('SENSES', this.formatList(value.senses));
  }

  set speed(value: number) {
    this.setTextField('SPEED', value);
  }

  set movementNotes(value: string) {
    this.setTextField('MOVEMENT_NOTES', value);
  }

  set acrobatics(value: Skill) {
    this.setSkill(value, Ability.DEX, 'ACROBATICS');
  }

  set arcana(value: Skill) {
    this.setSkill(value, Ability.INT, 'ARCANA');
  }

  set athletics(value: Skill) {
    this.setSkill(value, Ability.STR, 'ATHLETICS');
  }

  set crafting(value: Skill) {
    this.setSkill(value, Ability.INT, 'CRAFTING');
  }

  set deception(value: Skill) {
    this.setSkill(value, Ability.CHA, 'DECEPTION');
  }

  set diplomacy(value: Skill) {
    this.setSkill(value, Ability.CHA, 'DIPLOMACY');
  }

  set intimidation(value: Skill) {
    this.setSkill(value, Ability.CHA, 'INTIMIDATION');
  }

  set medicine(value: Skill) {
    this.setSkill(value, Ability.WIS, 'MEDICINE');
  }

  set nature(value: Skill) {
    this.setSkill(value, Ability.WIS, 'NATURE');
  }

  set occultism(value: Skill) {
    this.setSkill(value, Ability.INT, 'OCCULTISM');
  }

  set performance(value: Skill) {
    this.setSkill(value, Ability.CHA, 'PERFORMANCE');
  }

  set religion(value: Skill) {
    this.setSkill(value, Ability.WIS, 'RELIGION');
  }

  set society(value: Skill) {
    this.setSkill(value, Ability.INT, 'SOCIETY');
  }

  set stealth(value: Skill) {
    this.setSkill(value, Ability.DEX, 'STEALTH');
  }

  set survival(value: Skill) {
    this.setSkill(value, Ability.WIS, 'SURVIVAL');
  }

  set thievery(value: Skill) {
    this.setSkill(value, Ability.DEX, 'THIEVERY');
  }

  set lore1(value: Lore) {
    this.setTextField('LORE_DESC_1', value.name);
    this.setSkill(value, Ability.INT, 'LORE_1');
  }

  set lore2(value: Lore) {
    this.setTextField('LORE_DESC_2', value.name);
    this.setSkill(value, Ability.INT, 'LORE_2');
  }

  set meeleeStrikes(value: Strike[]) {
    value.slice(0, 3).forEach((strike, i) => {
      const idx = i + 1;
      this.setStrike(strike, idx);
    });
  }
  set rangedStrikes(value: Strike[]) {
    value.slice(0, 3).forEach((strike, i) => {
      const idx = i + 4;
      this.setStrike(strike, idx);
    });
  }

  set weaponProficiencies(value: WeaponProficiencies) {
    this.setProficiencyFields('WP_SIMPLE', value.simple);
    this.setProficiencyFields('WP_MARTIAL', value.martial);

    const inverseMap = new Map<Proficiency, string[]>();
    for (const [name, prof] of value.other.entries()) {
      if (inverseMap.has(prof)) {
        inverseMap.get(prof).push(name);
      } else {
        inverseMap.set(prof, [name]);
      }
    }

    let count = 1;
    [Proficiency.L, Proficiency.M, Proficiency.E, Proficiency.T].forEach(
      (prof) => {
        if (count > 2) {
          return;
        }

        if (inverseMap.has(prof)) {
          const weapons = inverseMap.get(prof).sort();
          this.setProficiencyFields(`WP_OTHER_${count}`, prof);
          this.setTextField(`WP_OTHER_${count}_DESC`, this.formatList(weapons));

          count++;
        }
      },
    );
  }

  set languages(value: string[]) {
    this.setTextField('LANGUAGES', this.formatList(value));
  }

  set ancestryFeat1(value: Feat[] | Feat) {
    this.setFeatFields(value, `AF_1`);
  }

  set ancestryFeatS1(value: Feat[] | Feat) {
    this.setFeatFields(value, `AF_S1`);
  }

  set heritageFeat1(value: Feat[] | Feat) {
    this.setFeatFields(value, `AF_H1`);
  }

  set ancestryFeat5(value: Feat[] | Feat) {
    this.setFeatFields(value, `AF_5`);
  }

  set ancestryFeat9(value: Feat[] | Feat) {
    this.setFeatFields(value, `AF_9`);
  }

  set ancestryFeat13(value: Feat[] | Feat) {
    this.setFeatFields(value, `AF_13`);
  }

  set ancestryFeat17(value: Feat[] | Feat) {
    this.setFeatFields(value, `AF_17`);
  }

  set skillFeatB(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_B`);
  }

  set skillFeat2(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_2`);
  }

  set skillFeat4(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_4`);
  }

  set skillFeat6(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_6`);
  }

  set skillFeat8(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_8`);
  }

  set skillFeat10(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_10`);
  }

  set skillFeat12(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_12`);
  }

  set skillFeat14(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_14`);
  }

  set skillFeat16(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_16`);
  }

  set skillFeat18(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_18`);
  }

  set skillFeat20(value: Feat[] | Feat) {
    this.setFeatFields(value, `SF_20`);
  }

  set generalFeat3(value: Feat[] | Feat) {
    this.setFeatFields(value, `GF_3`);
  }

  set generalFeat7(value: Feat[] | Feat) {
    this.setFeatFields(value, `GF_7`);
  }

  set generalFeat11(value: Feat[] | Feat) {
    this.setFeatFields(value, `GF_11`);
  }

  set generalFeat15(value: Feat[] | Feat) {
    this.setFeatFields(value, `GF_15`);
  }

  set generalFeat19(value: Feat[] | Feat) {
    this.setFeatFields(value, `GF_19`);
  }

  set classFeat1(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_1`);
  }

  set classFeat2(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_2`);
  }

  set classFeat4(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_4`);
  }

  set classFeat6(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_6`);
  }

  set classFeat8(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_8`);
  }

  set classFeat10(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_10`);
  }

  set classFeat12(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_12`);
  }

  set classFeat14(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_14`);
  }

  set classFeat16(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_16`);
  }

  set classFeat18(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_18`);
  }

  set classFeat20(value: Feat[] | Feat) {
    this.setFeatFields(value, `CF_20`);
  }

  set bonusFeats(value: Feat[] | Feat) {
    const values = Array.isArray(value) ? value : [value];
    this.allFeats.push(...values);

    const names = values.map((aValue) => aValue.name).sort();

    const half = names.length / 2 + 1;
    const name1 = names.slice(0, half);
    const name2 = names.slice(half);

    this.setTextField(`BF_1`, this.formatList(name1));
    this.setTextField(`BF_2`, this.formatList(name2));
  }

  set classFeature1_1(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_1_1`);
  }

  set classFeature1_2(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_1_2`);
  }

  set classFeature3(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_3`);
  }

  set classFeature5(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_5`);
  }

  set classFeature7(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_7`);
  }

  set classFeature9(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_9`);
  }

  set classFeature11(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_11`);
  }

  set classFeature13(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_13`);
  }

  set classFeature15(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_15`);
  }

  set classFeature17(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_17`);
  }

  set classFeature19(value: Feat[] | Feat) {
    this.setFeatFields(value, `FEATURE_19`);
  }

  set wornItems(items: InventoryItem[]) {
    this.wornItemsBulk = Math.floor(
      items.reduce((sum, item) => sum + item.bulk * (item.quantity || 1), 0),
    );

    this.setItems(items, 'WORN_ITEMS');
  }

  set readiedItems(items: InventoryItem[]) {
    this.readiedItemsBulk = Math.floor(
      items.reduce((sum, item) => sum + item.bulk * (item.quantity || 1), 0),
    );

    this.setItems(items, 'READIED_ITEMS');
  }

  set otherItems(items: InventoryItem[]) {
    this.otherItemsBulk = this.calculateBulk(items);

    this.setItems(items, 'OTHER_ITEMS');
  }

  set purse(purse: Purse) {
    this.purseBulk =
      ((purse.copper || 0) +
        (purse.silver || 0) +
        (purse.gold || 0) +
        (purse.platinum || 0)) /
      1000.0;

    this.setTextField('COPPER', purse.copper || 0);
    this.setTextField('SILVER', purse.silver || 0);
    this.setTextField('GOLD', purse.gold || 0);
    this.setTextField('PLATINUM', purse.platinum || 0);
  }

  set actions(actions: Action[]) {
    this.freeActionsAndReactions = [];
    this.actionsAndActivities = [];

    actions.forEach((action) => {
      if (action.freeAction || action.reaction) {
        this.freeActionsAndReactions.push(action);
      } else {
        this.actionsAndActivities.push(action);
      }
    });

    this.actionsAndActivities.slice(0, 6).forEach((action, idx) => {
      this.fillAction(action, `AA${idx + 1}`);
    });

    this.freeActionsAndReactions.slice(0, 6).forEach((action, idx) => {
      this.fillAction(action, `FA${idx + 1}`);
    });
  }

  set spellAttack(value: SpellAttackDC) {
    const spellKeyBonus = this._abilityScores.modifier(value.key);
    const spellAttackProfiencyBonus = value.attackProficiency.bonus(this.level);
    const spellAttackValue = spellKeyBonus + spellAttackProfiencyBonus;
    const spellDcProficiencyBonus = value.dcProficiency.bonus(this.level);
    const spellDcValue = 10 + spellKeyBonus + spellDcProficiencyBonus;

    this.setTextField('SPELL_ATTACK_VALUE', spellAttackValue);
    this.setTextField('SPELL_ATTACK_KEY_BONUS', this.formatModifier(spellKeyBonus));
    this.setProficiencyFields('SPELL_ATTACK_PROF', value.attackProficiency);

    this.setTextField('SPELL_DC_VALUE', spellDcValue);
    this.setTextField('SPELL_DC_KEY_BONUS', this.formatModifier(spellKeyBonus));
    this.setProficiencyFields('SPELL_DC_PROF', value.dcProficiency);
  }

  set magicTraditions(value: MagicTraditions) {
    if (value.prepared) {
      this.setCheckBox('PREPARED');
    }

    if (value.spontaneous) {
      this.setCheckBox('SPONTANEOUS');
    }

    if (value.arcane) {
      this.setCheckBox('ARCANE');
    }

    if (value.occult) {
      this.setCheckBox('OCCULT');
    }

    if (value.divine) {
      this.setCheckBox('DIVINE');
    }

    if (value.primal) {
      this.setCheckBox('PRIMAL');
    }
  }

  set spellSlots(value: SpellSlots) {
    this.setTextField('CANTRIP_LEVEL', value.cantripLevel);
    value.spellSlots.forEach((spellSlot) => {
      this.fillSpellSlot(spellSlot);
    });
  }

  set cantrips(value: Spell[]) {
    value.slice(0, 7).forEach((cantrip, idx) => {
      this.fillSpell(cantrip, `CAN${idx + 1}`);
    });
  }

  set focusPoints(value: FocusPoints) {
    this.setTextField('FOCUS_POINTS_CURRENT', value.current);
    this.setTextField('FOCUS_POINTS_MAXIMUM', value.maximum);
  }

  async importCharacterSketchPng(sketchData: string | ArrayBuffer) {
    const sketchButton = this.form.getField('CHARACTER_SKETCH');
    if (sketchButton instanceof PDFButton) {
      this.characterSketch = await this.pdfDoc.embedPng(sketchData);
      sketchButton.setImage(this.characterSketch);
    }
  }

  appendFeatDetails() {
    const featRecapPage = new FeatRecapPage(this.pdfDoc);
    featRecapPage.addFeats(this.allFeats);
  }

  fillBulk() {
    const bulk = Math.floor(
      this.wornItemsBulk +
        this.readiedItemsBulk +
        this.otherItemsBulk +
        this.purseBulk,
    );
    this.setTextField('CURRENT_BULK', bulk);
    this.setTextField(
      'ENCUMBERED_BULK',
      this._abilityScores.modifier(Ability.STR) + 5,
    );
    this.setTextField(
      'MAXIMUM_BULK',
      this._abilityScores.modifier(Ability.STR) + 10,
    );
  }

  dataUri(): Promise<string> {
    return this.pdfDoc.saveAsBase64({ dataUri: true });
  }

  static async create(): Promise<Pf2> {
    const instance = new Pf2();
    await instance.loadPdf();
    return instance;
  }

  private constructor() {}

  private async loadPdf() {
    this.pdfDoc = await PDFDocument.load(PDF);
    this.form = this.pdfDoc.getForm();
  }

  private formatModifier(mod: number | null): string {
    if (mod === null) {
      return '';
    }

    return mod < 0 ? `${mod}` : `+${mod}`;
  }

  private formatList(value: string[]) {
    return value.join(', ');
  }

  private setTextField(
    name: string,
    value: string | number | null,
    strict: boolean = false,
  ) {
    if (value === null || value === undefined) {
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
    if (value === Proficiency.U) {
      return;
    }

    const profBonus = value.bonus(this.level);
    this.setTextField(
      `${proficiencyName}_BONUS`,
      this.formatModifier(profBonus),
    );

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

  private setSavingThrow(
    value: SavingThrow,
    keyAbility: Ability,
    fieldName: string,
  ) {
    const modBonus = this._abilityScores.modifier(keyAbility);
    const profBonus = value.proficiency.bonus(this.level);
    const saveValue = modBonus + profBonus + value.otherBonus;

    this.setTextField(`${fieldName}_VALUE`, saveValue);
    this.setProficiencyFields(`${fieldName}_PROF`, value.proficiency);
    this.setTextField(
      `${fieldName}_ITEM_BONUS`,
      this.formatModifier(value.otherBonus),
    );
  }

  private setSkill(value: Skill, keyAbility: Ability, skillName: string) {
    const modBonus = this._abilityScores.modifier(keyAbility);
    const profBonus = value.proficiency.bonus(this.level);
    const skillValue =
      modBonus + profBonus + value.otherBonus - value.armorMalus;

    this.setTextField(`${skillName}_VALUE`, skillValue);
    this.setProficiencyFields(`${skillName}_PROF`, value.proficiency);
    this.setTextField(
      `${skillName}_ITEM_BONUS`,
      this.formatModifier(value.otherBonus),
    );
    this.setTextField(`${skillName}_ARMOR_BONUS`, value.armorMalus);
  }

  private setStrike(strike: Strike, idx: number) {
    const keyAttackBonus = this._abilityScores.modifier(strike.keyAbility);
    const proficiencyValue = strike.proficiency.bonus(this.level);
    const attackValue = keyAttackBonus + proficiencyValue + strike.otherBonus;

    this.setTextField(`W${idx}_NAME`, strike.weapon);
    this.setTextField(`W${idx}_ATTACK`, attackValue);
    this.setTextField(`W${idx}_KEY_BONUS`, keyAttackBonus);
    this.setProficiencyFields(`W${idx}_PROF`, strike.proficiency);
    this.setTextField(`W${idx}_ITEM_BONUS`, this.formatModifier(strike.otherBonus));

    this.setTextField(`W${idx}_DAMAGE_DICE`, strike.damageDice);
    this.setTextField(`W${idx}_DAMAGE_BONUS`, strike.damageBonus);
    this.setCheckBox(`W${idx}_${strike.damageType}`);
    this.setTextField(`W${idx}_OTHER`, this.formatList(strike.otherNotes));
    this.setTextField(`W${idx}_TRAITS`, this.formatList(strike.traits));
  }

  private setItems(items: InventoryItem[], itemField: string) {
    const itemLines: string[] = [];
    const investLines: string[] = [];
    const bulkLine: string[] = [];
    items.forEach((item) => {
      const quantity = item.quantity ? ` (${item.quantity})` : '';
      itemLines.push(item.name + quantity);

      investLines.push(item.invested ? 'x' : '');
      bulkLine.push(item.bulk.toString());
    });

    this.setTextField(`${itemField}_LIST`, itemLines.join('\n'));
    this.setTextField(`${itemField}_INVEST`, investLines.join('\n'));
    this.setTextField(`${itemField}_BULK`, bulkLine.join('\n'));
  }

  private calculateBulk(items: InventoryItem[]) {
    return items.reduce(
      (sum, item) => sum + item.bulk * (item.quantity || 1),
      0,
    );
  }

  private setFeatFields(value: Feat[] | Feat, fieldName: string) {
    const values = Array.isArray(value) ? value : [value];
    this.allFeats.push(...values);

    const names = values.map((aValue) => aValue.name).sort();
    this.setTextField(fieldName, this.formatList(names));
  }

  private fillAction(action: Action, fieldName: string) {
    this.setTextField(`${fieldName}_NAME`, action.name);
    if (action.actions) {
      this.setTextField(`${fieldName}_ACTIONS`, action.actions.toString());
    }

    if (action.traits) {
      this.setTextField(`${fieldName}_TRAITS`, this.formatList(action.traits));
    }

    this.setTextField(`${fieldName}_PAGE`, action.page);
    this.setTextField(`${fieldName}_DESCRIPTION`, action.description);
    this.setTextField(`${fieldName}_TRIGGER`, action.trigger);

    if (action.freeAction) {
      this.setCheckBox(`${fieldName}_FREEACTION`);
    }

    if (action.reaction) {
      this.setCheckBox(`${fieldName}_REACTION`);
    }
  }

  private fillSpellSlot(spellSlot: SpellSlot) {
    this.setTextField(`SS${spellSlot.level}_MAX`, spellSlot.total);
    this.setTextField(`SS${spellSlot.level}_REMAINING`, spellSlot.remaining);
  }

  private fillSpell(spell: Spell, fieldName: string) {
    this.setTextField(`${fieldName}_NAME`, spell.name);
    this.setTextField(`${fieldName}_DESCRIPTION`, spell.description);
    this.setTextField(`${fieldName}_ACTIONS`, spell.actions);

    if (spell.prepared) {
      this.setCheckBox(`${fieldName}_PREP`);
    }

    if ( spell.material) {
      this.setCheckBox(`${fieldName}_M`);
    }

    if (spell.somatic) {
      this.setCheckBox(`${fieldName}_S`);
    }

    if (spell.verbal) {
      this.setCheckBox(`${fieldName}_V`);
    }
  }
}

export {
  Ability,
  AbilityScores,
  Action,
  ArmorClass,
  HitPoints,
  Lore,
  Perception,
  Proficiency,
  SavingThrow,
  Skill,
    Spell,
  Strike,
  WeaponProficiencies,
};
