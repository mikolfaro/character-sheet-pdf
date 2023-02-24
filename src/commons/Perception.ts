import Proficiency from './Proficiency';

export default interface Perception {
  proficiency?: Proficiency;
  otherBonus?: number;
  senses?: string[] | string;
}
