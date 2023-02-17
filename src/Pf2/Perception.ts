import Proficiency from './Proficiency';

export default class Perception {
  proficiency: Proficiency;
  otherBonus: number | null;
  senses: string[];

  constructor(
    proficency: Proficiency = Proficiency.U,
    otherBonus: number | null = null,
    senses: string | string[] = [],
  ) {
    this.proficiency = proficency;
    this.otherBonus = otherBonus;
    this.senses = Array.isArray(senses) ? senses : [senses];
  }
}
