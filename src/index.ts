import './style.css';
import Pf2, {
    AbilityScores,
    ArmorClass,
    HitPoints,
    Lore,
    Perception,
    SavingThrow,
    Skill,
    Strike,
    WeaponProficiencies
} from './Pf2';
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
    pdf.armorClass = new ArmorClass(2, Proficiency.M, Proficiency.M, Proficiency.M, Proficiency.U, Proficiency.M, 2);

    pdf.fortitude = new SavingThrow(Proficiency.L);
    pdf.reflex = new SavingThrow(Proficiency.M);
    pdf.will = new SavingThrow(Proficiency.M);
    pdf.hitPoints = new HitPoints(368, 368);
    pdf.perception = new Perception(Proficiency.M);
    pdf.speed = 30;
    pdf.acrobatics = new Skill(Proficiency.L);
    pdf.arcana = new Skill();
    pdf.athletics = new Skill(Proficiency.L);
    pdf.crafting = new Skill(Proficiency.U);
    pdf.deception = new Skill(Proficiency.U);
    pdf.diplomacy = new Skill(Proficiency.T);
    pdf.intimidation = new Skill(Proficiency.L);
    pdf.medicine = new Skill(Proficiency.T);
    pdf.nature = new Skill(Proficiency.U)
    pdf.occultism = new Skill();
    pdf.performance = new Skill();
    pdf.religion = new Skill();
    pdf.society = new Skill();
    pdf.stealth = new Skill(Proficiency.T);
    pdf.survival = new Skill(Proficiency.T);
    pdf.thievery = new Skill(Proficiency.U);
    pdf.lore1 = new Lore('Warfare', Proficiency.T);
    pdf.lore2 = new Lore('Dragon', Proficiency.L);

    pdf.meeleeStrikes = [
        new Strike(
            'Ouroboros Flail (greater)', Ability.STR, Proficiency.M,
            '3D10', '+12', 'B',
        ),
        new Strike(
            'Skyrider Sword', Ability.STR, Proficiency.M,
            '3D12', '+12', 'S', ['1d6 electricity']
        ),
    ];

    pdf.rangedStrikes = [
        new Strike(
            'Longbow', Ability.DEX, Proficiency.M,
            '1d8', '+6', 'S', [], ['Range 100ft']
        ),
    ];

    pdf.weaponProficiencies = new WeaponProficiencies(Proficiency.M, Proficiency.M, new Map([
        ['Unarmed', Proficiency.M],
    ]));

    pdf.languages = ['Common', 'Draconic', 'Thien'];

    pdf.dataUri().then((data) => {
        console.log(data);
        object.setAttribute('data', data);
    });
}

init();
