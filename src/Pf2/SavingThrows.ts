import Proficiency from "./Proficiency";

export default class SavingThrow {
    proficiency: Proficiency;
    otherBonus: number;

    constructor(proficiency: Proficiency, otherBonus: number|null = null) {
        this.proficiency = proficiency;
        this.otherBonus = otherBonus;
    }
}
