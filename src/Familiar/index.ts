import PDF from "../Familiar/sheet.pdf";
import { PDFDocument, PDFForm } from "pdf-lib";

export default class Familiar {

    private pdfDoc: PDFDocument;
    private form: PDFForm;

    static async create() {
        const instance = new Familiar();
        await instance.loadPdf();
        return instance;
    }

    dataUri(): Promise<string> {
        return this.pdfDoc.saveAsBase64({ dataUri: true });
    }

    private constructor() {}

    private async loadPdf() {
        this.pdfDoc = await PDFDocument.load(PDF);
        this.form = this.pdfDoc.getForm();
    }
}
