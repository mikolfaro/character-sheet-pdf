import Proficiency from './Proficiency';

export default interface Skill {
  proficiency?: Proficiency;
  otherBonus?: number;
  armorMalus?: number;
}
