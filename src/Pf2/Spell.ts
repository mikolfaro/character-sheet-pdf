import SpellCost from './SpellCost';
import SpellRestrictions from './SpellRestrictions';

export default class Spell {
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
