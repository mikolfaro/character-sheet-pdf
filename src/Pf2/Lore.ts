import Proficiency from './Proficiency';
import Skill from './Skill';

export default class Lore extends Skill {
  name: string;

  constructor(
    name: string,
    proficiency: Proficiency = Proficiency.U,
    otherBonus: number | null = null,
    armorMalus: number | null = null,
  ) {
    super(proficiency, otherBonus, armorMalus);
    this.name = name;
  }
}
