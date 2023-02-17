export default class HitPoints {
  max: number;
  current: number;
  temporary: number | null = null;
  dying: number | null = null;
  wounded: number | null = null;
  resistances: string[] = [];
  conditions: string[] = [];

  constructor(
    max: number,
    current: number,
    temporary: number | null = null,
    dying: number | null = null,
    wounded: number | null = null,
    resistances: string[] | string = [],
    conditions: string[] | string = [],
  ) {
    this.max = max;
    this.current = current;
    this.temporary = temporary;
    this.dying = dying;
    this.wounded = wounded;
    this.resistances = Array.isArray(resistances) ? resistances : [resistances];
    this.conditions = Array.isArray(conditions) ? conditions : [conditions];
  }
}
