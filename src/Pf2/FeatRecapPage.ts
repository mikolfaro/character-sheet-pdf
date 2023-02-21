import { PDFDocument, PDFForm, PDFPage, PDFTextField } from 'pdf-lib';
import Feat from './Feat';

export default class FeatRecapPage {
  readonly HORIZONTAL_PADDING = 22;

  private pdfDoc: PDFDocument;
  private form: PDFForm;
  private _pdfPage: PDFPage;
  readonly width: number;
  readonly height: number;
  private availableFieldCount = 0;
  readonly FIELDS_PER_PAGE = 18;

  constructor(pdfDoc: PDFDocument) {
    this.pdfDoc = pdfDoc;
    this.form = this.pdfDoc.getForm();

    const { width: width, height: height } = this.pdfDoc.getPage(0).getSize();
    this.width = width;
    this.height = height;
    this._pdfPage = this.pdfDoc.addPage([this.width, this.height]);

    this.insertTitle();
    this.insertFields(this._pdfPage);
  }

  addFeats(feats: Feat[]) {
    console.log(feats);

    if (feats.length > this.availableFieldCount) {
      const extraPagesNeeded =
        (feats.length - this.availableFieldCount) / this.FIELDS_PER_PAGE;
      console.log(extraPagesNeeded);
      this.appendExtraPages(extraPagesNeeded);
    }

    this._pdfPage.moveTo(22, 708);
    feats
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      })
      .forEach((feat, idx) => {
        this.setTextField(`FEAT_COMPLETE${idx + 1}_NAME`, feat.name);
        this.setTextField(
          `FEAT_COMPLETE${idx + 1}_DESCRIPTION`,
          feat.description,
        );
      });
  }

  private insertTitle() {
    this._pdfPage.moveTo(this.HORIZONTAL_PADDING, 740);
    this._pdfPage.drawText('FEATS AND FEATURES DETAIL', { size: 16 });
  }

  private insertFields(page: PDFPage) {
    const fieldWidth = (this.width - this.HORIZONTAL_PADDING * 3) / 2;

    for (let i = 0; i < this.FIELDS_PER_PAGE; i += 2) {
      const idx = i + this.availableFieldCount;

      const leftNameField = this.form.createTextField(
        `FEAT_COMPLETE${idx + 1}_NAME`,
      );
      leftNameField.addToPage(page, {
        x: this.HORIZONTAL_PADDING,
        y: 700 - i * 38,
        height: 16,
        width: fieldWidth,
      });

      const leftDescriptionField = this.form.createTextField(
        `FEAT_COMPLETE${idx + 1}_DESCRIPTION`,
      );
      leftDescriptionField.addToPage(page, {
        x: this.HORIZONTAL_PADDING,
        y: 700 - i * 38 - 50,
        height: 50,
        width: fieldWidth,
      });
      leftDescriptionField.setFontSize(8);
      leftDescriptionField.enableMultiline();

      const rightNameField = this.form.createTextField(
        `FEAT_COMPLETE${idx + 2}_NAME`,
      );
      rightNameField.addToPage(page, {
        x: this.HORIZONTAL_PADDING * 2 + fieldWidth,
        y: 700 - i * 38,
        height: 16,
        width: fieldWidth,
      });

      const rightDescriptionField = this.form.createTextField(
        `FEAT_COMPLETE${idx + 2}_DESCRIPTION`,
      );
      rightDescriptionField.addToPage(page, {
        x: this.HORIZONTAL_PADDING * 2 + fieldWidth,
        y: 700 - i * 38 - 50,
        height: 50,
        width: fieldWidth,
      });
      rightDescriptionField.setFontSize(8);
      rightDescriptionField.enableMultiline();
    }

    console.log('Added fields', this.availableFieldCount, this.FIELDS_PER_PAGE);
    this.availableFieldCount += this.FIELDS_PER_PAGE;
  }

  private appendExtraPages(count: number) {
    for (let i = 0; i < count; i++) {
      const page = this.pdfDoc.addPage([this.width, this.height]);
      this.insertFields(page);
    }
  }

  private setTextField(
    name: string,
    value: string | number | null,
    strict: boolean = false,
  ) {
    if (value === null || value === undefined) {
      return;
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
}
