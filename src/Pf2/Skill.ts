import Proficiency from "./Proficiency";

export default class Skill {
    proficiency: Proficiency;
    otherBonus: number|null;
    armorMalus: number | null;

    constructor(proficiency: Proficiency = Proficiency.U, otherBonus: number|null = null, armorMalus: number | null = null) {
        this.proficiency = proficiency
        this.otherBonus = otherBonus;
        this.armorMalus = armorMalus;
    }
}
