import { PDFDocument } from 'pdf-lib';

import PDF from './sheet.pdf';

import {
  Ability,
  AbilityScores,
  Action,
  ArmorClass,
  ClassDC,
  Feat,
  FocusPoints,
  HitPoints,
  InventoryItem,
  Lore,
  MagicTraditions,
  Perception,
  Proficiency,
  Purse,
  SavingThrow,
  Shield,
  Skill,
  Spell,
  SpellAttackDC,
  SpellComponents,
  SpellSlot,
  SpellSlots,
  Strike,
  WeaponProficiencies,
} from '../commons';

import FeatRecapPage from '../Pages/FeatRecapPage';
import Form from '../Form';
import Base from '../Base';

export default class Pf2 extends Base {
  private pdfDoc: PDFDocument;

  private _abilityScores: AbilityScores;
  private _characterSketchUrl: string;

  allFeats: Feat[] = [];
  private wornItemsBulk: number = 0;
  private readiedItemsBulk: number = 0;
  private otherItemsBulk: number = 0;
  private purseBulk: number = 0;
  private freeActionsAndReactions: Action[];
  private actionsAndActivities: Action[];
  private hasSpells = false;

  /**
   * Fill character name field
   * @param name
   */
  set characterName(name: string) {
    this.form.setTextField('CHARACTER_NAME', name);
  }

  /**
   * Fill player name field
   * @param name
   */
  set playerName(name: string) {
    this.setTextField('PLAYER_NAME', name);
  }

  /**
   * Fill ancestry and heritage field
   * @param value
   */
  set ancestryAndHeritage(value: string) {
    this.setTextField('ANCESTRY', value);
  }

  /**
   * Fill class field
   * @param value
   */
  set class(value: string) {
    this.setTextField('CLASS', value);
  }

  /**
   * Fill class background field
   * @param value
   */
  set background(value: string) {
    this.setTextField('BACKGROUND', value);
  }

  /**
   * Fill class size field
   * @param value
   */
  set size(value: string) {
    this.setTextField('SIZE', value);
  }

  /**
   * Fill ability related fields.
   * Modifiers are computed from score values.
   *
   * All ability mod fields are filled out at once.
   * E.g. acrobatics DEX modifier and perception WIS modifier.
   *
   * Modifier that depend on class or similar are not filled.
   * E.g. Class DC ability modifier and Spell attack roll ability modifier
   *
   * @param scores
   */
  set abilityScores(scores: AbilityScores) {
    this._abilityScores = scores;
    for (const [ability, value] of this._abilityScores.entries()) {
      this.setTextField(`${ability}_SCORE`, value);
      this.setModField(`${ability}_MOD`, scores.modifier(ability));
    }
  }

  /**
   * Fill alignment field
   * @param value
   */
  set alignment(value: string) {
    this.setTextField('ALIGNMENT', value);
  }

  /**
   * Fill traits field.
   * If an array is given, they will be formmated like this:
   * ['Trait 1', 'Trait 2'] => 'Trait 1, Trait 2'
   *
   * @param value
   */
  set traits(value: string | string[]) {
    this.setTextField('TRAITS', value);
  }

  /**
   * Fill deity field
   * @param value
   */
  set deity(value: string) {
    this.setTextField('DEITY', value);
  }

  /**
   * Fill level field
   * @param value
   */
  set level(value: number) {
    this._level = value;
    this.setTextField('LEVEL', value);
  }

  set sketchPngUrl(pngUrl: string) {
    this._characterSketchUrl = pngUrl;
  }

  /**
   * Fill hero points field
   * @param value
   */
  set heroPoints(value: number) {
    this.setTextField('HERO_POINTS', value);
  }

  /**
   * Fill experience points field
   * @param value
   */
  set experiencePointsXp(value: number) {
    this.setTextField('EXPERIENCE_POINTS_XP', value);
  }

  /**
   * Fill Class DC stat block.
   *
   * Only ability is required.
   * Being it dependent on the class.
   *
   * Proficiency defaults to Untrained.
   *
   * @param value
   */
  set classDc(value: ClassDC) {
    const modBonus = this._abilityScores.modifier(value.keyAbility);
    const profBonus = value.proficiency
      ? value.proficiency.bonus(this._level)
      : 0;
    const dcValue = 10 + modBonus + profBonus + (value.otherBonus || 0);

    this.setTextField('DC_VALUE', dcValue);
    this.setTextField('DC_KEY_BONUS', this.formatModifier(modBonus));
    if (value.proficiency) {
      this.setProficiencyFields('DC_PROF', value.proficiency);
    }

    if (value.otherBonus) {
      this.setTextField('DC_ITEM_BONUS', this.formatModifier(value.otherBonus));
    }
  }

  /**
   * Fill Armor Class stat block
   *
   * No fields are required.
   * Every proficiency defaults to Untrained.
   * Every bonus or cap is assumed to be 0.
   *
   * If character is wearing an armor, `worn` field should contain the
   * proficiency of the type of armor they are currently wearing.
   *
   * @param value
   */
  set armorClass(value: ArmorClass) {
    const modBonus = this._abilityScores.modifier(Ability.DEX);
    const profBonus = value.current ? value.current.bonus(this._level) : 0;
    const dexBonus = value.cap ? Math.min(modBonus, value.cap) : modBonus;
    const armorClassValue = 10 + dexBonus + profBonus + (value.otherBonus || 0);

    this.form.setTextField('AC_VALUE', armorClassValue);
    this.form.setTextField('AC_CAP', this.formatModifier(value.cap));
    this.setProficiencyFields('AC_PROF', value.current);
    this.form.setTextField(
      'AC_ITEM_BONUS',
      this.formatModifier(value.otherBonus),
    );

    this.setProficiencyFields('AC_PROF_UNARMORED', value.unarmored);
    this.setProficiencyFields('AC_PROF_LIGHT', value.light);
    this.setProficiencyFields('AC_PROF_MEDIUM', value.medium);
    this.setProficiencyFields('AC_PROF_HEAVY', value.heavy);
  }

  set shield(shield: Shield) {
    this.form.setTextField('AC_SHIELD_BONUS', shield.bonus);
    this.form.setTextField('SHIELD_HARDNESS', shield.hardness);
    this.form.setTextField('SHIELD_MAX_HP', shield.maxHp);
    this.form.setTextField('SHIELD_BROKEN_THRESHOLD', shield.maxHp / 2);
    this.form.setTextField('SHIELD_CURRENT_HP', shield.currentHp);
  }

  /**
   * Fill Fortitude stat block
   *
   * No fields are required.
   * Proficiency defaults to 'Untrained'.
   * Bonus defaults to 0.
   *
   * @param value
   */
  set fortitude(value: SavingThrow) {
    this.setSavingThrow(value, Ability.CON, 'FORT');
  }

  /**
   * Fill Reflex stat block
   *
   * No fields are required.
   * Proficiency defaults to 'Untrained'.
   * Bonus defaults to 0.
   *
   * @param value
   */
  set reflex(value: SavingThrow) {
    this.setSavingThrow(value, Ability.DEX, 'REFL');
  }

  /**
   * Fill Will stat block
   *
   * No fields are required.
   * Proficiency defaults to 'Untrained'.
   * Bonus defaults to 0.
   *
   * @param value
   */
  set will(value: SavingThrow) {
    this.setSavingThrow(value, Ability.WIS, 'WILL');
  }

  set hitPoints(value: HitPoints) {
    this.setTextField('HP_MAX', value.max);
    this.setTextField('HP_CURRENT', value.current);
    this.setTextField('TEMPORARY', value.temporary);
    this.setTextField('DYING', value.dying);
    this.setTextField('WOUNDED', value.wounded);

    this.form.setTextField('RESISTANCES', value.resistances);
    this.form.setTextField('CONDITIONS', value.conditions);
  }

  set perception(value: Perception) {
    const modBonus = this._abilityScores.modifier(Ability.WIS);
    const profBonus = value.proficiency
      ? value.proficiency.bonus(this._level)
      : 0;
    const perceptionValue = modBonus + profBonus + (value.otherBonus || 0);

    this.setTextField('PERCEPTION_VALUE', perceptionValue);
    this.setProficiencyFields('PERCEPTION_PROF', value.proficiency);
    this.setTextField(
      'PERCEPTION_ITEM_BONUS',
      this.formatModifier(value.otherBonus),
    );

    this.setTextField('SENSES', value.senses);
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

  set meleeStrikes(value: Strike[]) {
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

    if (value.unarmed) {
      value.other ||= new Map<string, Proficiency>();
      value.other.set('Unarmed', value.unarmed);
    }

    if (value.other) {
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
            this.setTextField(`WP_OTHER_${count}_DESC`, weapons);

            count++;
          }
        },
      );
    }
  }

  set languages(value: string[]) {
    this.setTextField('LANGUAGES', value);
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

    this.setTextField(`BF_1`, name1);
    this.setTextField(`BF_2`, name2);
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
    this.setItems(items, 'WORN_ITEMS');
  }

  set readiedItems(items: InventoryItem[]) {
    this.setItems(items, 'READIED_ITEMS');
  }

  set otherItems(items: InventoryItem[]) {
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

  set currentBulk(value: number) {
    this.setTextField('CURRENT_BULK', value);
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
    const spellAttackProfiencyBonus = value.attackProficiency.bonus(
      this._level,
    );
    const spellAttackValue = spellKeyBonus + spellAttackProfiencyBonus;
    const spellDcProficiencyBonus = value.dcProficiency.bonus(this._level);
    const spellDcValue = 10 + spellKeyBonus + spellDcProficiencyBonus;

    this.setTextField('SPELL_ATTACK_VALUE', spellAttackValue);
    this.setTextField(
      'SPELL_ATTACK_KEY_BONUS',
      this.formatModifier(spellKeyBonus),
    );
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
    this.hasSpells = true;

    value.slice(0, 7).forEach((cantrip, idx) => {
      this.fillSpell(cantrip, `CAN${idx + 1}`);
    });
  }

  set innateSpells(value: Spell[]) {
    this.hasSpells = true;

    value.slice(0, 2).forEach((spell, idx) => {
      this.fillSpell(spell, `INN${idx + 1}`);
    });
  }

  set focusPoints(value: FocusPoints) {
    this.hasSpells = true;

    this.setTextField('FOCUS_POINTS_CURRENT', value.current);
    this.setTextField('FOCUS_POINTS_MAXIMUM', value.maximum);
  }

  set focusSpells(value: Spell[]) {
    this.hasSpells = true;

    value.slice(0, 4).forEach((spell, idx) => {
      this.fillSpell(spell, `FS${idx + 1}`);
    });
  }

  set spells(value: Spell[]) {
    this.hasSpells = true;
    value.slice(0, 32).forEach((spell, idx) => {
      this.fillSpell(spell, `SPELL${idx + 1}`);
    });
  }

  private async importCharacterSketchPng(sketchData: string | ArrayBuffer) {
    const characterSketch = await this.pdfDoc.embedPng(sketchData);
    this.form.setImageField('CHARACTER_SKETCH', characterSketch);
  }

  removeSpellPage() {
    this.pdfDoc.removePage(3);
  }

  appendFeatDetails() {
    const featRecapPage = new FeatRecapPage(this.pdfDoc);
    featRecapPage.addFeats(this.allFeats);
  }

  fillBulk() {
    this.setTextField(
      'ENCUMBERED_BULK',
      this._abilityScores.modifier(Ability.STR) + 5,
    );
    this.setTextField(
      'MAXIMUM_BULK',
      this._abilityScores.modifier(Ability.STR) + 10,
    );
  }

  async fill() {
    this.fillBulk();

    if (this._characterSketchUrl) {
      const sketch = await fetch(this._characterSketchUrl).then((res) =>
        res.arrayBuffer(),
      );
      await this.importCharacterSketchPng(sketch);
    }

    this.appendFeatDetails();

    if (!this.hasSpells) {
      this.removeSpellPage();
    }
  }

  dataUrl(): Promise<string> {
    return this.pdfDoc.saveAsBase64({ dataUri: true });
  }

  static async create(): Promise<Pf2> {
    const instance = new Pf2();
    await instance.loadPdf();
    return instance;
  }

  private constructor() {
    super();
  }

  private async loadPdf() {
    this.pdfDoc = await PDFDocument.load(PDF);
    this.form = new Form(this.pdfDoc.getForm());
  }

  private setSavingThrow(
    value: SavingThrow,
    keyAbility: Ability,
    fieldName: string,
  ) {
    const modBonus = this._abilityScores.modifier(keyAbility);
    const profBonus = value.proficiency
      ? value.proficiency.bonus(this._level)
      : 0;
    const saveValue = modBonus + profBonus + (value.otherBonus || 0);

    this.setTextField(`${fieldName}_VALUE`, saveValue);
    this.setProficiencyFields(`${fieldName}_PROF`, value.proficiency);
    this.setTextField(
      `${fieldName}_ITEM_BONUS`,
      this.formatModifier(value.otherBonus),
    );
  }

  private setSkill(value: Skill, keyAbility: Ability, skillName: string) {
    const modBonus = this._abilityScores.modifier(keyAbility);
    const profBonus = value.proficiency
      ? value.proficiency.bonus(this._level)
      : 0;
    const skillValue =
      modBonus + profBonus + (value.otherBonus || 0) - (value.armorMalus || 0);

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
    const proficiencyValue = strike.proficiency.bonus(this._level);
    const attackValue = keyAttackBonus + proficiencyValue + strike.otherBonus;

    this.setTextField(`W${idx}_NAME`, strike.weapon);
    this.setTextField(`W${idx}_ATTACK`, attackValue);
    this.setTextField(`W${idx}_KEY_BONUS`, keyAttackBonus);
    this.setProficiencyFields(`W${idx}_PROF`, strike.proficiency);
    this.setTextField(
      `W${idx}_ITEM_BONUS`,
      this.formatModifier(strike.otherBonus),
    );

    this.setTextField(`W${idx}_DAMAGE_DICE`, strike.damageDice);
    this.setTextField(`W${idx}_DAMAGE_BONUS`, strike.damageBonus);
    this.setCheckBox(`W${idx}_${strike.damageType}`);
    this.setTextField(`W${idx}_OTHER`, strike.other);
    this.setTextField(`W${idx}_TRAITS`, strike.traits);
  }

  private setItems(items: InventoryItem[], itemField: string) {
    const itemLines: string[] = [];
    const investLines: string[] = [];
    const bulkLine: string[] = [];
    items.forEach((item) => {
      const quantity = item.quantity ? ` (${item.quantity})` : '';
      itemLines.push(item.name + quantity);

      investLines.push(item.invested ? 'x' : '');
      bulkLine.push(item.bulk?.toString());
    });

    this.setTextField(`${itemField}_LIST`, itemLines.join('\n'));
    this.setTextField(`${itemField}_INVEST`, investLines.join('\n'));
    this.setTextField(`${itemField}_BULK`, bulkLine.join('\n'));
  }

  private setFeatFields(value: Feat[] | Feat, fieldName: string) {
    const values = Array.isArray(value) ? value : [value];
    this.allFeats.push(...values);

    const names = values.map((aValue) => aValue.name).sort();
    this.setTextField(fieldName, names);
  }

  private fillAction(action: Action, fieldName: string) {
    this.setTextField(`${fieldName}_NAME`, action.name);
    if (action.actions) {
      this.setTextField(`${fieldName}_ACTIONS`, action.actions.toString());
    }

    if (action.traits) {
      this.setTextField(`${fieldName}_TRAITS`, action.traits);
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
    this.setTextField(`${fieldName}_ACTIONS`, spell.spellCost?.actions);
    this.setTextField(`${fieldName}_FREQ`, spell.restrictions?.frequency);

    if (spell.prepared) {
      this.setCheckBox(`${fieldName}_PREP`);
    }

    if (spell.spellCost?.components?.includes(SpellComponents.Material)) {
      this.setCheckBox(`${fieldName}_M`);
    }

    if (spell.spellCost?.components?.includes(SpellComponents.Somatic)) {
      this.setCheckBox(`${fieldName}_S`);
    }

    if (spell.spellCost?.components?.includes(SpellComponents.Verbal)) {
      this.setCheckBox(`${fieldName}_V`);
    }
  }
}
