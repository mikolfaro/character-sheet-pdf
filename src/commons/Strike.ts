import Proficiency from './Proficiency';
import Ability from './Ability';

export default interface Strike {
  weapon?: string;
  keyAbility?: Ability;
  proficiency?: Proficiency;
  damageDice?: string;
  damageBonus?: string;
  damageType?: string;
  other?: string[];
  traits?: string[];
  special?: number;
  wSpec?: number;
  otherBonus?: number;
  notes?: string;
  critical?: string;
}
