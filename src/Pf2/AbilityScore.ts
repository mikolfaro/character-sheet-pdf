import Ability from './Ability';

export default class AbilityScores {
  scores: Map<Ability, number>;

  constructor(
    STR: number,
    DEX: number,
    CON: number,
    INT: number,
    WIS: number,
    CHA: number,
  ) {
    this.scores = new Map<Ability, number>();
    this.scores.set(Ability.STR, STR);
    this.scores.set(Ability.DEX, DEX);
    this.scores.set(Ability.CON, CON);
    this.scores.set(Ability.INT, INT);
    this.scores.set(Ability.WIS, WIS);
    this.scores.set(Ability.CHA, CHA);
  }

  modifier(ability: Ability): number {
    return (this.scores.get(ability) - 10) / 2;
  }

  entries() {
    return this.scores.entries();
  }
}
