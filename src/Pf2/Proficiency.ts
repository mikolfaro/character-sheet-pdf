export default class Proficiency {
  static U = new Proficiency('U', 0);
  static T = new Proficiency('T', 2);
  static E = new Proficiency('E', 4);
  static M = new Proficiency('M', 6);
  static L = new Proficiency('L', 8);

  private readonly name: string;
  private readonly baseValue: number;

  constructor(name: string, baseValue: number) {
    this.name = name;
    this.baseValue = baseValue;
  }

  toString() {
    return this.name;
  }

  bonus(level: number): number {
    return this === Proficiency.U ? 0 : this.baseValue + level;
  }
}
