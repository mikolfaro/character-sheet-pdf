import './style.css';
import PDF from './character_sheet.pdf';

function init() {
    const object: Element = document.getElementById('pdf');
    object.setAttribute('data', PDF);
}

init();
