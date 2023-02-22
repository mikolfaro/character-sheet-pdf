import { PDFDocument } from "pdf-lib";

export default class CompanionPage {
    private pdfDoc: PDFDocument;

    constructor(pdfDoc: PDFDocument) {
        this.pdfDoc = pdfDoc;
    }
}
