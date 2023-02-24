import Proficiency from './Proficiency';

export default interface WeaponProficiencies {
  simple?: Proficiency;
  martial?: Proficiency;
  unarmed?: Proficiency;
  other?: Map<string, Proficiency>;
}
