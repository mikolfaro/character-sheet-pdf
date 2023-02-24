import {
  PDFButton,
  PDFCheckBox,
  PDFForm,
  PDFImage,
  PDFTextField,
} from 'pdf-lib';

import { Proficiency } from './commons';

export default class Form {
  private form: PDFForm;

  constructor(form: PDFForm) {
    this.form = form;
  }

  setTextField(
    name: string,
    value: string | number | string[] | null,
    strict: boolean = false,
  ) {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value = this.formatList(value);
    }

    if (strict) {
      const field = this.form.getTextField(name);
      field.setText(value.toString());
    } else {
      const field = this.form.getFieldMaybe(name);
      if (field && field instanceof PDFTextField) {
        field.setText(value.toString());
      }
    }
  }

  setCheckBox(fieldName: string) {
    const checkboxField = this.form.getFieldMaybe(fieldName);
    if (checkboxField && checkboxField instanceof PDFCheckBox) {
      checkboxField.check();
    }
  }

  setImageField(fieldName: string, characterSketch: PDFImage) {
    const sketchButton = this.form.getField(fieldName);
    if (sketchButton instanceof PDFButton) {
      sketchButton.setImage(characterSketch);
    }
  }

  setModField(name: string, value: number) {
    const modTextField = this.form.getTextField(name);
    modTextField.setText(this.formatModifier(value));
  }

  setProficiencyFields(
    proficiencyName: string,
    level: number,
    value?: Proficiency,
  ) {
    if (!value || value === Proficiency.U) {
      return;
    }

    const profBonus = value.bonus(level);
    this.setTextField(
      `${proficiencyName}_BONUS`,
      this.formatModifier(profBonus),
    );

    // Use switch fallthrough to check all the boxes lower than current proficiency
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch#breaking_and_fall-through
    switch (value) {
      case Proficiency.L:
        this.setCheckBox(`${proficiencyName}_L`);
      case Proficiency.M:
        this.setCheckBox(`${proficiencyName}_M`);
      case Proficiency.E:
        this.setCheckBox(`${proficiencyName}_E`);
      case Proficiency.T:
        this.setCheckBox(`${proficiencyName}_T`);
    }
  }

  private formatModifier(mod: number | null): string {
    if (mod === null) {
      return '';
    }

    return mod < 0 ? `${mod}` : `+${mod}`;
  }

  private formatList(value: string[]) {
    return value.join(', ');
  }
}
