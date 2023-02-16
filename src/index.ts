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
    pdf.ancestryFeatS1 = {name: 'Versatile Human', description: 'Humanity’s versatility and ambition have fueled its ascendance to be the most common ancestry in most nations throughout the world. Select a general feat of your choice for which you meet the prerequisites.'};
    pdf.heritageFeat1 = {name: 'Fleet', description: 'You move more quickly on foot. Your Speed increases by 5 feet.'};
    pdf.ancestryFeat1 = {name: 'Natural Ambition', description: 'You were raised to be ambitious and always reach for the stars, leading you to progress quickly in your chosen field. You gain a 1st-level class feat for your class.'};
    pdf.ancestryFeat5 = {name: 'Haught Obstinacy', description: 'Your powerful ego makes it harder for others to order you around. If you roll a success on a saving throw against a mental effect that attempts to directly control your actions, you critically succeed instead. If a creature rolls a failure on a check to Coerce you using Intimidation, it gets a critical failure instead (so it can’t try to Coerce you again for 1 week).'};
    pdf.ancestryFeat9 = {name: 'Group Aid'};
    pdf.ancestryFeat13 = {name: 'Bounce Back'};
    pdf.ancestryFeat17 = {name: 'Heroic Presence'};

    pdf.classFeat1 = {name: 'Raging Intimidation', description: 'Your fury fills your foes with fear. While you are raging, your Demoralize and Scare to Death actions gain the rage trait, allowing you to use them while raging. As soon as you meet the prerequisites for the skill feats Intimidating Glare and Scare to Death, you gain these feats.'};
    pdf.classFeat2 = {name: 'Sudden Charge', description: 'With a quick sprint, you dash up to your foe and swing. Stride twice. If you end your movement within melee reach of at least one enemy, you can make a melee Strike against that enemy. You can use Sudden Charge while Burrowing, Climbing, Flying, or Swimming instead of Striding if you have the corresponding movement type.'};
    pdf.classFeat4 = {name: 'Swipe', description: 'You make a wide, arcing swing. Make a single melee Strike and compare the attack roll result to the ACs of up to two foes, each of whom must be within your melee reach and adjacent to the other.'};
    pdf.classFeat6 = {name: 'Dragon\'s Rage Breath'};
    pdf.classFeat8 = {name: 'Scouring Rage'};
    pdf.classFeat10 = {name: 'Terrifying Howl'};
    pdf.classFeat12 = {name: 'Dragon\'s Rage Wings'};
    pdf.classFeat14 = {name: 'Unbalancing Sweep'};
    pdf.classFeat16 = {name: 'Dragon Transformation'};
    pdf.classFeat18 = {name: 'Brutal Critical'};
    pdf.classFeat20 = {name: 'Unstoppable Juggernaut'};

    pdf.skillFeatB = {name: 'Cat Fall'};
    pdf.skillFeat2 = {name: 'Titan Wrestler', description: 'You can attempt to Disarm, Grapple, Shove, or Trip creatures up to two sizes larger than you, or up to three sizes larger than you if you’re legendary in Athletics.'};
    pdf.skillFeat4 = {name: 'Intimidating Prowess', description: 'In situations where you can physically menace the target when you Coerce or Demoralize, you gain a +1 circumstance bonus to your Intimidation check and you ignore the penalty for not sharing a language. If your Strength score is 20 or higher and you are a master in Intimidation, this bonus increases to +2.'};
    pdf.skillFeat6 = {name: 'Terrifying Resistance'};
    pdf.skillFeat8 = {name: 'Battle Cry'};
    pdf.skillFeat10 = {name: 'Terrified Retreat'};
    pdf.skillFeat12 = {name: 'Assurance - Stealth'};
    pdf.skillFeat14 = {name: 'Assurance - Diplomacy'};
    pdf.skillFeat16 = {name: 'Group Coercion'};
    pdf.skillFeat18 = {name: 'Aerobatics Mastery'};
    pdf.skillFeat20 = {name: 'Additional Lore - Dragon Lore'};

    pdf.generalFeat3 = {name: 'Canny Acumen - Reflex', description: 'You become an expert in Reflex saves. At 17th level, you become a master instead.'};
    pdf.generalFeat7 = {name: 'Toughness'};
    pdf.generalFeat11 = {name: 'Incredible Initiative'};
    pdf.generalFeat15 = {name: 'Feather Step'};
    pdf.generalFeat19 = {name: 'Incredible Investiture'};

    pdf.bonusFeats = [
        {name: 'Draconic Arrogance', description: 'Few can sway you from your goals while the fury of combat fills you. While raging, you gain a +2 status bonus to saving throws against emotion effects.'},
        {name: 'Opportunist', description: 'You gain the Attack of Opportunity reaction.'},
        {name: 'Basic Maneuver'},
        {name: 'Power Attack'},
        {name: 'Furious Focus'},
        {name: 'Fighter Dedication', description: 'You become trained in simple weapons and martial weapons. You become trained in your choice of Acrobatics or Athletics; if you are already trained in both of these skills, you instead become trained in a skill of your choice. You become trained in fighter class DC.'},
        {name: 'Advanced Maneuver'},
        {name: 'Lunge'},
        {name: 'Knockdown'},
        {name: 'Shatter Defences'},
        {name: 'Positioning Assault'},
        {name: 'Felling Strike'},
        {name: 'Combat Reflexes'},
    ];

    pdf.classFeature1_1 = {name: 'Rage', description: 'You gain the Rage action, which lets you fly into a frenzy.'};
    pdf.classFeature1_2 = {name: 'Instinct - Dragon', description: 'When you use draconic rage, you increase the additional damage from Rage from 4 to 8. If you have greater weapon specialization, instead increase the damage from Rage when using draconic rage from 8 to 16.'};
    pdf.classFeature3 = {name: 'Deny Advantage', description: 'Your foes struggle to pass your defenses. You aren’t flat-footed to hidden, undetected, or flanking creatures of your level or lower, or creatures of your level or lower using surprise attack. However, they can still help their allies flank.'};
    pdf.classFeature5 = {name: 'Brutality', description: 'Your fury makes your weapons lethal. Your proficiency ranks for simple weapons, martial weapons, and unarmed attacks increase to expert. While raging, you gain access to the critical specialization effects for melee weapons and unarmed attacks.'};
    pdf.classFeature7 = {name: 'Weapon Specialization'};
    pdf.classFeature9 = {name: 'Lightning Reflexes'};
    pdf.classFeature11 = {name: 'Mighty Rage'};
    pdf.classFeature13 = {name: 'Greater Juggernaut, Medium Armor Expertise, Weapon Fury'};
    pdf.classFeature15 = {name: 'Greater Weapon Specialization, Indomitable Will'};
    pdf.classFeature17 = {name: 'Heightened Senses, Quick Rage'};
    pdf.classFeature19 = {name: 'Armor Of Fury, Devastator'};

    pdf.appendFeatDetails();

    pdf.dataUri().then((data) => {
        object.setAttribute('data', data);
    });
}

init();
