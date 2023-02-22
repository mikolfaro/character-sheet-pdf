import './style.css';
import sketchUrl from './Iconic_Amiri.png';
import goblinUrl from './Goblin02.png';
import {
  Ability,
  AbilityScores,
  Action,
  ArmorClass,
  HitPoints,
  Lore,
  Perception,
  Proficiency,
  SaveType,
  SavingThrow,
  Skill, Spell,
  SpellComponents,
  Strike,
  WeaponProficiencies,
} from '../src/commons'
import Charactersheet from '../src/Pf2'
import Familiar from '../src/Familiar'

async function initBarbarbarian() {
  const object = document.getElementById('pdf');
  const pdf = await Charactersheet.create();

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
  pdf.abilityScores = new AbilityScores(22, 14, 20, 12, 18, 18);

  pdf.classDc = {
    keyAbility: Ability.STR,
    proficiency: Proficiency.M,
    otherBonus: null,
  };
  pdf.armorClass = new ArmorClass(
    2,
    Proficiency.M,
    Proficiency.M,
    Proficiency.M,
    Proficiency.U,
    Proficiency.M,
    2,
  );

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
  pdf.nature = new Skill(Proficiency.U);
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
      'Ouroboros Flail (greater)',
      Ability.STR,
      Proficiency.M,
      '3D10',
      '+12',
      'B',
    ),
    new Strike(
      'Skyrider Sword',
      Ability.STR,
      Proficiency.M,
      '3D12',
      '+12',
      'S',
      ['1d6 electricity'],
    ),
  ];
  pdf.rangedStrikes = [
    new Strike(
      'Longbow',
      Ability.DEX,
      Proficiency.M,
      '1d8',
      '+6',
      'S',
      [],
      ['Range 100ft'],
    ),
  ];
  pdf.weaponProficiencies = new WeaponProficiencies(
    Proficiency.M,
    Proficiency.M,
    new Map([['Unarmed', Proficiency.M]]),
  );

  pdf.languages = ['Common', 'Draconic', 'Thien'];

  // // Second page
  pdf.ancestryFeatS1 = {
    name: 'Versatile Human',
    description:
      'Humanity’s versatility and ambition have fueled its ascendance to be the most common ancestry in most nations throughout the world. Select a general feat of your choice for which you meet the prerequisites.',
  };
  pdf.heritageFeat1 = {
    name: 'Fleet',
    description:
      'You move more quickly on foot. Your Speed increases by 5 feet.',
  };
  pdf.ancestryFeat1 = {
    name: 'Natural Ambition',
    description:
      'You were raised to be ambitious and always reach for the stars, leading you to progress quickly in your chosen field. You gain a 1st-level class feat for your class.',
  };
  pdf.ancestryFeat5 = {
    name: 'Haught Obstinacy',
    description:
      'Your powerful ego makes it harder for others to order you around. If you roll a success on a saving throw against a mental effect that attempts to directly control your actions, you critically succeed instead. If a creature rolls a failure on a check to Coerce you using Intimidation, it gets a critical failure instead (so it can’t try to Coerce you again for 1 week).',
  };
  pdf.ancestryFeat9 = { name: 'Group Aid' };
  pdf.ancestryFeat13 = { name: 'Bounce Back' };
  pdf.ancestryFeat17 = { name: 'Heroic Presence' };

  pdf.classFeat1 = {
    name: 'Raging Intimidation',
    description:
      'Your fury fills your foes with fear. While you are raging, your Demoralize and Scare to Death actions gain the rage trait, allowing you to use them while raging. As soon as you meet the prerequisites for the skill feats Intimidating Glare and Scare to Death, you gain these feats.',
  };
  pdf.classFeat2 = {
    name: 'Sudden Charge',
    description:
      'With a quick sprint, you dash up to your foe and swing. Stride twice. If you end your movement within melee reach of at least one enemy, you can make a melee Strike against that enemy. You can use Sudden Charge while Burrowing, Climbing, Flying, or Swimming instead of Striding if you have the corresponding movement type.',
  };
  pdf.classFeat4 = {
    name: 'Swipe',
    description:
      'You make a wide, arcing swing. Make a single melee Strike and compare the attack roll result to the ACs of up to two foes, each of whom must be within your melee reach and adjacent to the other.',
  };
  pdf.classFeat6 = { name: "Dragon's Rage Breath" };
  pdf.classFeat8 = { name: 'Scouring Rage' };
  pdf.classFeat10 = { name: 'Terrifying Howl' };
  pdf.classFeat12 = { name: "Dragon's Rage Wings" };
  pdf.classFeat14 = { name: 'Unbalancing Sweep' };
  pdf.classFeat16 = { name: 'Dragon Transformation' };
  pdf.classFeat18 = { name: 'Brutal Critical' };
  pdf.classFeat20 = { name: 'Unstoppable Juggernaut' };

  pdf.skillFeatB = { name: 'Cat Fall' };
  pdf.skillFeat2 = {
    name: 'Titan Wrestler',
    description:
      'You can attempt to Disarm, Grapple, Shove, or Trip creatures up to two sizes larger than you, or up to three sizes larger than you if you’re legendary in Athletics.',
  };
  pdf.skillFeat4 = {
    name: 'Intimidating Prowess',
    description:
      'In situations where you can physically menace the target when you Coerce or Demoralize, you gain a +1 circumstance bonus to your Intimidation check and you ignore the penalty for not sharing a language. If your Strength score is 20 or higher and you are a master in Intimidation, this bonus increases to +2.',
  };
  pdf.skillFeat6 = { name: 'Terrifying Resistance' };
  pdf.skillFeat8 = { name: 'Battle Cry' };
  pdf.skillFeat10 = { name: 'Terrified Retreat' };
  pdf.skillFeat12 = { name: 'Assurance - Stealth' };
  pdf.skillFeat14 = { name: 'Assurance - Diplomacy' };
  pdf.skillFeat16 = { name: 'Group Coercion' };
  pdf.skillFeat18 = { name: 'Aerobatics Mastery' };
  pdf.skillFeat20 = { name: 'Additional Lore - Dragon Lore' };

  pdf.generalFeat3 = {
    name: 'Canny Acumen - Reflex',
    description:
      'You become an expert in Reflex saves. At 17th level, you become a master instead.',
  };
  pdf.generalFeat7 = { name: 'Toughness' };
  pdf.generalFeat11 = { name: 'Incredible Initiative' };
  pdf.generalFeat15 = { name: 'Feather Step' };
  pdf.generalFeat19 = { name: 'Incredible Investiture' };

  pdf.bonusFeats = [
    {
      name: 'Draconic Arrogance',
      description:
        'Few can sway you from your goals while the fury of combat fills you. While raging, you gain a +2 status bonus to saving throws against emotion effects.',
    },
    {
      name: 'Opportunist',
      description: 'You gain the Attack of Opportunity reaction.',
    },
    { name: 'Basic Maneuver' },
    { name: 'Power Attack' },
    { name: 'Furious Focus' },
    {
      name: 'Fighter Dedication',
      description:
        'You become trained in simple weapons and martial weapons. You become trained in your choice of Acrobatics or Athletics; if you are already trained in both of these skills, you instead become trained in a skill of your choice. You become trained in fighter class DC.',
    },
    { name: 'Advanced Maneuver' },
    { name: 'Lunge' },
    { name: 'Knockdown' },
    { name: 'Shatter Defences' },
    { name: 'Positioning Assault' },
    { name: 'Felling Strike' },
    { name: 'Combat Reflexes' },
  ];

  pdf.classFeature1_1 = {
    name: 'Rage',
    description: 'You gain the Rage action, which lets you fly into a frenzy.',
  };
  pdf.classFeature1_2 = {
    name: 'Instinct - Dragon',
    description:
      'When you use draconic rage, you increase the additional damage from Rage from 4 to 8. If you have greater weapon specialization, instead increase the damage from Rage when using draconic rage from 8 to 16.',
  };
  pdf.classFeature3 = {
    name: 'Deny Advantage',
    description:
      'Your foes struggle to pass your defenses. You aren’t flat-footed to hidden, undetected, or flanking creatures of your level or lower, or creatures of your level or lower using surprise attack. However, they can still help their allies flank.',
  };
  pdf.classFeature5 = {
    name: 'Brutality',
    description:
      'Your fury makes your weapons lethal. Your proficiency ranks for simple weapons, martial weapons, and unarmed attacks increase to expert. While raging, you gain access to the critical specialization effects for melee weapons and unarmed attacks.',
  };
  pdf.classFeature7 = { name: 'Weapon Specialization' };
  pdf.classFeature9 = { name: 'Lightning Reflexes' };
  pdf.classFeature11 = { name: 'Mighty Rage' };
  pdf.classFeature13 = [
    { name: 'Greater Juggernaut' },
    { name: 'Medium Armor Expertise' },
    { name: 'Weapon Fury' },
  ];
  pdf.classFeature15 = [
    { name: 'Greater Weapon Specialization' },
    { name: 'Indomitable Will' },
  ];
  pdf.classFeature17 = [{ name: 'Heightened Senses' }, { name: 'Quick Rage' }];
  pdf.classFeature19 = [{ name: 'Armor Of Fury' }, { name: 'Devastator' }];

  pdf.wornItems = [
    {
      name: 'Longbow',
      bulk: 2,
    },
    { name: 'Ouroboros Flail (greater)', bulk: 2 },
    {
      name: 'Studded Leather',
      bulk: 1,
    },
  ];
  pdf.readiedItems = [{ name: 'Skyrider Sword', bulk: 1 }];
  pdf.otherItems = [
    {
      name: 'Adamantine',
      bulk: 1,
      quantity: 2,
    },
    { name: "Artisan's Tools", bulk: 2 },
    {
      name: "Thieve's Tools",
      bulk: 0.1,
      invested: true,
    },
  ];

  pdf.purse = { copper: 150, gold: 5, platinum: 1 };

  pdf.actions = [
    new Action(
      'Attack of Opportunity',
      0,
      true,
      false,
      [],
      'CR.140',
      'You lash out at a foe that leaves an opening. Make a melee Strike against the triggering creature. If your attack is a critical hit and the trigger was a manipulate action, you disrupt that action.',
      'A creature within your reach uses a manipulate action or a move action, makes a ranged attack, or leaves a square during a move action it’s using.',
      'once per day',
    ),
    new Action(
      'Bounce Back',
      0,
      false,
      true,
      ['Human'],
      'CR.47',
      'You recover from near-death experiences with astounding resilience. Don’t increase the value of your wounded condition due to losing the dying condition.',
      'You lose the dying condition.',
      'once per day',
    ),
    new Action(
      'Dragon Transformation',
      1,
      false,
      false,
      [
        'Barbarian',
        'Concentrate',
        'Instinct',
        'Polymorph',
        'Primal',
        'Rage',
        'Transmutation',
      ],
      'CR.93',
      'You transform into a ferocious Large dragon, gaining the effects of 6th-level dragon form except that you use your own AC and attack modifier; you also apply your extra damage from Rage. The action to Dismiss the transformation gains the rage trait. At 18th level, you gain a +20-foot status bonus to your fly Speed, your damage bonus with dragon Strikes increases to +12, your breath weapon DC is your class DC, and you gain a +14 status bonus to your breath weapon damage.',
    ),
    new Action(
      "Dragon's Rage Breath",
      2,
      false,
      false,
      ['Arcane', 'Barbarian', 'Concentrate', 'Evocation', 'Instinct', 'Rage'],
      'CR.90',
      'You breathe deeply and exhale powerful energy in a 30-foot cone or 60-foot line, dealing 1d6 damage per level. The area and damage type match those of your dragon (see Dragon Instincts table). If you used this ability in the last hour, the area and the damage are halved (15-foot cone or 30-foot line; 1d6 damage for every 2 levels). Each creature in the area must attempt a basic Reflex save.',
      null,
      'once per day',
      'You haven’t used this ability since you last Raged.',
    ),
    new Action(
      "Dragon's Rage Wings",
      1,
      false,
      false,
      ['Barbarian', 'Instinct', 'Morph', 'Primal', 'Rage', 'Transmutation'],
      'CR.92',
      'You sprout dragon wings from your back of the same color as your chosen dragon. While you are raging, you gain a fly Speed equal to your land Speed. If you are flying when your rage ends, you start to fall but the transformation only completes at the last moment, so you take no damage from the fall and land standing up.',
    ),
    new Action(
      'Felling Strike',
      2,
      false,
      false,
      ['Fighter'],
      'CR.149',
      'Your attack can ground an airborne foe. Make a Strike. If it hits and deals damage to a flying target, the target falls up to 120 feet. The fall is gradual enough that if it causes the target to hit the ground, the target takes no damage from the fall. If the attack is a critical hit, the target can’t Fly, Leap, levitate, or otherwise leave the ground until the end of your next turn.',
    ),
    new Action(
      'Heroic Presence',
      1,
      false,
      false,
      ['Emotion', 'Human', 'Mental'],
      'APG.47',
      'The blood of heroes courses through your veins, and you inspire your allies to dig deep and find a new level of resolve. You grant up to 10 willing creatures within 30 feet the effects of a 6th-level zealous conviction, though the effect automatically ends on a target if you give that target a command they would normally find repugnant. This action has the auditory trait or visual trait, depending on how you inspire your allies.',
      null,
      null,
      'once per day',
    ),
    new Action(
      'Knockdown',
      2,
      false,
      false,
      ['Fighter', 'Flourish'],
      'CR.632',
      'You make an attack to knock a foe off balance, then follow up immediately with a sweep to topple them. Make a melee Strike. If it hits and deals damage, you can attempt an Athletics check to Trip the creature you hit. If you’re wielding a two-handed melee weapon, you can ignore Trip’s requirement that you have a hand free. Both attacks count toward your multiple attack penalty, but the penalty doesn’t increase until after you’ve made both of them.',
    ),
    new Action(
      'Lunge',
      1,
      false,
      false,
      ['Fighter'],
      'CR.146',
      'Extending your body to its limits, you attack an enemy that would normally be beyond your reach. Make a Strike with a melee weapon, increasing your reach by 5 feet for that Strike. If the weapon has the disarm, shove, or trip trait, you can use the corresponding action instead of a Strike.',
      null,
      null,
      'You are wielding a melee weapon.',
    ),
    new Action(
      'Mighty Rage',
      null,
      true,
      null,
      null,
      'CR.45',
      'Use an action that has the rage trait. Alternatively, you can increase the actions of the triggering Rage to 2 to instead use a 2-action activity with the rage trait.',
      'You use the Rage action on your turn',
    ),
    new Action(
      'Scouring Rage',
      null,
      true,
      null,
      ['Barbarian'],
      'APG.110',
      'You emit a powerful surge of instinctual energy when you unleash your potential. Each adjacent creature takes damage equal to your level (basic Fortitude save against your class DC) of the same type as your additional damage during that Rage.',
    ),
  ];

  pdf.fillBulk();

  await pdf.importCharacterSketchPng(
    await fetch(sketchUrl).then((res) => res.arrayBuffer()),
  );

  pdf.appendFeatDetails();

  pdf.removeSpellPage();

  pdf.dataUri().then((data) => {
    object.setAttribute('data', data);
  });
}

async function initSorcerer() {
  const object = document.getElementById('pdf');
  const pdf = await Pf2.create();

  pdf.characterName = 'Pino';
  pdf.playerName = 'Mikol';
  pdf.experiencePointsXp = 54;
  pdf.class = 'Sorcerer';
  pdf.alignement = 'C';
  pdf.traits = ['Human', 'Humanoid'];
  pdf.deity = 'Asdrubaldeus';
  pdf.background = 'Artist';
  pdf.size = 'S';
  pdf.level = 6;
  pdf.ancestryAndHeritage = 'Unbreakable Goblin';
  pdf.heroPoints = 2;

  pdf.abilityScores = new AbilityScores(10, 18, 14, 14, 12, 18);
  pdf.classDc = {
    keyAbility: Ability.CHA,
    proficiency: Proficiency.U,
    otherBonus: null,
  };
  pdf.armorClass = new ArmorClass(
    null,
    Proficiency.T,
    Proficiency.U,
    Proficiency.U,
    Proficiency.U,
    Proficiency.T,
  );
  pdf.fortitude = new SavingThrow(Proficiency.E);
  pdf.reflex = new SavingThrow(Proficiency.T);
  pdf.will = new SavingThrow(Proficiency.E);
  pdf.hitPoints = new HitPoints(58, 45);
  pdf.perception = new Perception(Proficiency.T, null, 'Darkvision');
  pdf.speed = 25;

  pdf.meeleeStrikes = [
    new Strike(
      'Dagger of Venom',
      Ability.DEX,
      Proficiency.T,
      '2d4',
      null,
      'P',
      [],
      [
        'Agile',
        'Finesse',
        'Poison',
        'Magical',
        'Necromancy',
        'Poison',
        'Thrown 10ft',
        'Versatile S',
      ],
      null,
      null,
      1,
    ),
  ];
  pdf.rangedStrikes = [
    new Strike(
      'Caterwaul Sling',
      Ability.DEX,
      Proficiency.T,
      '2D6',
      null,
      'B',
      ['Range 50ft', 'Reload 1'],
      ['Evocation', 'Magical'],
      null,
      null,
      1,
    ),
  ];

  pdf.weaponProficiencies = new WeaponProficiencies(
    Proficiency.T,
    Proficiency.U,
    new Map([['Unarmored', Proficiency.T]]),
  );

  pdf.acrobatics = new Skill();
  pdf.arcana = new Skill(Proficiency.E);
  pdf.athletics = new Skill();
  pdf.crafting = new Skill(Proficiency.E);
  pdf.deception = new Skill();
  pdf.diplomacy = new Skill();
  pdf.intimidation = new Skill(Proficiency.T);
  pdf.lore1 = new Lore('Art', Proficiency.T);
  pdf.medicine = new Skill();
  pdf.nature = new Skill();
  pdf.occultism = new Skill(Proficiency.T);
  pdf.performance = new Skill();
  pdf.reflex = new Skill();
  pdf.religion = new Skill();
  pdf.society = new Skill(Proficiency.T);
  pdf.stealth = new Skill(Proficiency.T);
  pdf.survival = new Skill();
  pdf.thievery = new Skill(Proficiency.T);

  pdf.languages = ['Common', 'Dwarven', 'Goblin', 'Orchish'];

  pdf.heritageFeat1 = {
    name: 'Unbreakable Goblin',
    description:
      'You’re able to bounce back from injuries easily due to an exceptionally thick skull, cartilaginous bones, or some other mixed blessing. You gain 10 Hit Points from your ancestry instead of 6. When you fall, reduce the falling damage you take as though you had fallen half the distance.',
  };
  pdf.ancestryFeat1 = { name: 'Goblin Song', description: '' };
  pdf.classFeature1_1 = {
    name: 'Bloodline - Draconic',
    description:
      'The blood of dragons flows through your veins. These beasts are both fearsome in combat and skilled at magic.',
  };
  pdf.classFeature1_2 = {
    name: 'Spell Repertoire',
    description:
      'You know two 1st-level spells and four cantrips, plus one of each from your bloodline. When you gain a new level of spells, gain your bloodline spell and choose any other spells you gain.',
  };
  pdf.skillFeatB = {
    name: 'Specialty Crafting - Leatherworking',
    description: '',
  };
  pdf.skillFeat2 = { name: 'Arcane Sense', description: '' };
  pdf.classFeat2 = {
    name: 'Familiar',
    description:
      'An animal serves you and assists your spellcasting. You gain a familiar.',
  };
  pdf.generalFeat3 = { name: 'Improvised Repair' };
  pdf.classFeature3 = { name: 'Signature spell' };
  pdf.skillFeat4 = { name: 'Intimidating Glare' };
  pdf.classFeat4 = { name: 'Split Shot' };
  pdf.ancestryFeat5 = {
    name: 'Junk Tinker',
    description:
      'You can make useful tools out of even twisted or rusted scraps. When using the Crafting skill to Craft, you can make level 0 items, including weapons but not armor, out of junk. This reduces the Price to one-quarter the usual amount but always results in a shoddy item. Shoddy items normally give a penalty, but you don’t take this penalty when using shoddy items you made. You can also incorporate junk to save money while you Craft any item. This grants you a discount on the item as if you had spent 1 additional day working to reduce the cost, but the item is obviously made of junk. At the GM’s discretion, this might affect the item’s resale value depending on the buyer’s tastes.',
  };
  pdf.classFeature5 = {
    name: 'Magical fortitude',
    description:
      'Magical power has improved your body’s resiliency. Your proficiency rank for Fortitude saves increases to expert.',
  };
  pdf.classFeat6 = { name: 'Detonating Spell' };
  pdf.skillFeat6 = { name: 'Magical Shorthand' };

  pdf.spellAttack = {
    attackProficiency: Proficiency.T,
    dcProficiency: Proficiency.T,
    key: Ability.CHA,
  };
  pdf.magicTraditions = { spontaneous: true, arcane: true };
  pdf.spellSlots = {
    cantripLevel: 3,
    spellSlots: [
      { level: 1, total: 4, remaining: 3 },
      { level: 2, total: 4, remaining: 2 },
      { level: 3, total: 4, remaining: 1 },
    ],
  };

  pdf.cantrips = [
    new Spell(
      'Chill Touch',
      'Siphoning negative energy into yourself, your hand radiates a pale darkness. Your touch weakens the living and disorients undead, possibly even causing them to flee. The effect depends on whether the target is living or undead.\n •Living Creature The spell deals negative damage equal to 1d4 + 4. The target attempts a basic Fortitude save, but is also enfeebled 1 for 1 round on a critical failure.\n •Undead Creature The target is flat-footed for 1 round on a failed Fortitude save. On a critical failure, the target is also fleeing for 1 round unless it succeeds at a Will save.',
      ['Cantrip', 'Necromancy', 'Negative'],
      {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      false,
      {
        save: SaveType.Fortitude,
        range: 'touch',
        targets: '1 living or undead creature',
      },
    ),
    new Spell(
      'Daze',
      'You cloud the target’s mind and daze it with a mental jolt. The jolt deals 4 mental damage; the target must attempt a basic Will save. If the target critically fails the save, it is also stunned 1.',
      ['Cantrip', 'Enchantment', 'Mental', 'Nonlethar'],
      { actions: 2, components: [SpellComponents.Verbal] },
      false,
      { save: SaveType.Will, range: '60ft', targets: '1 creature' },
    ),
    new Spell(
      'Gale Blast',
      'Wind flows from your outstretched hands and whirls around you in a 5-foot emanation. Each creature in the area takes bludgeoning damage 4, with a Fortitude save.',
      ['Air', 'Cantrip', 'Evocation'],
      {
        actions: 2,
        components: [SpellComponents.Verbal, SpellComponents.Somatic],
      },
      false,
      { save: SaveType.Fortitude },
    ),
    new Spell(
      'Message',
      'You mouth words quietly, but instead of coming out of your mouth, they’re transferred directly to the ears of the target. While others can’t hear your words any better than if you normally mouthed them, the target can hear your words as if they were standing next to you. The target can give a brief response as a reaction, or as a free action on their next turn if they wish, but they must be able to see you and be within range to do so. If they respond, their response is delivered directly to your ear, just like the original message.',
      ['Auditory', 'Cantrip', 'Illusion', 'Linguistic', 'Mental'],
      { actions: 1, components: [SpellComponents.Verbal] },
      false,
      { range: '120ft', targets: '1 creature' },
    ),
    new Spell(
      'Shield',
      'You raise a magical shield of force. This counts as using the Raise a Shield action, giving you a +1 circumstance bonus to AC until the start of your next turn, but it doesn’t require a hand to use.\n While the spell is in effect, you can use the Shield Block reaction with your magic shield. The shield has Hardness 5.\n After you use Shield Block, the spell ends and you can’t cast it again for 10 minutes. Unlike a normal Shield Block, you can use the spell’s reaction against the magic missile spell.',
      ['Abjuration', 'Cantrip', 'Force'],
      { actions: 1, components: SpellComponents.Verbal },
    ),
  ];

  pdf.innateSpells = [
    new Spell(
      'Detect Magic',
      '',
      ['Cantrip', 'Detection', 'Divination'],
      {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      false,
      { area: '30ft', frequency: 'unlimited' },
    ),
  ];

  pdf.focusPoints = { maximum: 1, current: 1 };
  pdf.focusSpells = [
    new Spell(
      'Dragon Claws',
      '',
      ['Uncommon', 'Morph', 'Transmutation'],
      { actions: 1, focusPoints: 1, components: [SpellComponents.Verbal] },
      false,
      { duration: '1 minute' },
    ),
  ];

  pdf.spells = [
    new Spell(
      'Charm',
      '',
      ['Emotion', 'Enchantment', 'Incapacitation', 'Mental'],
      {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      false,
      {
        range: '30ft',
        targets: '1 creature',
        save: SaveType.Will,
        duration: '1 hour',
      },
    ),
    new Spell(
      'Goblin Pox',
      '',
      ['Disease', 'Necromancy'],
      {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      false,
      { range: 'touch', targets: '1 creature', save: SaveType.Fortitude },
    ),
    new Spell(
      'Blur',
      '',
      ['Illusion', 'Visual'],
      {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      false,
      { range: 'touch', targets: '1 creature', duration: '1 minute' },
    ),
  ];

  await pdf.importCharacterSketchPng(
    await fetch(goblinUrl).then((res) => res.arrayBuffer()),
  );
  pdf.appendFeatDetails();

  pdf.dataUri().then((data) => {
    object.setAttribute('data', data);

    document.getElementById('download').setAttribute('href', data);
  });
}

async function initFamiliar() {
  const object = document.getElementById('pdf');
  const pdf = await Familiar.create();

  pdf.dataUri().then((data) => {
    object.setAttribute('data', data);

    document.getElementById('download').setAttribute('href', data);
  });
}

// initSorcerer();
// initBarbarbarian();
initFamiliar();

document.getElementById('sorcerer').addEventListener('click', (e) => {
  e.preventDefault();
  initSorcerer();
});

document.getElementById('barbarian').addEventListener('click', (e) => {
  e.preventDefault();
  initBarbarbarian();
});

document.getElementById('familiar').addEventListener('click', (e) => {
  e.preventDefault();
  initFamiliar();
})
