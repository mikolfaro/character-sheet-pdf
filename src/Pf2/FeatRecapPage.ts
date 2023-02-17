import { PDFDocument, PDFPage } from 'pdf-lib';
import Feat from './Feat';

export default class FeatRecapPage {
  readonly TITLE_PADDING_BOTTOM = 14;
  readonly TITLE_SIZE = 12;
  readonly COLUMN_WIDTH = 160;
  readonly COLUMN_GAP = 40;

  private pdfDoc: PDFDocument;
  private _pdfPage: PDFPage;
  private width: number;
  private height: number;

  constructor(pdfDoc: PDFDocument) {
    this.pdfDoc = pdfDoc;
    const { width: width, height: height } = this.pdfDoc.getPage(0).getSize();
    this.width = width;
    this.height = height;
    this._pdfPage = this.pdfDoc.addPage([this.width, this.height]);

    this._pdfPage.moveTo(22, 740);
    this._pdfPage.drawText('Feat and feature details', { size: 16 });
  }

  addFeats(feats: Feat[]) {
    this._pdfPage.moveTo(22, 708);
    feats.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });

    this.chunks(feats, 18).forEach((featsChunk, chunkIdx) => {
      if (chunkIdx) {
        this._pdfPage = this.pdfDoc.addPage([this.width, this.height]);
        this._pdfPage.moveTo(22, 708);
      }

      featsChunk.forEach((feat, idx) => {
        this._pdfPage.drawText(feat.name, { size: this.TITLE_SIZE });
        this._pdfPage.moveDown(this.TITLE_PADDING_BOTTOM);
        if (feat.description) {
          this._pdfPage.drawText(feat.description, {
            size: 8,
            maxWidth: this.COLUMN_WIDTH,
            lineHeight: 10,
          });
        }

        if (idx % 3 !== 2) {
          this._pdfPage.moveRight(this.COLUMN_WIDTH + this.COLUMN_GAP);
          this._pdfPage.moveUp(this.TITLE_PADDING_BOTTOM);
        } else {
          this._pdfPage.moveDown(100);
          this._pdfPage.moveLeft((this.COLUMN_WIDTH + this.COLUMN_GAP) * 2);
        }
      });
    });
  }

  private chunks(feats: Feat[], size: number): Feat[][] {
    return Array.from(new Array(Math.ceil(feats.length / size)), (_, i) =>
      feats.slice(i * size, i * size + size),
    );
  }
}
