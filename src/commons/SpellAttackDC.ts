import Ability from './Ability';
import Proficiency from './Proficiency';

export default interface SpellAttackDC {
  key: Ability;
  attackProficiency?: Proficiency;
  dcProficiency?: Proficiency;
}
