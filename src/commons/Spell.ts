import SpellCost from './SpellCost';
import SpellRestrictions from './SpellRestrictions';
import Save from './Save';

export default interface Spell {
  name: string;
  description: string;
  traits: string[];
  prepared: boolean;
  spellCost: SpellCost;
  restrictions: SpellRestrictions;
  save: Save;
}
