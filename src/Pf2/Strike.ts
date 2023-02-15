import Ability from "./Ability";
import Proficiency from "./Proficiency";

export default class Strike {
    weapon: string;
    keyAbility: Ability;
    proficiency: Proficiency;
    damageDice: string;
    damageBonus: string;
    damageType: string;
    otherNotes: string[];
    traits: string[];
    special: number;
    wSpec: number;
    otherBonus: number

    constructor(
        weapon: string,
        keyAbility: Ability,
        proficiency: Proficiency,
        damageDice: string,
        damageBonus: string,
        damageType: string,
        other: string[] | string = [],
        traits: string[] | string = [],
        special: number = null,
        wSpec: number = null,
        otherBonus: number = null
    ) {
        this.weapon = weapon;
        this.keyAbility = keyAbility;
        this.proficiency = proficiency;
        this.damageDice = damageDice;
        this.damageBonus = damageBonus;
        this.damageType = damageType;
        this.otherNotes = Array.isArray(other) ? other : [other];
        this.traits = Array.isArray(traits) ? traits : [traits];
        this.special = special;
        this.wSpec = wSpec;
        this.otherBonus = otherBonus;
    }
}
