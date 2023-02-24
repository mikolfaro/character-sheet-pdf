export default interface HitPoints {
  max: number;
  current: number;
  temporary?: number;
  dying?: number;
  wounded?: number;
  resistances?: string[];
  conditions?: string[];
}
