import Ability from "./Ability";

export default class AbilityScores {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;

    constructor(STR: number, DEX: number, CON: number, INT: number, WIS: number, CHA: number) {
        this.STR = STR;
        this.DEX = DEX;
        this.CON = CON;
        this.INT = INT;
        this.WIS = WIS;
        this.CHA = CHA;
    }

    modifier(ability: Ability): number {
        return (this[ability] - 10) / 2;
    }
}
