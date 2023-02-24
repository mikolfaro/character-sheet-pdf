import './style.css';

import orcUrl from './orc.png';
import goblinUrl from './Goblin02.png';

import {
  Ability,
  AbilityScores,
  Proficiency,
  SaveType,
  SpellComponents,
} from '../src/commons';

import CharacterSheet from '../src/Custom';

async function initBarbarbarian() {
  const object = document.getElementById('pdf');
  const pdf = await CharacterSheet.create();

  // First page
  pdf.characterName = 'Ugohhh';
  pdf.playerName = 'Mikol';
  pdf.ancestryAndHeritage = 'Hold-Scarred Orc';
  pdf.class = 'Barbarian';
  pdf.background = 'Prisoner';
  pdf.size = 'M';
  pdf.alignment = 'NG';
  pdf.traits = ['Orc', 'Humanoid'];
  pdf.deity = 'Atheist';
  pdf.level = 6;
  pdf.heroPoints = 1;
  pdf.experiencePointsXp = 12;

  pdf.abilityScores = new AbilityScores(18, 12, 18, 14, 14, 10);
  pdf.sketchPngUrl = orcUrl;

  pdf.classDc = { keyAbility: Ability.STR, proficiency: Proficiency.T };

  pdf.armorClass = {
    cap: 1,
    unarmored: Proficiency.T,
    light: Proficiency.T,
    medium: Proficiency.T,
    heavy: Proficiency.T,
    current: Proficiency.T,
    otherBonus: 5,
  };
  pdf.shield = { bonus: 2, hardness: 6, maxHp: 24, currentHp: 15 };

  pdf.fortitude = { proficiency: Proficiency.E };
  pdf.reflex = { proficiency: Proficiency.T };
  pdf.will = { proficiency: Proficiency.E };

  pdf.hitPoints = { max: 108, current: 88 };
  pdf.perception = { proficiency: Proficiency.E, senses: 'Darkvision' };
  pdf.speed = 20;

  pdf.acrobatics = { proficiency: Proficiency.E };
  pdf.arcana = {};
  pdf.athletics = { proficiency: Proficiency.E };
  pdf.crafting = {};
  pdf.deception = {};
  pdf.diplomacy = {};
  pdf.intimidation = { proficiency: Proficiency.T };
  pdf.medicine = { proficiency: Proficiency.T };
  pdf.nature = { proficiency: Proficiency.T };
  pdf.occultism = {};
  pdf.performance = {};
  pdf.religion = {};
  pdf.society = {};
  pdf.stealth = { proficiency: Proficiency.T };
  pdf.survival = { proficiency: Proficiency.T };
  pdf.thievery = { proficiency: Proficiency.U };
  pdf.lore1 = { name: 'Underworld', proficiency: Proficiency.T };

  pdf.meleeStrikes = [
    {
      weapon: 'Retribution Axe',
      keyAbility: Ability.STR,
      proficiency: Proficiency.E,
      damageDice: '1D12',
      damageBonus: '4',
      damageType: 'S',
      notes: '+2 bonus next attack against who just attacked me',
      traits: ['Enchantment', 'Magical', 'Sweep'],
      otherBonus: 1,
    },
  ];
  pdf.weaponProficiencies = {
    simple: Proficiency.E,
    martial: Proficiency.E,
    unarmed: Proficiency.E,
  };

  pdf.languages = ['Common', 'Goblin', 'Orcish', 'Undercommon'];

  // Second page
  pdf.heritageFeat1 = {
    name: 'Diehard',
    description: 'It takes more to kill you than most.',
  };
  pdf.ancestryFeat1 = {
    name: 'Orc Ferocity',
    description:
      'Fierceness in battle runs through your blood, and you refuse to fall from your injuries.',
  };
  pdf.ancestryFeat5 = {
    name: 'Hold Mark - Axe',
    description:
      "You bear scars or tattoos enhanced by the mark of your community's prowess.",
  };

  pdf.classFeat1 = {
    name: 'Raging Intimidation',
    description:
      'Your fury fills your foes with fear. While you are raging, your Demoralize and Scare to Death actions gain the rage trait, allowing you to use them while raging. As soon as you meet the prerequisites for the skill feats Intimidating Glare and Scare to Death, you gain these feats.',
  };
  pdf.classFeat2 = {
    name: 'Acute Scent',
    description: 'When you Rage, your sense of smell improves.',
  };
  pdf.classFeat4 = {
    name: 'Sentinel Dedication',
    description:
      'You have trained carefully to maximize the protective qualities of your armor.',
  };
  pdf.classFeat6 = {
    name: 'Strike',
    description: 'You swat a foe that leaves an opening.',
  };

  pdf.skillFeatB = {
    name: 'Experienced Smugger',
    description: 'You often smuggle things past the authorities.',
  };
  pdf.skillFeat2 = {
    name: 'Battle Medicine',
    description:
      'You can patch up yourself or an adjacent ally, even in combat.',
  };
  pdf.skillFeat4 = {
    name: 'Trick Magic Item',
    description:
      'You examine a magic item you normally couldn’t use in an effort to fool it and activate it temporarily.',
  };
  pdf.skillFeat6 = {
    name: 'Steel Skin',
    description:
      'You wear your armor like a second skin. You can rest normally while wearing medium armor.',
  };

  pdf.classFeature1_1 = {
    name: 'Rage',
    description: 'You gain the Rage action, which lets you fly into a frenzy.',
  };
  pdf.classFeature1_2 = {
    name: 'Instinct - Dragon - Blue',
    description:
      'When you use draconic rage, you increase the additional damage from Rage from 4 to 8. If you have greater weapon specialization, instead increase the damage from Rage when using draconic rage from 8 to 16.',
  };
  pdf.classFeature3 = {
    name: 'Deny advantage',
    description: 'Your foes struggle to pass your defenses.',
  };
  pdf.classFeature5 = {
    name: 'Brutality',
    description: 'Your fury makes your weapons lethal.',
  };

  pdf.generalFeat3 = {
    name: 'Assurance - Medicine',
    description:
      'Even in the worst circumstances, you can perform basic tasks.',
  };

  pdf.wornItems = [
    { name: 'Retribution Axe', bulk: 2 },
    { name: 'Spellguard Axe', bulk: 2 },
    { name: 'Splint Mail', bulk: 3 },
  ];
  pdf.otherItems = [{ name: 'Backpack', bulk: -2 }];

  pdf.purse = { copper: 0, gold: 5, platinum: 1 };

  pdf.actions = [
    { name: 'Administer Aid', actions: 2, traits: ['Medicine', 'Manipulate'] },
    { name: 'Attack of Opportunity', reaction: true, traits: ['Barbarian'] },
    { name: 'Balance', actions: 1, traits: ['Acrobatics', 'Move'] },
    {
      name: 'Battle Medicine',
      actions: 1,
      traits: ['Medicine', 'General', 'Healing', 'Manipulate', 'Skill'],
    },
    { name: 'Climb', actions: 1 },
    { name: 'Command an Animal', actions: 1 },
    { name: 'Conceal an Object', actions: 1 },
    { name: 'Create a Diversion', actions: 1 },
    { name: 'Demoralize', actions: 1 },
    { name: 'Disable a Dice', actions: 2 },
    { name: 'Disarm', actions: 1 },
    { name: 'Feint', actions: 1 },
    { name: 'Force Open', actions: 1 },
    { name: 'Grapple', actions: 1 },
    { name: 'Hide', actions: 1 },
    { name: 'High Jump', actions: 2 },
    { name: 'Lie', reaction: true },
    { name: 'Long Jump', actions: 2 },
    { name: 'Maneuver Flight', actions: 1 },
    { name: 'Orc Ferocity', reaction: true },
    { name: 'Palm an Object', actions: 1 },
    { name: 'Perform', actions: 1 },
    { name: 'Pick a Lock', actions: 2 },
    { name: 'Rage', actions: 1 },
  ];

  pdf.sketchPngUrl = orcUrl;

  await pdf.fill();

  const data = await pdf.dataUrl();
  object.setAttribute('data', data);
}

async function initSorcerer() {
  const object = document.getElementById('pdf');
  const pdf = await CharacterSheet.create();

  pdf.characterName = 'Pino';
  pdf.playerName = 'Mikol';
  pdf.experiencePointsXp = 54;
  pdf.class = 'Sorcerer';
  pdf.alignment = 'C';
  pdf.traits = ['Human', 'Humanoid'];
  pdf.deity = 'Asdrubaldeus';
  pdf.background = 'Artist';
  pdf.size = 'S';
  pdf.level = 6;
  pdf.ancestryAndHeritage = 'Unbreakable Goblin';
  pdf.heroPoints = 1;
  pdf.sketchPngUrl = goblinUrl;

  pdf.abilityScores = new AbilityScores(10, 18, 14, 12, 12, 19);
  pdf.classDc = { keyAbility: Ability.CHA };
  pdf.armorClass = { unarmored: Proficiency.T, current: Proficiency.T };
  pdf.fortitude = { proficiency: Proficiency.E };
  pdf.reflex = { proficiency: Proficiency.T };
  pdf.will = { proficiency: Proficiency.E };
  pdf.hitPoints = { max: 58, current: 45 };
  pdf.perception = { proficiency: Proficiency.T, senses: 'Darkvision' };
  pdf.speed = 25;

  pdf.meleeStrikes = [
    {
      weapon: 'Dagger of Venom',
      keyAbility: Ability.DEX,
      proficiency: Proficiency.T,
      damageDice: '2d4',
      damageType: 'P',
      traits: [
        'Agile',
        'Finesse',
        'Poison',
        'Magical',
        'Necromancy',
        'Poison',
        'Thrown 10ft',
        'Versatile S',
      ],
      otherBonus: 1,
      critical: '1d6 + item bonus persistent bleed damage'
    },
  ];

  pdf.rangedStrikes = [
    {
      weapon: 'Sling',
      keyAbility: Ability.DEX,
      proficiency: Proficiency.T,
      damageDice: '1D6',
      dmamageType: 'B',
      traits: ['Range 50ft', 'Reload 1'],
    },
  ];

  pdf.weaponProficiencies = {
    simple: Proficiency.T,
    unarmed: Proficiency.T,
  };

  pdf.acrobatics = { otherBonus: 3 };
  pdf.arcana = { proficiency: Proficiency.E };
  pdf.athletics = { otherBonus: 3 };
  pdf.crafting = { proficiency: Proficiency.T };
  pdf.deception = { otherBonus: 3 };
  pdf.diplomacy = { proficiency: Proficiency.T };
  pdf.intimidation = { proficiency: Proficiency.T };
  pdf.lore1 = { name: 'Art', proficiency: Proficiency.T };
  pdf.medicine = { otherBonus: 3 };
  pdf.nature = { otherBonus: 3 };
  pdf.occultism = { proficiency: Proficiency.T };
  pdf.performance = { otherBonus: 3 };
  pdf.religion = { otherBonus: 3 };
  pdf.society = { otherBonus: 3 };
  pdf.stealth = { proficiency: Proficiency.T };
  pdf.survival = { otherBonus: 3 };
  pdf.thievery = { proficiency: Proficiency.T };

  pdf.languages = ['Common', 'Goblin', 'Orchish'];

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

  pdf.wornItems = [
    { name: 'Sling', bulk: 0.1 },
    { name: 'Ring of Zorro', invested: true },
  ];

  pdf.supplies = {
    chalk: 10,
    rations: 5,
    rope: 50,
    torches: 5,
    water: 1,
    other: new Map([["Oil", "2 pints"], ["Sling bullets", 20]]),
  };

  pdf.purse = { silver: 150 };

  pdf.currentBulk = 3;

  pdf.actions = [
    {
      name: 'Activate Dagger of Venom',
      freeAction: true,
      frequency: "once per day",
      trigger: 'You damage a creature with the dagger of venom',
      description: "You poison the creature you hit with dagger venom.\n Dagger Venom (poison); Saving Throw Fortitude DC 21; Maximum Duration 4 rounds. Stage 1 1d8 poison damage and enfeebled 1. ",
    }
  ];

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
    {
      name: 'Chill Touch',
      description:
        'Siphoning negative energy into yourself, your hand radiates a pale darkness. Your touch weakens the living and disorients undead, possibly even causing them to flee. The effect depends on whether the target is living or undead.\n •Living Creature The spell deals negative damage equal to 1d4 + 4. The target attempts a basic Fortitude save, but is also enfeebled 1 for 1 round on a critical failure.\n •Undead Creature The target is flat-footed for 1 round on a failed Fortitude save. On a critical failure, the target is also fleeing for 1 round unless it succeeds at a Will save.',
      restrictions: {
        range: 'touch',
        targets: '1 living or undead creature',
      },
      save: SaveType.Fortitude,
      spellCost: {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      traits: ['Cantrip', 'Necromancy', 'Negative'],
    },
    {
      name: 'Daze',
      description:
        'You cloud the target’s mind and daze it with a mental jolt. The jolt deals 4 mental damage; the target must attempt a basic Will save. If the target critically fails the save, it is also stunned 1.',
      restrictions: { range: '60ft', targets: '1 creature' },
      save: { type: SaveType.Will },
      spellCost: { actions: 2, components: [SpellComponents.Verbal] },
      traits: ['Cantrip', 'Enchantment', 'Mental', 'Nonlethar'],
    },
    {
      name: 'Gale Blast',
      description:
        'Wind flows from your outstretched hands and whirls around you in a 5-foot emanation. Each creature in the area takes bludgeoning damage 4, with a Fortitude save.',
      save: { type: SaveType.Fortitude },
      spellCost: {
        actions: 2,
        components: [SpellComponents.Verbal, SpellComponents.Somatic],
      },
      traits: ['Air', 'Cantrip', 'Evocation'],
    },
    {
      name: 'Message',
      description:
        'You mouth words quietly, but instead of coming out of your mouth, they’re transferred directly to the ears of the target. While others can’t hear your words any better than if you normally mouthed them, the target can hear your words as if they were standing next to you. The target can give a brief response as a reaction, or as a free action on their next turn if they wish, but they must be able to see you and be within range to do so. If they respond, their response is delivered directly to your ear, just like the original message.',
      traits: ['Auditory', 'Cantrip', 'Illusion', 'Linguistic', 'Mental'],
      spellCost: { actions: 1, components: [SpellComponents.Verbal] },
      restrictions: { range: '120ft', targets: '1 creature' },
    },
    {
      name: 'Shield',
      description:
        'You raise a magical shield of force. This counts as using the Raise a Shield action, giving you a +1 circumstance bonus to AC until the start of your next turn, but it doesn’t require a hand to use.\n While the spell is in effect, you can use the Shield Block reaction with your magic shield. The shield has Hardness 5.\n After you use Shield Block, the spell ends and you can’t cast it again for 10 minutes. Unlike a normal Shield Block, you can use the spell’s reaction against the magic missile spell.',
      traits: ['Abjuration', 'Cantrip', 'Force'],
      spellCost: { actions: 1, components: SpellComponents.Verbal },
    },
  ];

  pdf.innateSpells = [
    {
      name: 'Detect Magic',
      traits: ['Cantrip', 'Detection', 'Divination'],
      spellCost: {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      restrictions: { area: '30ft', frequency: 'unlimited' },
    },
  ];

  pdf.focusPoints = { maximum: 1, current: 1 };
  pdf.focusSpells = [
    {
      name: 'Dragon Claws',
      traits: ['Uncommon', 'Morph', 'Transmutation'],
      spellCost: {
        actions: 1,
        focusPoints: 1,
        components: [SpellComponents.Verbal],
      },
      restrictions: { duration: '1 minute' },
    },
  ];

  pdf.spells = [
    {
      name: 'Charm',
      traits: ['Emotion', 'Enchantment', 'Incapacitation', 'Mental'],
      spellCost: {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      restrictions: {
        range: '30ft',
        targets: '1 creature',
        duration: '1 hour',
      },
      save: { type: SaveType.Will },
    },
    {
      name: 'Goblin Pox',
      traits: ['Disease', 'Necromancy'],
      spellCost: {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      restrictions: { range: 'touch', targets: '1 creature' },
      save: { type: SaveType.Fortitude },
    },
    {
      name: 'Blur',
      traits: ['Illusion', 'Visual'],
      spellCost: {
        actions: 2,
        components: [SpellComponents.Somatic, SpellComponents.Verbal],
      },
      restrictions: {
        range: 'touch',
        targets: '1 creature',
        duration: '1 minute',
      },
    },
  ];

  pdf.characterSketchUrl = goblinUrl;

  await pdf.fill();

  pdf.dataUrl().then((data) => {
    object.setAttribute('data', data);

    document.getElementById('download').setAttribute('href', data);
  });
}

initSorcerer();
// initBarbarbarian();

document.getElementById('sorcerer').addEventListener('click', (e) => {
  e.preventDefault();
  initSorcerer();
});

document.getElementById('barbarian').addEventListener('click', (e) => {
  e.preventDefault();
  initBarbarbarian();
});
