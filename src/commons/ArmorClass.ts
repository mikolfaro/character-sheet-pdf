import Shield from './Shield';
import Proficiency from './Proficiency';

export default interface ArmorClass {
  cap?: number;
  unarmored?: Proficiency;
  light?: Proficiency;
  medium?: Proficiency;
  heavy?: Proficiency;
  current?: Proficiency;
  shield?: Shield;
  otherBonus?: number;
}
