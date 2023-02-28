export enum Ability {
  STR = 'STR',
  DEX = 'DEX',
  CON = 'CON',
  INT = 'INT',
  WIS = 'WIS',
  CHA = 'CHA',
}

export class AbilityScores {
  scores: Map<Ability, number>;

  constructor(
    STR: number,
    DEX: number,
    CON: number,
    INT: number,
    WIS: number,
    CHA: number,
  ) {
    this.scores = new Map<Ability, number>();
    this.scores.set(Ability.STR, STR);
    this.scores.set(Ability.DEX, DEX);
    this.scores.set(Ability.CON, CON);
    this.scores.set(Ability.INT, INT);
    this.scores.set(Ability.WIS, WIS);
    this.scores.set(Ability.CHA, CHA);
  }

  modifier(ability: Ability): number {
    return (this.scores.get(ability) - 10) / 2;
  }

  entries() {
    return this.scores.entries();
  }
}

export class Action {
  readonly name: string;
  readonly actions: number;
  readonly reaction: boolean;
  readonly freeAction: boolean;
  readonly traits: string[];
  readonly page: string | null;
  readonly description: string;
  readonly trigger: string;
  readonly oncePerDay: string;
  readonly requirements: string;

  constructor(
    name: string,
    actions: number,
    reaction: boolean = false,
    freeAction: boolean = false,
    traits: string[] = [],
    page: string = null,
    description: string = null,
    trigger: string = null,
    oncePerDay: string = null,
    requirements: string = null,
  ) {
    this.name = name;
    this.actions = actions;
    this.reaction = reaction;
    this.freeAction = freeAction;
    this.traits = traits;
    this.page = page;
    this.description = description;
    this.trigger = trigger;
    this.oncePerDay = oncePerDay;
    this.requirements = requirements;
  }
}

export interface ArmorClass {
  cap?: number;
  unarmored?: Proficiency;
  light?: Proficiency;
  medium?: Proficiency;
  heavy?: Proficiency;
  current?: Proficiency;
  otherBonus?: number;
}

export interface ClassDC {
  keyAbility: Ability;
  proficiency?: Proficiency;
  otherBonus?: number;
}

export interface Feat {
  name: string;
  description?: string;
}

export interface FocusPoints {
  current: number;
  maximum: number;
}

export interface HitPoints {
  max: number;
  current: number;
  temporary?: number;
  dying?: number;
  wounded?: number;
  resistances?: string[];
  conditions?: string[];
}

export interface InventoryItem {
  name: string;
  quantity?: number;
  bulk?: number;

  invested?: boolean;
}

export interface MagicTraditions {
  prepared?: boolean;
  spontaneous?: boolean;
  arcane?: boolean;
  occult?: boolean;
  primal?: boolean;
  divine?: boolean;
}

export interface Perception {
  proficiency?: Proficiency;
  otherBonus?: number;
  senses?: string[] | string;
}

export class Proficiency {
  static U = new Proficiency('U', 0);
  static T = new Proficiency('T', 2);
  static E = new Proficiency('E', 4);
  static M = new Proficiency('M', 6);
  static L = new Proficiency('L', 8);

  private readonly name: string;
  private readonly baseValue: number;

  constructor(name: string, baseValue: number) {
    this.name = name;
    this.baseValue = baseValue;
  }

  toString() {
    return this.name;
  }

  bonus(level: number): number {
    return this === Proficiency.U ? 0 : this.baseValue + level;
  }
}

export interface Purse {
  copper?: number;
  silver?: number;
  gold?: number;
  platinum?: number;
}

export enum SaveType {
  Fortitude = 'Fortitude',
  Will = 'Will',
  Reflex = 'Reflex',
}

export interface SavingThrow {
  proficiency?: Proficiency;
  otherBonus?: number;
}

export class Skill {
  proficiency: Proficiency;
  otherBonus: number | null;
  armorMalus: number | null;

  constructor(
    proficiency: Proficiency = Proficiency.U,
    otherBonus: number | null = null,
    armorMalus: number | null = null,
  ) {
    this.proficiency = proficiency;
    this.otherBonus = otherBonus;
    this.armorMalus = armorMalus;
  }
}

export class Spell {
  readonly name: string;
  readonly description: string;
  readonly traits: string[];
  readonly prepared: boolean;
  readonly spellCost: SpellCost;
  readonly restrictions: SpellRestrictions;

  constructor(
    name: string,
    description: string = null,
    traits: string[] = [],
    spellCost: SpellCost = null,
    prepared: boolean = false,
    restrictions: SpellRestrictions = null,
  ) {
    this.name = name;
    this.description = description;
    this.traits = traits;
    this.spellCost = spellCost;
    this.prepared = prepared;
    this.restrictions = restrictions;
  }
}

export class Lore extends Skill {
  name: string;

  constructor(
    name: string,
    proficiency: Proficiency = Proficiency.U,
    otherBonus: number | null = null,
    armorMalus: number | null = null,
  ) {
    super(proficiency, otherBonus, armorMalus);
    this.name = name;
  }
}

export interface SpellAttackDC {
  key: Ability;
  attackProficiency?: Proficiency;
  dcProficiency?: Proficiency;
}

export interface SpellCost {
  actions?: number;
  components?: SpellComponents[];
  focusPoints?: number;
}

export enum SpellComponents {
  Material = 'Material',
  Verbal = 'Verbal',
  Somatic = 'Somatic',
}

export interface SpellRestrictions {
  save?: SaveType;
  range?: string;
  area?: string;
  targets?: string;
  frequency?: string;
  duration?: string;
}

export interface SpellSlot {
  level: number;
  total: number;
  remaining: number;
}

export interface SpellSlots {
  cantripLevel: number;
  spellSlots?: SpellSlot[];
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
  otherBonus: number;

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
    otherBonus: number = null,
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

export class WeaponProficiencies {
  simple: Proficiency;
  martial: Proficiency;
  other: Map<string, Proficiency>;

  constructor(
    simple: Proficiency = null,
    martial: Proficiency = null,
    other: Map<string, Proficiency> = null,
  ) {
    this.simple = simple;
    this.martial = martial;
    this.other = other ? other : new Map();
  }
}
