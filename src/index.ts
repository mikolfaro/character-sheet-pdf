import './style.css';
import Pf2 from './Pf2';
import Proficiency from "./Pf2/Proficiency";
import Ability from "./Pf2/Ability";
import Skill from "./Pf2/Skill";
import Lore from "./Pf2/Lore";
import AbilityScores from "./Pf2/AbilityScore";
import ArmorClass from "./Pf2/ArmorClass";
import SavingThrow from "./Pf2/SavingThrows";
import HitPoints from "./Pf2/HitPoints";
import Perception from "./Pf2/Perception";
import Strike from "./Pf2/Strike";
import WeaponProficiencies from "./Pf2/WeaponProficiencies";

async function init() {
    const object: HTMLObjectElement = <HTMLObjectElement>document.getElementById('pdf');
    const pdf = await Pf2.create();

    // First page

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

    // // Second page
    pdf.ancestryFeatS1 = {name: 'Versatile Human'};
    pdf.heritageFeat1 = {name: 'Fleet'};
    pdf.ancestryFeat1 = {name: 'Natural Ambition'};
    pdf.ancestryFeat5 = {name: 'Haught Obstinacy'};
    pdf.ancestryFeat9 = {name: 'Group Aid'};
    pdf.ancestryFeat13 = {name: 'Bounce Back'};
    pdf.ancestryFeat17 = {name: 'Heroic Presence'};

    pdf.classFeat1 = {name: 'Raging Intimidation'};
    pdf.classFeat2 = {name: 'Sudden Charge'};
    pdf.classFeat4 = {name: 'Swipe'};
    pdf.classFeat6 = {name: 'Dragon\'s Rage Breath'};
    pdf.classFeat8 = {name: 'Scouring Rage'};
    pdf.classFeat10 = {name: 'Terrifying Howl'};
    pdf.classFeat12 = {name: 'Dragon\'s Rage Wings'};
    pdf.classFeat14 = {name: 'Unbalancing Sweep'};
    pdf.classFeat16 = {name: 'Dragon Transformation'};
    pdf.classFeat18 = {name: 'Brutal Critical'};
    pdf.classFeat20 = {name: 'Unstoppable Juggernaut'};

    pdf.skillFeatB = {name: 'Cat Fall'};
    pdf.skillFeat2 = {name: 'Titan Wrestler'};
    pdf.skillFeat4 = {name: 'Intimidating Prowess'};
    pdf.skillFeat6 = {name: 'Terrifying Resistance'};
    pdf.skillFeat8 = {name: 'Battle Cry'};
    pdf.skillFeat10 = {name: 'Terrified Retreat'};
    pdf.skillFeat12 = {name: 'Assurance - Stealth'};
    pdf.skillFeat14 = {name: 'Assurance - Diplomacy'};
    pdf.skillFeat16 = {name: 'Group Coercion'};
    pdf.skillFeat18 = {name: 'Aerobatics Mastery'};
    pdf.skillFeat20 = {name: 'Additional Lore - Dragon Lore'};

    pdf.generalFeat3 = {name: 'Canny Acumen - Reflex'};
    pdf.generalFeat7 = {name: 'Toughness'};
    pdf.generalFeat11 = {name: 'Incredible Initiative'};
    pdf.generalFeat15 = {name: 'Feather Step'};
    pdf.generalFeat19 = {name: 'Incredible Investiture'};

    pdf.bonusFeats = [
        {name: 'Draconic Arrogance'},
        {name: 'Opportunist'},
        {name: 'Basic Maneuver'},
        {name: 'Power Attack'},
        {name: 'Furious Focus'},
        {name: 'Fighter Dedication'},
        {name: 'Advanced Maneuver'},
        {name: 'Lunge'},
        {name: 'Knockdown'},
        {name: 'Shatter Defences'},
        {name: 'Positioning Assault'},
        {name: 'Felling Strike'},
        {name: 'Combat Reflexes'},
    ];

    pdf.classFeature1_1 = {name: 'Rage'};
    pdf.classFeature1_2 = {name: 'Instinct - Dragon'};
    pdf.classFeature3 = {name: 'Deny Advantage'};
    pdf.classFeature5 = {name: 'Brutality'};
    pdf.classFeature7 = {name: 'Weapon Specialization'};
    pdf.classFeature9 = {name: 'Lightning Reflexes'};
    pdf.classFeature11 = {name: 'Mighty Rage'};
    pdf.classFeature13 = {name: 'Greater Juggernaut, Medium Armor Expertise, Weapon Fury'};
    pdf.classFeature15 = {name: 'Greater Weapon Specialization, Indomitable Will'};
    pdf.classFeature17 = {name: 'Heightened Senses, Quick Rage'};
    pdf.classFeature19 = {name: 'Armor Of Fury, Devastator'};

    pdf.dataUri().then((data) => {
        object.setAttribute('data', data);
    });
}

init();
