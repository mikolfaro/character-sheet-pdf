import { PDFDocument } from 'pdf-lib';

import PDF from './sheet.pdf';

import {
  Ability,
  AbilityScores,
  Action,
  ArmorClass,
  ClassDC,
  Feat,
  HitPoints,
  InventoryItem,
  Lore,
  Perception,
  Purse,
  SavingThrow,
  Shield,
  Skill,
  Strike,
  Supplies,
  WeaponProficiencies,
} from '../commons';

import Form from '../Form';
import Base from '../Base';

export default class Custom extends Base {
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
    this.form.setTextField('HERO_POINTS', value);
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
    this.form.setTextField('LORE_DESC_1', value.name);
    this.setSkill(value, Ability.INT, 'LORE_1');
  }

  set lore2(value: Lore) {
    this.form.setTextField('LORE_DESC_2', value.name);
    this.setSkill(value, Ability.INT, 'LORE_2');
  }

  set lore3(value: Lore) {
    this.form.setTextField('LORE_DESC_3', value.name);
    this.setSkill(value, Ability.INT, 'LORE_3');
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
    this.setProficiencyFields('WP_UNARMED', value.unarmed);

    if (value.other) {
      let count = 1;
      for (const [name, prof] of value.other.entries()) {
        this.setProficiencyFields(`WP_OTHER_${count}`, prof);
        this.setTextField(`WP_OTHER_${count}_DESC`, name);

        count += 1;
      }
    }
  }

  set languages(value: string[]) {
    this.setTextField('LANGUAGES', value);
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

  set supplies(supplies: Supplies) {
    this.setTextField('CHALK', supplies.chalk);
    this.setTextField('RATIONS', supplies.rations);
    this.setTextField('ROPE', supplies.rope);
    this.setTextField('TORCHES', supplies.torches);
    this.setTextField('WATER', supplies.water);

    if (supplies.other) {
      let i = 1;
      for (const [key, value] of supplies.other.entries()) {
        this.setTextField(`OTHER_SUPPLY_${i}_DESC`, key);
        this.setTextField(`OTHER_SUPPLY_${i}_COUNT`, value);

        if (i >= 3) {
          break;
        }

        i++;
      }
    }
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
    console.log(actions);
    actions.sort((a, b) =>
      a.name < b.name ? 0 : 1);

    actions.slice(0, 1).forEach((action, idx) => {
      this.fillAction(action, `A${idx + 1}`);
    });
  }

  private async importCharacterSketchPng(sketchData: string | ArrayBuffer) {
    const characterSketch = await this.pdfDoc.embedPng(sketchData);
    this.form.setImageField('CHARACTER_SKETCH', characterSketch);
  }

  appendFeatDetails() {
    // const featRecapPage = new FeatRecapPage(this.pdfDoc);
    // featRecapPage.addFeats(this.allFeats);
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
  }

  dataUrl(): Promise<string> {
    return this.pdfDoc.saveAsBase64({ dataUri: true });
  }

  static async create(): Promise<Custom> {
    const instance = new Custom();
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

    this.form.setTextField(`${fieldName}_VALUE`, saveValue);
    this.setProficiencyFields(`${fieldName}_PROF`, value.proficiency);
    this.form.setTextField(
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

    this.form.setTextField(`${skillName}_VALUE`, skillValue);
    this.setProficiencyFields(`${skillName}_PROF`, value.proficiency);

    this.form.setTextField(`${skillName}_ITEM_BONUS`, value.otherBonus);
    this.form.setTextField(`${skillName}_ARMOR_BONUS`, value.armorMalus);
  }

  private setStrike(strike: Strike, idx: number) {
    const keyAttackBonus = this._abilityScores.modifier(strike.keyAbility);
    const proficiencyValue = strike.proficiency.bonus(this._level);
    const attackValue = keyAttackBonus + proficiencyValue + strike.otherBonus;

    this.setTextField(`W${idx}_NAME`, strike.weapon);
    this.setTextField(`W${idx}_ATTACK`, attackValue);
    this.setTextField(`W${idx}_KEY_BONUS`, keyAttackBonus);
    this.setProficiencyFields(`W${idx}_PROF`, strike.proficiency);
    this.setTextField(`W${idx}_ITEM_BONUS`, strike.otherBonus);

    this.setTextField(`W${idx}_DAMAGE_DICE`, strike.damageDice);
    this.setTextField(`W${idx}_DAMAGE_BONUS`, strike.damageBonus);
    this.setCheckBox(`W${idx}_${strike.damageType}`);
    this.setTextField(`W${idx}_OTHER`, strike.other);
    this.setTextField(`W${idx}_TRAITS`, strike.traits);
    this.setTextField(`W${idx}_CRITICAL`, strike.critical);
    this.setTextField(`W${idx}_NOTES`, strike.notes);
  }

  private setItems(items: InventoryItem[], itemField: string) {
    const itemLines: string[] = [];
    const investedLines: string[] = [];
    const bulkLines: string[] = [];
    const valueLines: string[] = [];
    items.forEach((item) => {
      const quantity = item.quantity ? ` (${item.quantity})` : '';
      itemLines.push(item.name + quantity);

      investedLines.push(item.invested ? 'x' : '');
      bulkLines.push(item.bulk?.toString());
      valueLines.push(item.value?.toString());
    });

    this.setTextField(`${itemField}_LIST`, itemLines.join('\n'));
    this.setTextField(`${itemField}_INVEST`, investedLines.join('\n'));
    this.setTextField(`${itemField}_BULK`, bulkLines.join('\n'));
    this.setTextField(`${itemField}_VALUE`, valueLines.join('\n'));
  }

  private fillAction(action: Action, fieldName: string) {
    this.setTextField(`${fieldName}_NAME`, action.name);
    if (action.actions) {
      this.setTextField(`${fieldName}_ACTIONS`, action.actions.toString());
    } else if (action.freeAction) {
      this.setTextField(`${fieldName}_ACTIONS`, 'F');
    } else if (action.reaction) {
      this.setTextField(`${fieldName}_ACTIONS`, 'R');
    }

    if (action.traits) {
      this.setTextField(`${fieldName}_TRAITS`, action.traits);
    }

    this.setTextField(`${fieldName}_PAGE`, action.page);
    this.setTextField(`${fieldName}_DESCRIPTION`, action.description);
    this.setTextField(`${fieldName}_TRIGGER`, action.trigger);
  }
}
