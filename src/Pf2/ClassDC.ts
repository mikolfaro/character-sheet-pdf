import Ability from './Ability';
import Proficiency from './Proficiency';

export default class ClassDC {
  keyAbility: Ability;
  proficiency: Proficiency;
  otherBonus: number | null;

  constructor(
    keyAbility: Ability,
    proficiency: Proficiency = Proficiency.U,
    otherBonus: number | null = null,
  ) {
    this.keyAbility = keyAbility;
    this.proficiency = proficiency;
    this.otherBonus = otherBonus;
  }
}
