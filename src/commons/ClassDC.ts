import Ability from './Ability';
import Proficiency from './Proficiency';

export default interface ClassDC {
  keyAbility: Ability;
  proficiency?: Proficiency;
  otherBonus?: number;
}
