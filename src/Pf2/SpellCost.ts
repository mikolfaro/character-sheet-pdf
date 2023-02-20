import SpellComponents from './SpellComponents';

export default interface SpellCost {
  actions?: number;
  components?: SpellComponents[];
  focusPoints?: number;
}
