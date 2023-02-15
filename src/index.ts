import './style.css';
import Pf2, { AbilityScores } from './Pf2';
import Proficiency from "./Pf2/Proficiency";
import Ability from "./Pf2/Ability";

async function init() {
    const object: HTMLObjectElement = <HTMLObjectElement>document.getElementById('pdf');
    const pdf = await Pf2.create();

    pdf.characterName = 'Ugo';
    pdf.playerName = 'Mikol';
    pdf.ancestryAndHeritage = 'Versatile Human';
    pdf.class = 'Barbarian';
    pdf.background = 'Martial Disciple - Acrobatics';
    pdf.size = 'M';
    pdf.alignement = 'CN';
    pdf.traits = ['Human', 'Humanoid'];
    pdf.deity = 'Atheist';
    pdf.level = 20;
    pdf.heroPoints = 1;
    pdf.experiencePointsXp = 12;
    pdf.abilityScores = new AbilityScores(22, 14, 20, 12, 18, 18 );

    pdf.classDc = { keyAbility: Ability.STR, proficiency: Proficiency.M, otherBonus: null };

    pdf.dataUri().then((data) => {
        console.log(data);
        object.setAttribute('data', data);
    });
}

init();
