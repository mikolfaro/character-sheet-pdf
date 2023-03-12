import Form from './Form';
import { Proficiency } from './commons';

export default class Base {
  protected form: Form;

  protected _level: number;

  protected formatModifier(mod: number | null): string {
    if (mod === null || mod === undefined) {
      return '';
    }

    return mod < 0 ? `${mod}` : `+${mod}`;
  }

  protected setTextField(
    name: string,
    value: string | string[] | number | null,
    strict: boolean = false,
  ) {
    this.form.setTextField(name, value, strict);
  }

  protected setModField(name: string, value: number) {
    this.form.setModField(name, value);
  }

  protected setCheckBox(fieldName: string) {
    this.form.setCheckBox(fieldName);
  }

  protected setProficiencyFields(proficiencyName: string, value: Proficiency) {
    this.form.setProficiencyFields(proficiencyName, this._level, value);
  }
}
