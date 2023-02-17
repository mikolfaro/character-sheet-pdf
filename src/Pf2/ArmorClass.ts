import Proficiency from './Proficiency';

export default class ArmorClass {
  cap: number | null;
  unarmored: Proficiency;
  light = Proficiency.U;
  medium = Proficiency.U;
  heavy = Proficiency.U;
  current = Proficiency.U;
  otherBonus: number | null;

  constructor(
    cap: number | null = null,
    unarmored = Proficiency.U,
    light = Proficiency.U,
    medium = Proficiency.U,
    heavy = Proficiency.U,
    current = Proficiency.U,
    otherBonus: number | null = null,
  ) {
    this.cap = cap;
    this.unarmored = unarmored;
    this.light = light;
    this.medium = medium;
    this.heavy = heavy;
    this.current = current;
    this.otherBonus = otherBonus;
  }
}
