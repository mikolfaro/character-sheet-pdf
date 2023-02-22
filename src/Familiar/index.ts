import PDF from "../Pf2/character_sheet.pdf";
import { PDFDocument, PDFForm } from "pdf-lib";

export default class Familiar {

    private pdfDoc: PDFDocument;
    private form: PDFForm;

    static async create() {

    }

    private constructor() {}

    private async loadPdf() {
        this.pdfDoc = await PDFDocument.load(PDF);
        this.form = this.pdfDoc.getForm();
    }
}
