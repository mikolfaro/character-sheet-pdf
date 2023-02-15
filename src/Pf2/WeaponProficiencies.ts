import Proficiency from "./Proficiency";

export default class WeaponProficiencies {
    simple: Proficiency;
    martial: Proficiency;
    other: Map<string, Proficiency>;

    constructor(
        simple: Proficiency = null,
        martial: Proficiency = null,
        other: Map<string, Proficiency> = null
    ) {
        this.simple = simple;
        this.martial = martial;
        this.other = other ? other : new Map();
    }
}
