import SaveType from './SaveType';

export default interface SpellRestrictions {
  save?: SaveType;
  range?: string;
  area?: string;
  targets?: string;
  frequency?: string;
  duration?: string;
}
