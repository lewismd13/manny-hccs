import {
  ensureCreateItem,
  ensureEffect,
  ensureItem,
  ensureMpSausage,
  ensureMpTonic,
  ensureNpcEffect,
  ensurePotionEffect,
  ensureSewerItem,
  getPropertyBoolean,
  getPropertyInt,
  sausageFightGuaranteed,
  setChoice,
  setClan,
  kill,
  mapMonster,
  ensureOde,
  ensureSong,
} from "./lib";
import {
  abort,
  adv1,
  autosell,
  availableAmount,
  buy,
  chatPrivate,
  chew,
  cliExecute,
  cliExecuteOutput,
  containsText,
  create,
  drink,
  eat,
  equip,
  floor,
  gametimeToInt,
  getCampground,
  getInventory,
  getProperty,
  handlingChoice,
  haveEffect,
  haveSkill,
  hippyStoneBroken,
  inebrietyLimit,
  itemAmount,
  lastChoice,
  logprint,
  max,
  maximize,
  mpCost,
  myAdventures,
  myBasestat,
  myBuffedstat,
  myClass,
  myFullness,
  myGardenType,
  myHash,
  myHp,
  myInebriety,
  myLevel,
  myMaxhp,
  myMeat,
  myMp,
  mySpleenUse,
  myTurncount,
  numericModifier,
  print,
  retrieveItem,
  round,
  runChoice,
  runCombat,
  setAutoAttack,
  setLocation,
  setProperty,
  sweetSynthesis,
  sweetSynthesisResult,
  toInt,
  toString,
  totalFreeRests,
  use,
  useFamiliar,
  useSkill,
  visit,
  visitUrl,
  wait,
} from "kolmafia";
import {
  $class,
  $effect,
  $effects,
  $familiar,
  $familiars,
  $item,
  $items,
  $location,
  $monster,
  $skill,
  $slot,
  $stat,
  adventureMacro,
  adventureMacroAuto,
  get,
  Macro,
} from "libram";
import { error } from "libram/dist/console";

// rewrite all combats
// create a defaultFamiliar function that chooses somewhat dynamically
// make a better geneTonic() function
// rewrite map uses to not use the c2t thing
// figure out synth

const TEST_HP = 1;
const TEST_MUS = 2;
const TEST_MYS = 3;
const TEST_MOX = 4;
const TEST_FAMILIAR = 5;
const TEST_WEAPON = 6;
const TEST_SPELL = 7;
const TEST_NONCOMBAT = 8;
const TEST_ITEM = 9;
const TEST_HOT_RES = 10;
const TEST_COIL_WIRE = 11;

var HP_TURNS = 0;
var MUS_TURNS = 0;
var MYS_TURNS = 0;
var MOX_TURNS = 0;
var FAMILIAR_TURNS = 0;
var WEAPON_TURNS = 0;
var SPELL_TURNS = 0;
var NONCOMBAT_TURNS = 0;
var ITEM_TURNS = 0;
var HOT_RES_TURNS = 0;
var TEMP_TURNS = 0;

var tempMacro = "";

// test order will be stats, hot, item, NC, Fam, weapon, spell

const START_TIME = gametimeToInt();

const justKillTheThing = Macro.trySkill($skill`Curse of Weaksauce`)
  .trySkill($skill`Micrometeorite`)
  .trySkill($skill`Sing Along`)
  .trySkill($skill`Stuffed Mortar Shell`)
  .skill($skill`candyblast`)
  .step("repeat");
/*
const defaultFamiliar = $familiar`melodramedary`;
const defaultFamiliarEquipment = $item`dromedary drinking helmet`;
// TODO: make this choose camel until 100 spit, then pixie for absinthe, then ???
function useDefaultFamiliar() {
  useFamiliar(defaultFamiliar);
  if (defaultFamiliarEquipment !== $item`none`) {
    equip(defaultFamiliarEquipment);
  }
}
*/

function useDefaultFamiliar() {
  if (get("camelSpit") < 100 && !testDone(TEST_WEAPON)) {
    useFamiliar($familiar`melodramedary`);
    // equip($item`dromedary drinking helmet`);
  } /* else if (
    availableAmount($item`rope`) < 1 &&
    availableAmount($item`burning newspaper`) + availableAmount($item`burning paper crane`) < 1
  ) {
    useFamiliar($familiar`Garbage Fire`);
  } */ else if (
    availableAmount($item`short stack of pancakes`) === 0 &&
    haveEffect($effect`shortly stacked`) === 0 &&
    !testDone(TEST_FAMILIAR)
  ) {
    useFamiliar($familiar`shorter-order cook`);
  } else if (
    availableAmount($item`tiny bottle of absinthe`) === 0 &&
    haveEffect($effect`man's worst enemy`) === 0 &&
    availableAmount($item`disintegrating spiky collar`) === 0 &&
    !testDone(TEST_FAMILIAR)
  ) {
    useFamiliar($familiar`green pixie`);
  } else {
    useFamiliar($familiar`machine elf`);
  }
}

function tryUse(quantity: number, it: Item) {
  if (availableAmount(it) > 0) {
    return use(quantity, it);
  } else {
    return false;
  }
}

function useAll(it: Item) {
  return use(availableAmount(it), it);
}

function tryEquip(it: Item) {
  if (availableAmount(it) > 0) {
    return equip(it);
  } else {
    return false;
  }
}

function assertMeat(meat: number) {
  if (myMeat() < meat) error("Not enough meat.");
}

function autosellAll(it: Item) {
  autosell(itemAmount(it), it);
}

function wishEffect(ef: Effect) {
  if (haveEffect(ef) === 0) {
    cliExecute("genie effect " + ef.name);
  } else {
    print("Already have effect " + ef.name + ".");
  }
}

// Checks that you don't already have the tonic or effect and if your syringe has the right phylum and if so, makes the appropriate tonic.
function geneTonic(ph: string) {
  if (ph === "dude" || ph === "weird") {
    print("This function doesn't work for dudes or weirds.", "red");
  } else if (ph === "construct") {
    if (
      haveEffect($effect`Human-Machine Hybrid`) === 0 &&
      availableAmount($item`Gene Tonic: Construct`) === 0 &&
      get("dnaSyringe") === "construct"
    ) {
      cliExecute("camp dnapotion 1");
      if (availableAmount($item`Gene Tonic: ${ph}`) === 0) {
        error("something went wrong getting your gene tonic");
      } else {
        print("successfully created gene tonic: construct");
      }
    } else {
      print("You already have construct DNA");
    }
  } else {
    if (
      haveEffect($effect`Human-${ph} Hybrid`) === 0 &&
      availableAmount($item`Gene Tonic: ${ph}`) === 0 &&
      getProperty("dnaSyringe") === ph
    ) {
      cliExecute("camp dnapotion 1");
      if (availableAmount($item`Gene Tonic: ${ph}`) === 0) {
        error("something went wrong getting your gene tonic");
      } else {
        print("successfully created gene tonic: " + ph);
      }
    } else {
      print("You already have " + ph + " DNA");
    }
  }
}

/*
// rewrite this to be better
function geneTonic1(ph: string) {
  switch (toString(ph)) {
    case "elf":
      if ((haveEffect($effect`1601`) === 0) && (availableAmount($item`7399`) === 0) && (getProperty("dnaSyringe") === "elf")) {
        cliExecute("camp dnapotion 1");
        if (availableAmount($item`7399`) === 0) {
          error("something went wrong getting your gene tonic");
        } else {
          print("successfully created gene tonic: elf");
        }
      } else {
        print("You already have elf DNA");
      }
    case "construct":
      if ((haveEffect($effect`1588`) === 0) && (availableAmount($item`7386`) === 0) && (getProperty("dnaSyringe") === "construct")) {
        cliExecute("camp dnapotion 1");
        if (availableAmount($item`7386`) === 0) {
          error("something went wrong getting your gene tonic");
        } else {
          print("successfully created gene tonic: construct");
        }
      } else {
        print("You already have construct DNA");
      }
    case "pirate":
      if ((haveEffect($effect`1598`) === 0) && (availableAmount($item`7396`) === 0) && (getProperty("dnaSyringe") === "pirate")) {
        cliExecute("camp dnapotion 1");
        if (availableAmount($item`7396`) === 0) {
          error("something went wrong getting your gene tonic");
        } else {
          print("successfully created gene tonic: pirate");
        }
      } else {
        print("You already have pirate DNA");
      }
  }
}
*/

function shrug(ef: Effect) {
  if (haveEffect(ef) > 0) {
    cliExecute("shrug " + ef.name);
  }
}

function summonBrickoOyster(maxSummons: number) {
  if (getPropertyInt("_brickoFights") >= 3) return false;
  if (availableAmount($item`BRICKO oyster`) > 0) return true;
  while (
    getPropertyInt("libramSummons") < maxSummons &&
    (availableAmount($item`BRICKO eye brick`) < 1 || availableAmount($item`BRICKO brick`) < 8)
  ) {
    useSkill(1, $skill`Summon BRICKOs`);
  }
  return use(8, $item`BRICKO brick`);
}

function fightSausageIfGuaranteed() {
  if (sausageFightGuaranteed()) {
    equip($item`Iunion Crown`);
    equip($slot`shirt`, $item`none`);
    equip($item`Fourth of May Cosplay Saber`);
    equip($item`Kramco Sausage-o-Matic&trade;`);
    equip($item`old sweatpants`);
    equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
    equip($slot`acc2`, $item`Powerful Glove`);
    equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

    useDefaultFamiliar();

    adventureMacroAuto($location`The Neverending Party`, kill());
  }
}

export function testDone(testNum: number) {
  print("Checking test " + testNum + "...");
  const text = visitUrl("council.php");
  return !containsText(text, "<input type=hidden name=option value=" + testNum + ">");
}

function doTest(testNum: number) {
  if (!testDone(testNum)) {
    visitUrl("choice.php?whichchoice=1089&option=" + testNum);
    if (!testDone(testNum)) {
      error("Failed to do test " + testNum + ". Maybe we are out of turns.");
    }
  } else {
    print("Test " + testNum + " already completed.");
  }
}

export function withMacro<T>(macro: Macro, action: () => T) {
  macro.save();
  try {
    return action();
  } finally {
    Macro.clearSaved();
  }
}

// Don't buy stuff from NPC stores.
setProperty("_saved_autoSatisfyWithNPCs", getProperty("autoSatisfyWithNPCs"));
setProperty("autoSatisfyWithNPCs", "false");

// Do buy stuff from coinmasters (hermit).
setProperty("_saved_autoSatisfyWithCoinmasters", getProperty("autoSatisfyWithCoinmasters"));
setProperty("autoSatisfyWithCoinmasters", "true");

// Initialize council.
visitUrl("council.php");

if (get("backupCameraReverserEnabled") === false) {
  cliExecute("backupcamera reverser on");
}

// All combat handled by our consult script (hccs_combat.ash).
cliExecute("ccs libramMacro");

// Turn off Lil' Doctor quests.
setChoice(1340, 3);

// in case you're re-running it
setAutoAttack(0);

// Default equipment.
equip($item`Iunion Crown`);
equip($slot`shirt`, $item`none`);
equip($item`vampyric cloake`);
equip($item`Fourth of May Cosplay Saber`);
// equip($item[Kramco Sausage-o-Matic&trade;]);
equip($item`old sweatpants`);
equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
equip($slot`acc2`, $item`Powerful Glove`);
equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

if (!testDone(TEST_COIL_WIRE)) {
  setClan("Bonus Adventures from Hell");
  if (getPropertyInt("_clanFortuneConsultUses") < 3) {
    while (getPropertyInt("_clanFortuneConsultUses") < 3) {
      cliExecute("fortune cheesefax");
      cliExecute("wait 5");
    }
  }

  if (myLevel() === 1 && mySpleenUse() === 0) {
    while (getPropertyInt("_universeCalculated") < getPropertyInt("skillLevel144")) {
      cliExecute("numberology 69");
    }
  }

  // retrieve_item(1, $item[fish hatchet]);

  // get cowboy boots
  visitUrl("place.php?whichplace=town_right&action=townright_ltt");

  // Chateau piggy bank
  visitUrl("place.php?whichplace=chateau&action=chateau_desk1");
  // autosell(1, $item[gremlin juice]);
  // autosell(1, $item[ectoplasm <i>au jus</i>]);
  // autosell(1, $item[clove-flavored lip balm]);

  // Sell pork gems + tent
  visitUrl("tutorial.php?action=toot");
  tryUse(1, $item`letter from King Ralph XI`);
  tryUse(1, $item`pork elf goodies sack`);
  autosell(5, $item`baconstone`);
  // autosell(5, $item[porquoise]);
  autosell(5, $item`hamethyst`);

  // Buy toy accordion
  ensureItem(1, $item`toy accordion`);

  // make pantogram pants for hilarity and spell damage
  if (availableAmount($item`pantogram pants`) === 0) {
    // retrieveItem(1, $item`ten-leaf clover`);
    cliExecute("pantogram hot|-combat|silent");
  }

  ensureSong($effect`The Magical Mojomuscular Melody`);

  if (haveEffect($effect`Inscrutable Gaze`) === 0) {
    ensureMpTonic(10);
    ensureEffect($effect`Inscrutable Gaze`);
  }

  // Campsite
  if (haveEffect($effect`That\'s Just Cloud-Talk, Man`) === 0) {
    visitUrl("place.php?whichplace=campaway&action=campaway_sky");
  }

  // Depends on Ez's Bastille script.
  cliExecute("bastille myst brutalist");

  // Upgrade saber for fam wt
  visitUrl("main.php?action=may4");
  runChoice(4);

  // Put on some regen gear
  equip($item`Iunion Crown`);
  equip($slot`shirt`, $item`none`);
  equip($item`Fourth of May Cosplay Saber`);
  // equip($item[Kramco Sausage-o-Matic&trade;]);
  equip($item`old sweatpants`);
  equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
  equip($slot`acc2`, $item`Powerful Glove`);
  equip($slot`acc3`, $item`Retrospecs`);

  ensureCreateItem(1, $item`borrowed time`);
  use(1, $item`borrowed time`);

  // NOTE: No turn 0 sausage fight!

  // should probably fight, digitize, wink a bishop or something here

  // QUEST - Coil Wire
  doTest(TEST_COIL_WIRE);
}

if (myTurncount() < 60) error("Something went wrong coiling wire.");

if (!testDone(TEST_HP)) {
  // just in case?
  if (haveEffect($effect`That\'s Just Cloud-Talk, Man`) === 0) {
    visitUrl("place.php?whichplace=campaway&action=campaway_sky");
  }

  // Grab fish hatchett here, for fam wt, -combat, and muscle tests
  retrieveItem(1, $item`fish hatchet`);

  // pulls wrench from deck
  if (getPropertyInt("_deckCardsDrawn") === 0) {
    cliExecute("cheat wrench");
  }

  // uses familiar jacks to get camel equipment
  /* if (availableAmount($item`10580`) === 0 && getPropertyInt("tomeSummons") < 3) {
    cliExecute("create 1 box of familiar jacks");
    useFamiliar($familiar`melodramedary`);
    use(1, $item`box of familiar jacks`);
    equip($item`dromedary drinking helmet`);
  } */

  cliExecute("call detective_solver.ash");
  buy(1, $item`shoe gum`);

  // learn extract and digitize
  cliExecute("terminal educate extract");
  cliExecute("terminal educate digitize");

  const lovePotion = $item`Love Potion #0`;
  const loveEffect = $effect`Tainted Love Potion`;
  if (haveEffect(loveEffect) === 0) {
    if (availableAmount(lovePotion) === 0) {
      useSkill(1, $skill`Love Mixology`);
    }
    visitUrl("desc_effect.php?whicheffect=" + loveEffect.descid);
    if (
      numericModifier(loveEffect, "mysticality") > 10 &&
      numericModifier(loveEffect, "muscle") > -30 &&
      numericModifier(loveEffect, "moxie") > -30 &&
      numericModifier(loveEffect, "maximum hp percent") > -0.001
    ) {
      use(1, lovePotion);
    }
  }

  // Boxing Daycare
  ensureEffect($effect`Uncucumbered`);
  cliExecute("daycare item");

  // Cast inscrutable gaze
  ensureEffect($effect`Inscrutable Gaze`);

  // Shower lukewarm
  ensureEffect($effect`Thaumodynamic`);

  // Beach Comb
  ensureEffect($effect`You Learned Something Maybe!`);

  // Get beach access.
  if (availableAmount($item`bitchin\' meatcar`) === 0) {
    ensureItem(1, $item`cog`);
    ensureItem(1, $item`sprocket`);
    ensureItem(1, $item`spring`);
    ensureItem(1, $item`empty meat tank`);
    ensureItem(1, $item`sweet rims`);
    ensureItem(1, $item`tires`);
    create(1, $item`bitchin\' meatcar`);
  }

  // Depends on Ez's Bastille script.
  cliExecute("bastille myst brutalist");

  // if (get_property('_horsery') != 'crazy horse') cli_execute('horsery crazy');

  // Tune moon sign to Blender. Have to do this now to get chewing gum.
  /*
  if (!getPropertyBoolean("moonTuned")) {
    if (getPropertyInt("_campAwaySmileBuffs") === 0) {
      visitUrl("place.php?whichplace=campaway&action=campaway_sky");
    }

    // Unequip spoon.
    equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
    equip($slot`acc2`, $item`Powerful Glove`);
    equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

    // Actually tune the moon.
    visitUrl("inv_use.php?whichitem=10254&doit=96&whichsign=8");
  }
*/
  cliExecute("retrocape mysticality thrill");

  // cross streams for a stat boost
  if (!getPropertyBoolean("_streamsCrossed")) {
    cliExecute("crossstreams");
  }

  equip($item`Iunion Crown`);
  equip($slot`shirt`, $item`none`);
  equip($item`10647`); //retrocape
  equip($item`Fourth of May Cosplay Saber`);
  // equip($item[Kramco Sausage-o-Matic&trade;]);
  equip($item`old sweatpants`);
  equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
  equip($slot`acc2`, $item`Powerful Glove`);
  equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

  if (
    getPropertyInt("_brickoFights") === 0 &&
    summonBrickoOyster(7) &&
    availableAmount($item`BRICKO oyster`) > 0
  ) {
    if (availableAmount($item`bag of many confections`) > 0) error("We should not have a bag yet.");
    useFamiliar($familiar`Stocking Mimic`);
    equip($slot`familiar`, $item`none`);
    if (myHp() < 0.8 * myMaxhp()) {
      visitUrl("clan_viplounge.php?where=hottub");
    }
    ensureMpTonic(32);
    Macro.trySkill($skill`otoscope`)
      .trySkill($skill`curse of weaksauce`)
      .trySkillRepeat($skill`saucegeyser`)
      .setAutoAttack();
    use(1, $item`BRICKO oyster`);
    autosell(1, $item`BRICKO pearl`);
    setAutoAttack(0);
  }

  // Prep Sweet Synthesis.
  if (myGardenType() === "peppermint") {
    cliExecute("garden pick");
  } else {
    print(
      "WARNING: This script is built for peppermint garden. Switch gardens or find other candy."
    );
  }

  if (getPropertyInt("_candySummons") === 0) {
    useSkill(1, $skill`Summon Crimbo Candy`);
  }
  if (get("_chubbyAndPlumpUsed") === false) {
    useSkill(1, $skill`Chubby and Plump`);
  }

  // Depending on crimbo candy summons, gets synth learning, possibly getting bugged beanie if it needs a tome summon
  if (
    availableAmount($item`crimbo candied pecan`) > 1 &&
    availableAmount($item`crimbo peppermint bark`) === 0 &&
    haveEffect($effect`Synthesis: Learning`) === 0
  ) {
    useSkill(1, $skill`summon sugar sheets`);
    cliExecute("create 1 sugar shotgun");
    sweetSynthesis($item`sugar shotgun`, $item`crimbo candied pecan`);
    useFamiliar($familiar`baby bugged bugbear`);
    visitUrl("arena.php");
    useDefaultFamiliar();
  } else if (
    availableAmount($item`crimbo fudge`) >= 2 &&
    haveEffect($effect`Synthesis: Learning`) === 0
  ) {
    sweetSynthesis($item`crimbo fudge`, $item`crimbo fudge`);
  } else if (
    availableAmount($item`crimbo peppermint bark`) !== 0 &&
    haveEffect($effect`Synthesis: Learning`) === 0
  ) {
    sweetSynthesis($item`crimbo peppermint bark`, $item`peppermint sprout`);
  }

  // synthesis: smart
  if (haveEffect($effect`Synthesis: Smart`) == 0) {
    sweetSynthesis($item`bag of many confections`, $item`chubby and plump bar`);
  }
  // This is the sequence of synthesis effects; synthesis_plan will, if possible, come up with a plan for allocating candy to each of these.
  // SynthesisPlanner.synthesize($effect`Synthesis: Learning`);
  // SynthesisPlanner.synthesize($effect`Synthesis: Smart`);

  if (round(numericModifier("mysticality experience percent")) < 100) {
    error("Insufficient +stat%.");
  }

  // Use ten-percent bonus
  tryUse(1, $item`a ten-percent bonus`);

  // Scavenge for gym equipment
  if (toInt(get("_daycareGymScavenges")) < 1) {
    visitUrl("/place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
    const pg = runChoice(3);
    if (containsText(pg, "[free]")) runChoice(2);
    runChoice(5);
    runChoice(4);
  }

  // ensure_effect($effect[hulkien]);
  ensureEffect($effect`Favored by Lyle`);
  ensureEffect($effect`Starry-Eyed`);
  ensureEffect($effect`Triple-Sized`);
  ensureEffect($effect`Feeling Excited`);
  ensureSong($effect`The Magical Mojomuscular Melody`);
  ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);

  // Plan is for Beach Comb + PK buffs to fall all the way through to item -> hot res -> fam weight.
  ensureEffect($effect`Fidoxene`);
  ensureEffect($effect`Do I Know You From Somewhere?`);

  // 10 snojo fights to while +stat is on, also getting ice rice
  if (get("_snojoFreeFights") < 10) {
    useDefaultFamiliar();
    setProperty("choiceAdventure1310", "3"); // myst for ice rice, because it sells for more
    visitUrl("place.php?whichplace=snojo&action=snojo_controller");
    if (availableAmount($item`gene tonic: construct`) === 0 && get("dnaSyringe") !== "construct") {
      adventureMacroAuto(
        $location`The X-32-F Combat Training Snowman`,
        Macro.item($item`DNA extraction syringe`).trySkillRepeat($skill`saucestorm`)
      );
      geneTonic("construct");
    }
    while (get("_snojoFreeFights") < 10) {
      useDefaultFamiliar();
      adventureMacroAuto($location`The X-32-F Combat Training Snowman`, kill());
    }
  }

  // Don't use Kramco here.
  equip($slot`off-hand`, $item`none`);

  if (haveEffect($effect`holiday yoked`) === 0 && getPropertyInt("_kgbTranquilizerDartUses") < 3) {
    equip($slot`acc1`, $item`kremlin\'s greatest briefcase`);
    useFamiliar($familiar`ghost of crimbo carols`);
    adventureMacroAuto($location`noob cave`, Macro.trySkill($skill`KGB tranquilizer dart`));
    setAutoAttack(0);
  }

  // Chateau rest
  while (getPropertyInt("timesRested") < totalFreeRests()) {
    visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
  }

  while (summonBrickoOyster(11) && availableAmount($item`BRICKO oyster`) > 0) {
    useDefaultFamiliar();
    if (myHp() < 0.8 * myMaxhp()) {
      visitUrl("clan_viplounge.php?where=hottub");
    }
    ensureMpTonic(32);
    Macro.trySkill($skill`otoscope`)
      .trySkill($skill`curse of weaksauce`)
      .trySkillRepeat($skill`saucegeyser`)
      .setAutoAttack();
    use(1, $item`BRICKO oyster`);
    autosell(1, $item`BRICKO pearl`);
    setAutoAttack(0);
  }

  ensureEffect($effect`Song of Bravado`);

  if (getProperty("boomBoxSong") !== "Total Eclipse of Your Meat") {
    cliExecute("boombox meat");
  }

  // Get buff things
  ensureSewerItem(1, $item`turtle totem`);
  ensureSewerItem(1, $item`saucepan`);

  // Don't use Kramco here.
  equip($slot`off-hand`, $item`none`);

  // Fruits in skeleton store (Saber YR)
  const missingOintment =
    availableAmount($item`ointment of the occult`) === 0 &&
    availableAmount($item`grapefruit`) === 0 &&
    haveEffect($effect`Mystically Oiled`) === 0;
  const missingOil =
    availableAmount($item`oil of expertise`) === 0 &&
    availableAmount($item`cherry`) === 0 &&
    haveEffect($effect`Expert Oiliness`) === 0;
  if (myClass() !== $class`Pastamancer` && (missingOil || missingOintment)) {
    cliExecute("mood apathetic");

    if (get("questM23Meatsmith") === "unstarted") {
      visitUrl("shop.php?whichshop=meatsmith&action=talk");
      runChoice(1);
    }
    // if (!canAdv($location`The Skeleton Store`, false)) error("Cannot open skeleton store!");
    adv1($location`The Skeleton Store`, -1, "");
    if (!containsText($location`The Skeleton Store`.noncombatQueue, "Skeletons In Store")) {
      throw "Something went wrong at skeleton store.";
    }
    setProperty("choiceAdventure1387", "3");
    mapMonster($location`The Skeleton Store`, $monster`novelty tropical skeleton`);
    withMacro(Macro.skill($skill`use the force`), runCombat);
    if (handlingChoice()) runChoice(3);
    // setProperty("mappingMonsters", "false");
  }

  // become a human fish hybrid
  if (get("_dnaHybrid") === false && get("dnaSyringe") !== "fish") {
    // tryEquip($item`powerful glove`);
    // useFamiliar($familiar`frumious bandersnatch`);
    print($location`the bubblin\' caldera`.noncombatQueue);
    adv1($location`The Bubblin\' Caldera`, -1, "");
    adv1($location`The Bubblin\' Caldera`, -1, "");
    print($location`the bubblin\' caldera`.noncombatQueue);
    if (
      containsText(
        $location`the bubblin\' caldera`.noncombatQueue,
        "Caldera Air; Aaaaah!  Aaaaaaaah!"
      )
    ) {
      adventureMacroAuto(
        $location`The Bubblin\' Caldera`,
        Macro.while_(
          "!monstername lava lamprey",
          Macro.trySkill($skill`extract`).trySkill($skill`macrometeorite`)
        ).if_(
          "monstername lava lamprey",
          Macro.trySkill($skill`extract`)
            .item($item`DNA Extraction Syringe`)
            .skill($skill`feel hatred`)
        )
      );
      useDefaultFamiliar();
      cliExecute("hottub"); // removing lava effect
      setAutoAttack(0);
    } else throw "Something went wrong getting fish DNA.";
  }

  if (get("_dnaHybrid") === false && get("dnaSyringe") === "fish") {
    cliExecute("camp dnainject");
  }

  if (!get("hasRange")) {
    ensureItem(1, $item`Dramatic&trade; range`);
    use(1, $item`Dramatic&trade; range`);
  }

  useSkill(1, $skill`Advanced Saucecrafting`);
  useSkill(1, $skill`Prevent Scurvy and Sobriety`);

  ensurePotionEffect($effect`Mystically Oiled`, $item`ointment of the occult`);

  // Maximize familiar weight
  cliExecute("fold makeshift garbage shirt");
  equip($item`makeshift garbage shirt`);
  equip($item`Fourth of May Cosplay Saber`);
  equip($slot`off-hand`, $item`none`);
  equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
  equip($slot`acc2`, $item`Brutal brogues`);
  equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

  cliExecute("mood hccs");

  // LOV tunnel for elixirs, epaulettes, and heart surgery
  // TODO: still need to make this combat better
  if (!getPropertyBoolean("_loveTunnelUsed")) {
    useDefaultFamiliar();
    ensureEffect($effect`carol of the bulls`);
    ensureEffect($effect`carol of the hells`);
    setChoice(1222, 1); // Entrance
    setChoice(1223, 1); // Fight LOV Enforcer
    setChoice(1224, 2); // LOV Epaulettes
    setChoice(1225, 1); // Fight LOV Engineer
    setChoice(1226, 2); // Open Heart Surgery
    setChoice(1227, 1); // Fight LOV Equivocator
    setChoice(1228, 3); // Take chocolate
    setAutoAttack("HCCS_LOV_tunnel");
    adv1($location`The Tunnel of L.O.V.E.`, -1, "");
    setAutoAttack(0);
  }

  equip($item`LOV epaulettes`);

  // spend 5 turns in DMT, skipping joy and cert, just get stats
  while (get("_machineTunnelsAdv") < 5) {
    useFamiliar($familiar`machine elf`);
    if (
      availableAmount($item`abstraction: action`) === 0 &&
      availableAmount($item`abstraction: joy`) === 0
    ) {
      setAutoAttack("melfgetaction");
      adv1($location`The Deep Machine Tunnels`, -1, "");
    } else if (
      availableAmount($item`abstraction: action`) === 1 &&
      availableAmount($item`abstraction: joy`) === 0
    ) {
      setAutoAttack("melfgetjoy");
      adv1($location`The Deep Machine Tunnels`, -1, "");
    } else {
      adventureMacroAuto($location`The Deep Machine Tunnels`, kill());
    }
    /* if ((availableAmount($item`abstraction: thought`) === 0) && (availableAmount($item`abstraction: certainty`) === 0) && (getProperty("_machineTunnelsAdv") < 5)) {
      setAutoAttack("melfgetthought");
      adv1($location`the deep machine tunnels`, -1, "");
      setAutoAttack(0);
    } else if ((availableAmount($item`abstraction: thought`) >= 1) && (availableAmount($item`abstraction: certainty`) === 0) && (getProperty("_machineTunnelsAdv") < 5)) {
      setAutoAttack("melfgetcertainty");
      adv1($location`the deep machine tunnels`, -1, "");
      setAutoAttack(0);
    } else { 
      adventureKill($location`the deep machine tunnels`);
    } */
  }

  useDefaultFamiliar();

  //witchess fights
  if (get("_witchessFights") < 5) {
    equip($item`fourth of may cosplay saber`);
    useDefaultFamiliar();
    while (toInt(getProperty("_witchessFights")) < 2) {
      Macro.step(justKillTheThing).setAutoAttack();
      visitUrl("campground.php?action=witchess");
      runChoice(1);
      visitUrl("choice.php?option=1&pwd=" + myHash() + "&whichchoice=1182&piece=1942", false);
      runCombat();
      setAutoAttack(0);
    }
    while (toInt(getProperty("_witchessFights")) === 2) {
      useDefaultFamiliar();
      Macro.attack().repeat().setAutoAttack();
      ensureEffect($effect`carol of the bulls`);
      visitUrl("campground.php?action=witchess");
      runChoice(1);
      visitUrl("choice.php?option=1&pwd=" + myHash() + "&whichchoice=1182&piece=1940", false);
      runCombat();
      setAutoAttack(0);
    }
    while (toInt(getProperty("_witchessFights")) === 3) {
      useDefaultFamiliar();
      Macro.attack().repeat().setAutoAttack();
      ensureEffect($effect`carol of the bulls`);
      visitUrl("campground.php?action=witchess");
      runChoice(1);
      visitUrl("choice.php?option=1&pwd=" + myHash() + "&whichchoice=1182&piece=1941", false);
      runCombat();
      setAutoAttack(0);
    }
  }

  // get witchess buff, this should fall all the way through to fam wt
  if (haveEffect($effect`puzzle champ`) === 0) {
    cliExecute("witchess");
  }

  // Professor 9x free sausage fight @ NEP
  if (getPropertyInt("_sausageFights") === 0) {
    useFamiliar($familiar`Pocket Professor`);
    tryEquip($item`Pocket Professor memory chip`);
    equip($item`Kramco Sausage-o-Matic&trade;`);
    equip($slot`acc2`, $item`Brutal brogues`);
    equip($slot`acc3`, $item`Beach Comb`);

    while (getPropertyInt("_sausageFights") === 0) {
      if (myHp() < 0.8 * myMaxhp()) {
        visitUrl("clan_viplounge.php?where=hottub");
      }

      // Just here to party.
      setChoice(1322, 2);
      adventureMacroAuto(
        $location`The Neverending Party`,
        Macro.if_('!monstername "sausage goblin"', new Macro().step("abort"))
          .trySkill(Skill.get("Lecture on Relativity"))
          .step(justKillTheThing)
      );
    }
  } else {
    print("YOU FUCKED UP THE KRAMCO CHAIN AGAIN, YOU DUMBASS! Go kill crayon elves instead.");
  }

  useDefaultFamiliar();
  equip($slot`acc2`, $item`backup camera`);
  equip($slot`shirt`, $item`none`);
  while (getProperty("feelNostalgicMonster") === "sausage goblin" && get("_backUpUses") < 11) {
    useDefaultFamiliar();
    adventureMacroAuto(
      $location`Noob Cave`,
      Macro.trySkill($skill`back-up to your last enemy`).step(justKillTheThing)
    );
  }
  setAutoAttack(0);

  // Breakfast

  // Visiting Looking Glass in clan VIP lounge
  visitUrl("clan_viplounge.php?action=lookingglass&whichfloor=2");
  cliExecute("swim item");
  while (getPropertyInt("_genieWishesUsed") < 3) {
    cliExecute("genie wish for more wishes");
  }

  // Visiting the Ruined House
  //  visit_url('place.php?whichplace=desertbeach&action=db_nukehouse');

  useSkill(1, $skill`Advanced Cocktailcrafting`);
  useSkill(1, $skill`Pastamastery`);
  useSkill(1, $skill`Spaghetti Breakfast`);
  useSkill(1, $skill`Grab a Cold One`);
  useSkill(1, $skill`Acquire Rhinestones`);
  useSkill(1, $skill`Perfect Freeze`);
  useSkill(1, $skill`summon kokomo resort pass`);
  autosell(1, $item`kokomo resort pass`);
  autosell(3, $item`coconut shell`);
  autosell(3, $item`magical ice cubes`);
  autosell(3, $item`little paper umbrella`);

  // Autosell stuff
  // autosell(1, $item[strawberry]);
  // autosell(1, $item[orange]);
  autosell(1, $item`razor-sharp can lid`);
  // autosell(5, $item[red pixel]);
  autosell(5, $item`green pixel`);
  autosell(5, $item`blue pixel`);
  autosell(5, $item`white pixel`);

  if (haveEffect($effect`Carlweather\'s Cantata of Confrontation`) > 0) {
    cliExecute("shrug Carlweather's Cantata of Confrontation");
  }

  cliExecute("mood hccs");
  equip($item`makeshift garbage shirt`);
  useFamiliar($familiar`God Lobster`);
  while (get("_godLobsterFights") < 2) {
    setProperty("choiceAdventure1310", "1");
    tryEquip($item`God Lobster\'s Scepter`);
    visitUrl("main.php?fightgodlobster=1");
    withMacro(Macro.skill($skill`saucegeyser`), runCombat);
    visitUrl("choice.php");
    if (handlingChoice()) runChoice(1);
    setAutoAttack(0);
  }

  // fight a witchess queen for pointy crown, getting a couple weapon damage effects just in case
  if (toInt(getProperty("_witchessFights")) === 4) {
    useDefaultFamiliar();
    Macro.attack().repeat().setAutoAttack();
    ensureEffect($effect`carol of the bulls`);
    ensureEffect($effect`song of the north`);
    visitUrl("campground.php?action=witchess");
    runChoice(1);
    visitUrl("choice.php?option=1&pwd=" + myHash() + "&whichchoice=1182&piece=1939", false);
    runCombat();
    setAutoAttack(0);
  }

  useDefaultFamiliar();

  equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

  // 14 free NEP fights, using mob hit and xray
  while (
    getPropertyInt("_neverendingPartyFreeTurns") < 10 ||
    (haveSkill($skill`Chest X-Ray`) && getPropertyInt("_chestXRayUsed") < 3) ||
    (haveSkill($skill`Gingerbread Mob Hit`) && !getPropertyBoolean("_gingerbreadMobHitUsed"))
  ) {
    ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);
    ensureSong($effect`The Magical Mojomuscular Melody`);
    ensureSong($effect`Polka of Plenty`);
    ensureEffect($effect`inscrutable gaze`);
    ensureEffect($effect`pride of the puffin`);
    ensureEffect($effect`drescher\'s annoying noise`);
    ensureSong($effect`ur-kel\'s aria of annoyance`);
    ensureEffect($effect`Feeling Excited`);

    cliExecute("mood execute");

    // Otherwise fight.
    setChoice(1324, 5);
    // }

    ensureMpSausage(100);
    if (getPropertyInt("_neverendingPartyFreeTurns") < 10 && getPropertyInt("_feelPrideUsed") < 3) {
      useDefaultFamiliar();
      adventureMacroAuto(
        $location`The Neverending Party`,
        Macro.trySkill($skill`feel pride`).step(justKillTheThing)
      );
    } else if (getPropertyInt("_neverendingPartyFreeTurns") < 10) {
      useDefaultFamiliar();
      adventureMacroAuto($location`The Neverending Party`, Macro.step(justKillTheThing));
    } else {
      useDefaultFamiliar();
      adventureMacroAuto(
        $location`The Neverending Party`,
        Macro.trySkill($skill`chest x-ray`).trySkill($skill`gingerbread mob hit`)
      );
    }
  }

  equip($item`Fourth of May Cosplay Saber`);
  cliExecute("fold makeshift garbage shirt");
  equip($item`makeshift garbage shirt`);
  useDefaultFamiliar();

  if (getProperty("boomBoxSong") !== "These Fists Were Made for Punchin'") {
    cliExecute("boombox damage");
  }

  if (myClass() === $class`Pastamancer`) useSkill(1, $skill`Bind Undead Elbow Macaroni`);
  else ensurePotionEffect($effect`Expert Oiliness`, $item`oil of expertise`);

  // synthesis_plan($effect[Synthesis: Strong], tail(tail(subsequent)));

  // ensure_effect($effect[Gr8ness]);
  // ensure_effect($effect[Tomato Power]);
  ensureEffect($effect`Song of Starch`);
  ensureEffect($effect`Big`);
  ensureSong($effect`Power Ballad of the Arrowsmith`);
  ensureEffect($effect`Rage of the Reindeer`);
  ensureEffect($effect`Quiet Determination`);
  ensureEffect($effect`Disdain of the War Snapper`);
  ensureNpcEffect($effect`Go Get \'Em, Tiger!`, 5, $item`Ben-Gal&trade; balm`);

  useFamiliar($familiar`disembodied hand`);

  maximize("hp", false);

  // QUEST - Donate Blood (HP)
  if (myMaxhp() - myBuffedstat($stat`muscle`) - 3 < 1770) {
    error("Not enough HP to cap.");
  }
  TEMP_TURNS = myTurncount();
  doTest(TEST_HP);
  HP_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_MUS)) {
  if (myClass() === $class`Pastamancer`) useSkill(1, $skill`Bind Undead Elbow Macaroni`);
  else ensurePotionEffect($effect`Expert Oiliness`, $item`oil of expertise`);

  if (myInebriety() === 0) {
    ensureOde(3);
    // tryUse(1, $item`astral six-pack`);
    // drink(4, $item`astral pilsner`);
    cliExecute("drinksilent hot socks");
  }

  ensureEffect($effect`Big`);
  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave\'s Shanty of Superiority`);
  ensureSong($effect`Power Ballad of the Arrowsmith`);
  ensureEffect($effect`Rage of the Reindeer`);
  ensureEffect($effect`Quiet Determination`);
  ensureEffect($effect`Disdain of the War Snapper`);
  // ensure_effect($effect[Tomato Power]);
  ensureNpcEffect($effect`Go Get \'Em, Tiger!`, 5, $item`Ben-Gal&trade; balm`);
  // ensure_effect($effect[Ham-Fisted]);
  create(1, $item`philter of phorce`);
  ensureEffect($effect`Phorcefullness`);
  maximize("muscle", false);

  if (
    myClass() === $class`Pastamancer` &&
    myBuffedstat($stat`muscle`) - myBasestat($stat`mysticality`) < 1770
  ) {
    error("Not enough moxie to cap.");
  } else if (myBuffedstat($stat`muscle`) - myBasestat($stat`muscle`) < 1770) {
    error("Not enough moxie to cap.");
  }

  // cli_execute('modtrace mus');
  // abort();
  TEMP_TURNS = myTurncount();
  doTest(TEST_MUS);
  MUS_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_MYS)) {
  ensureEffect($effect`Big`);
  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave\'s Shanty of Superiority`);
  ensureSong($effect`The Magical Mojomuscular Melody`);
  ensureEffect($effect`Quiet Judgement`);
  // ensure_effect($effect[Tomato Power]);
  ensureEffect($effect`Mystically Oiled`);
  ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);
  maximize("mysticality", false);
  if (myBuffedstat($stat`mysticality`) - myBasestat($stat`mysticality`) < 1770) {
    error("Not enough mysticality to cap.");
  }
  TEMP_TURNS = myTurncount();
  doTest(TEST_MYS);
  MYS_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_MOX)) {
  if (myClass() === $class`Pastamancer`) useSkill(1, $skill`Bind Penne Dreadful`);
  else ensurePotionEffect($effect`Expert Oiliness`, $item`oil of expertise`);

  // Beach Comb
  ensureEffect($effect`Pomp & Circumsands`);

  use(1, $item`Bird-a-Day Calendar`);
  ensureEffect($effect`Blessing of the Bird`);

  // Should be 11% NC and 50% moxie, will fall through to NC test
  ensureEffect($effect`Blessing of your favorite Bird`);

  ensureEffect($effect`Big`);
  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave\'s Shanty of Superiority`);
  ensureSong($effect`The Moxious Madrigal`);
  ensureEffect($effect`Quiet Desperation`);
  // ensure_effect($effect[Tomato Power]);
  ensureNpcEffect($effect`Butt-Rock Hair`, 5, $item`hair spray`);
  use(availableAmount($item`rhinestone`), $item`rhinestone`);
  if (haveEffect($effect`Unrunnable Face`) === 0) {
    tryUse(1, $item`runproof mascara`);
  }
  maximize("moxie", false);
  if (
    myClass() === $class`Pastamancer` &&
    myBuffedstat($stat`moxie`) - myBasestat($stat`mysticality`) < 1770
  ) {
    throw "Not enough moxie to cap.";
  } else if (myBuffedstat($stat`moxie`) - myBasestat($stat`moxie`) < 1770) {
    throw "Not enough moxie to cap.";
  }

  TEMP_TURNS = myTurncount();
  doTest(TEST_MOX);
  MOX_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_HOT_RES)) {
  ensureMpSausage(500);
  useDefaultFamiliar();
  fightSausageIfGuaranteed();

  // Make sure no moon spoon.
  equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
  equip($slot`acc2`, $item`Powerful Glove`);
  equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

  if (availableAmount($item`heat-resistant gloves`) === 0) {
    adv1($location`LavaCo&trade; Lamp Factory`, -1, "");
    if (
      !containsText(
        $location`LavaCo&trade; Lamp Factory`.noncombatQueue,
        "LavaCo&trade; Welcomes You"
      )
    ) {
      throw "Something went wrong at LavaCo.";
    }
    equip($item`Fourth of May Cosplay Saber`);
    equip($item`vampyric cloake`);
    setProperty("choiceAdventure1387", "3");
    mapMonster($location`LavaCo&trade; Lamp Factory`, $monster`Factory worker (female)`);
    withMacro(
      Macro.skill($skill`become a cloud of mist`)
        .skill($skill`meteor shower`)
        .skill($skill`use the force`),
      runCombat
    );
    while (lastChoice() === 1387 && handlingChoice()) {
      runChoice(3);
    }
    setProperty("mappingMonsters", "false");
  }

  // synth hot

  if (haveEffect($effect`Synthesis: Hot`) == 0) {
    cliExecute("synthesize hot");
  }

  /*
  if (haveEffect($effect`Synthesis: Hot`) == 0) {
    setProperty("autoSatisfyWithNPCs", "true");
    buy($item`tamarind-flavored chewing gum`, 1);
    buy($item`lime-and-chile-flavored chewing gum`, 1);
    // cliExecute("synthesize hot");
    sweetSynthesis(
      $item`tamarind-flavored chewing gum`,
      $item`lime-and-chile-flavored chewing gum`
    );
    setProperty("autoSatisfyWithNPCs", "false");
  } */

  // add +5 hot res to KGB, relies on Ezandora's script, naturally
  cliExecute("briefcase e hot");

  // set retrocape to elemental resistance
  cliExecute("retrocape mus hold");

  ensureEffect($effect`Blood Bond`);
  ensureEffect($effect`Leash of Linguini`);
  ensureEffect($effect`Empathy`);
  ensureEffect($effect`feeling peaceful`);

  // Pool buff. This will fall through to fam weight.
  ensureEffect($effect`Billiards Belligerence`);

  if (
    availableAmount($item`metal meteoroid`) > 0 &&
    availableAmount($item`meteorite guard`) === 0
  ) {
    cliExecute("create 1 meteorite guard");
  }

  ensureItem(1, $item`tenderizing hammer`);
  cliExecute("smash * ratty knitted cap");
  cliExecute("smash * red-hot sausage fork");
  autosell(10, $item`hot nuggets`);
  autosell(10, $item`twinkly powder`);

  if (availableAmount($item`hot powder`) > 0) {
    ensureEffect($effect`Flame-Retardant Trousers`);
  }

  if (
    availableAmount($item`sleaze powder`) > 0 ||
    availableAmount($item`lotion of sleaziness`) > 0
  ) {
    ensurePotionEffect($effect`Sleazy Hands`, $item`lotion of sleaziness`);
  }

  // wish for healthy green glow, should fall through
  // wish_effect($effect[healthy green glow]);

  ensureEffect($effect`Elemental Saucesphere`);
  ensureEffect($effect`Astral Shell`);

  // Build up 100 turns of Deep Dark Visions for spell damage later.
  while (
    haveSkill($skill`Deep Dark Visions`) &&
    haveEffect($effect`Visions of the Deep Dark Deeps`) < 50
  ) {
    if (myMp() < 20) {
      ensureCreateItem(1, $item`magical sausage`);
      eat(1, $item`magical sausage`);
    }
    while (myHp() < myMaxhp()) {
      useSkill(1, $skill`Cannelloni Cocoon`);
    }
    if (myMp() < 100) {
      ensureCreateItem(1, $item`magical sausage`);
      eat(1, $item`magical sausage`);
    }
    if (round(numericModifier("spooky resistance")) < 10) {
      ensureEffect($effect`Does It Have a Skull In There??`);
      if (round(numericModifier("spooky resistance")) < 10) {
        throw "Not enough spooky res for Deep Dark Visions.";
      }
    }
    useSkill(1, $skill`Deep Dark Visions`);
  }

  // drink hot socks here if you're a tryhard

  // Beach comb buff.
  ensureEffect($effect`Hot-Headed`);

  // Use pocket maze
  if (availableAmount($item`pocket maze`) > 0) ensureEffect($effect`Amazing`);

  // if (get_property('_horsery') != 'pale horse') cli_execute('horsery pale');

  useFamiliar($familiar`Exotic Parrot`);
  if (availableAmount($item`cracker`) === 0 && getPropertyInt("tomeSummons") < 2) {
    retrieveItem(1, $item`box of Familiar jacks`);
    use(1, $item`box of Familiar Jacks`);
    equip($item`cracker`);
  }

  // Mafia sometimes can't figure out that multiple +weight things would get us to next tier.
  maximize("hot res, 0.01 familiar weight", false);

  if (round(numericModifier("hot resistance")) < 59) {
    throw "Something went wrong building hot res.";
  }

  // cli_execute('modtrace Hot Resistance');
  // abort();
  logprint(cliExecuteOutput("modtrace hot resistance"));

  TEMP_TURNS = myTurncount();
  doTest(TEST_HOT_RES);
  HOT_RES_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_NONCOMBAT)) {
  if (myHp() < 30) useSkill(1, $skill`Cannelloni Cocoon`);
  ensureEffect($effect`Blood Bond`);
  ensureEffect($effect`Leash of Linguini`);
  ensureEffect($effect`Empathy`);

  if (get("_godLobsterFights") < 3) {
    if (myHp() < 0.8 * myMaxhp()) useSkill(1, $skill`Cannelloni Cocoon`);
    useFamiliar($familiar`God Lobster`);
    // Get -combat buff.
    setProperty("choiceAdventure1310", "2");
    equip($item`God Lobster\'s Ring`);
    visitUrl("main.php?fightgodlobster=1");
    withMacro(Macro.skill($skill`saucegeyser`), runCombat);
    visitUrl("choice.php");
    if (handlingChoice()) runChoice(2);
    setAutoAttack(0);
  }

  // setting KGB to NC, relies on Ezandora's script
  cliExecute("briefcase e -combat");

  // Pool buff. Should fall through to weapon damage.
  ensureEffect($effect`Billiards Belligerence`);

  equip($slot`acc3`, $item`Powerful Glove`);

  ensureEffect($effect`gummed shoes`);
  ensureEffect($effect`The Sonata of Sneakiness`);
  ensureEffect($effect`Smooth Movements`);
  ensureEffect($effect`Invisible Avatar`);
  ensureEffect($effect`Silent Running`);
  ensureEffect($effect`Feeling Lonely`);

  // Rewards
  ensureEffect($effect`Throwing Some Shade`);
  // ensure_effect($effect[A Rose by Any Other Material]);

  // wish for disquiet riot because shades are hilariously expensive
  // wishEffect($effect`disquiet riot`);

  useFamiliar($familiar`Disgeist`);

  // Pastamancer d1 is -combat.
  if (myClass() === $class`pastamancer`) {
    ensureEffect($effect`Blessing of the Bird`);
  }

  maximize("-combat, 0.01 familiar weight", false);

  if (round(numericModifier("combat rate")) > -40) {
    error("Not enough -combat to cap.");
  }

  // cli_execute('modtrace combat rate');
  // abort();
  TEMP_TURNS = myTurncount();
  doTest(TEST_NONCOMBAT);
  NONCOMBAT_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_FAMILIAR)) {
  fightSausageIfGuaranteed();

  // These should have fallen through all the way from leveling.
  ensureEffect($effect`Fidoxene`);
  ensureEffect($effect`Do I Know You From Somewhere?`);

  // Pool buff.
  ensureEffect($effect`Billiards Belligerence`);

  if (myHp() < 30) useSkill(1, $skill`Cannelloni Cocoon`);
  ensureEffect($effect`Blood Bond`);
  ensureEffect($effect`Leash of Linguini`);
  ensureEffect($effect`Empathy`);
  ensureEffect($effect`robot friends`);
  ensureEffect($effect`human-machine hybrid`);
  ensureEffect($effect`shortly stacked`);
  ensureEffect($effect`joy`);
  ensureEffect($effect`A Girl Named Sue`);
  /*
  if (availableAmount($item`cracker`) > 0 && getPropertyInt("tomeSummons") < 3) {
    useFamiliar($familiar`Exotic Parrot`);
    equip($item`cracker`);
  }
*/
  // tune moon to opossum for +5lb
  if (!getPropertyBoolean("moonTuned")) {
    // Unequip spoon.
    equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
    equip($slot`acc2`, $item`Powerful Glove`);
    equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);

    // Actually tune the moon.
    visitUrl("inv_use.php?whichitem=10254&doit=96&whichsign=4");
  }

  if (get("_deckCardsDrawn") === 5 && availableAmount($item`rope`) === 0) {
    cliExecute("cheat rope");
  }

  // this is going to be all the gingerbread stuff, it is a work in progress
  if (
    haveEffect($effect`whole latte love`) === 0 &&
    availableAmount($item`gingerbread spice latte`) === 0
  ) {
    useFamiliar($familiar`chocolate lab`);
    maximize("sprinkle drop", false);
    if (!get("_gingerbreadClockAdvanced")) {
      visitUrl("adventure.php?snarfblat=477");
      runChoice(1);
    }
    if (availableAmount($item`sprinkles`) < 50) {
      adventureMacroAuto(
        $location`Gingerbread Upscale Retail District`,
        Macro.if_("monstername gingerbread gentrifier", Macro.skill($skill`macrometeorite`)).skill(
          $skill`shattering punch`
        )
      );
      setAutoAttack(0);
    }
    if (availableAmount($item`sprinkles`) >= 50) {
      // equip($slot`acc3`, $item`kremlin's greatest briefcase`);
      useFamiliar($familiar`frumious bandersnatch`);
      ensureEffect($effect`ode to booze`);
      setChoice(1208, 3);
      while (
        availableAmount($item`gingerbread spice latte`) === 0 &&
        haveEffect($effect`whole latte love`) === 0
      ) {
        adventureMacro($location`Gingerbread Upscale Retail District`, Macro.step("runaway"));
      }
    } else {
      throw "Something went wrong getting sprinkles";
    }
    use($item`gingerbread spice latte`);
    useDefaultFamiliar();
  }

  abort();

  if (haveEffect($effect`Meteor Showered`) === 0) {
    equip($item`Fourth of May Cosplay Saber`);
    adventureMacroAuto(
      $location`The Neverending Party`,
      Macro.trySkill($skill`Meteor Shower`).trySkill($skill`Use the Force`)
    );
    setAutoAttack(0);
  }

  if (
    availableAmount($item`burning newspaper`) > 0 &&
    availableAmount($item`burning paper crane`) < 1
  ) {
    cliExecute("create 1 burning paper crane");
  }

  while (
    myMp() > mpCost($skill`Summon BRICKOs`) &&
    availableAmount($item`green candy heart`) === 0 &&
    haveEffect($effect`heart of green`) === 0
  ) {
    useSkill($skill`summon candy heart`);
  }

  ensureEffect($effect`heart of green`);

  while (
    myMp() > mpCost($skill`Summon BRICKOs`) &&
    availableAmount($item`love song of icy revenge`) < 2 &&
    haveEffect($effect`cold hearted`) === 0
  ) {
    useSkill($skill`summon love song`);
  }

  if (
    haveEffect($effect`cold hearted`) === 0 &&
    availableAmount($item`love song of icy revenge`) > 1
  ) {
    cliExecute("pillkeeper extend");
    use($item`love song of icy revenge`);
    cliExecute("pillkeeper extend");
    use($item`love song of icy revenge`);
  } else throw "You don't have 2 love songs :(";

  wishEffect($effect`healthy green glow`);
  wishEffect($effect`down with chow`);

  if (haveEffect($effect`boxing day glow`) === 0 && availableAmount($item`body spradium`) > 0)
    chew($item`body spradium`);

  if (haveEffect($effect`smart drunk`) === 0) drink(1, $item`vintage smart drink`);
  // drink(1, $item`hot socks`);

  // checking here to see if we had a tome summon for a cracker or if we should use BBB
  if (availableAmount($item`cracker`) > 0) {
    useFamiliar($familiar`exotic parrot`);
  } else if (availableAmount($item`bugged beanie`) === 1) {
    useFamiliar($familiar`baby bugged bugbear`);
  }

  maximize("familiar weight", false);

  // cli_execute('modtrace familiar weight');

  TEMP_TURNS = myTurncount();
  doTest(TEST_FAMILIAR);
  FAMILIAR_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_WEAPON)) {
  fightSausageIfGuaranteed();

  // Get inner elf for weapon damage
  if (haveEffect($effect`inner elf`) === 0 && getPropertyInt("_snokebombUsed") < 3) {
    cliExecute("/whitelist hobopolis vacation home");
    ensureEffect($effect`blood bubble`);
    useFamiliar($familiar`machine elf`);
    setProperty("choiceAdventure326", "1");
    adventureMacro($location`The Slime Tube`, Macro.skill($skill`snokebomb`));
    useDefaultFamiliar();
    cliExecute("/whitelist alliance from hell");
  } else {
    print("Something went wrong with getting inner elf");
  }

  // Paint crayon elf for DNA and ghost buff (Saber YR)
  /*
  if (!getPropertyBoolean("_chateauMonsterFought")) {
    const chateauText = visitUrl("place.php?whichplace=chateau", false);
    const m = createMatcher("alt="Painting of a? ([^(]*) .1."", chateauText);
    if (find(m) && group(m, 1) === "Black Crayon Crimbo Elf") {
      cliExecute("mood apathetic");
      useFamiliar($familiar`ghost of crimbo carols`);
      equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);
      if (getPropertyInt("_reflexHammerUsed") === 3) {
        error("You do not have any banishes left");
      }
      setHccsCombatMode(MODE_CUSTOM, mSkill(mItem(mNew(), $item`DNA extraction syringe`), $skill`Reflex Hammer`));
      visitUrl("place.php?whichplace=chateau&action=chateau_painting", false);
      runCombat();
      useDefaultFamiliar();
    } else {
      error("Wrong painting.");
    }
  } */

  if (myInebriety() < 14) cliExecute("drinksilent 1 sockdollager");
  if (availableAmount($item`glass of raw eggs`) > 0) eat($item`glass of raw eggs`);

  if (!get("_chateauMonsterFought")) {
    // const chateauText = visitUrl("place.php?whichplace=chateau", false);
    // const match = chateauText.match(/alt="Painting of an? ([^(]*) .1."/);
    // if (getPropertyInt("camelSpit") === 100) useFamiliar($familiar`Melodramedary`);
    useFamiliar($familiar`ghost of crimbo carols`);
    equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);
    if (get("_reflexHammerUsed") > 2) {
      error("You do not have any banishes left");
    }
    Macro.item($item`DNA extraction syringe`)
      .skill($skill`reflex hammer`)
      .setAutoAttack();
    visitUrl("place.php?whichplace=chateau&action=chateau_painting", false);
    runCombat();
    useDefaultFamiliar();
  } else {
    throw "You already fought your painting";
  }

  geneTonic("elf");
  ensureEffect($effect`human-elf hybrid`);

  // maybe try just setting autoattack to HCCS_Spit

  // fax an ungulith to get corrupted marrow, meteor showered, and spit upon (if applicable)
  if (availableAmount($item`corrupted marrow`) === 0 && haveEffect($effect`cowrruption`) === 0) {
    print("Your camel spit level is " + get("camelSpit"), "green");
    if (availableAmount($item`photocopied monster`) === 0) {
      if (getPropertyBoolean("_photocopyUsed")) error("Already used fax for the day.");
      cliExecute("/whitelist alliance from hell");
      chatPrivate("easyfax", "ungulith");
      for (let i = 0; i < 2; i++) {
        wait(10);
        cliExecute("fax receive");
        if (get("photocopyMonster") === $monster`ungulith`) break;
        // otherwise got the wrong monster, put it back.
        cliExecute("fax send");
      }
      if (availableAmount($item`photocopied monster`) === 0) throw "Failed to fax in ungulith.";
    }
    cliExecute("mood apathetic");
    equip($item`Fourth of May Cosplay Saber`);
    if (getPropertyInt("camelSpit") === 100) {
      useFamiliar($familiar`melodramedary`);
      Macro.skill($skill`meteor shower`)
        .skill($skill`7340`)
        .skill($skill`use the force`)
        .setAutoAttack();
      setProperty("choiceAdventure1387", "3");
      use(1, $item`photocopied monster`);
      setAutoAttack(0);
      cliExecute("set camelSpit = 0");
      setProperty("camelSpit", "0");
      useDefaultFamiliar();
    } else {
      print("your camel is not full enough", "red");
      abort();
    }
  }
  /*
  if (haveEffect($effect`In a Lather`) === 0) {
    if (myInebriety() > inebrietyLimit() - 2) {
      error("Something went wrong. We are too drunk.");
    }
    assertMeat(500);
    ensureOde(2);
    cliExecute("drink Sockdollager");
  }
*/
  if (availableAmount($item`twinkly nuggets`) > 0) {
    ensureEffect($effect`Twinkly Weapon`);
  }

  ensureEffect($effect`Carol of the Bulls`);
  ensureEffect($effect`Song of the North`);
  ensureEffect($effect`Rage of the Reindeer`);
  ensureEffect($effect`Frenzied, Bloody`);
  ensureEffect($effect`Scowl of the Auk`);
  ensureEffect($effect`Disdain of the War Snapper`);
  ensureEffect($effect`Tenacity of the Snapper`);
  ensureSong($effect`Jackasses\' Symphony of Destruction`);
  if (availableAmount($item`lov elixir \#3`) > 0) {
    ensureEffect($effect`The Power of LOV`);
  }

  if (availableAmount($item`vial of hamethyst juice`) > 0) {
    ensureEffect($effect`Ham-Fisted`);
  }

  // make KGB set to weapon
  cliExecute("briefcase e weapon");

  // Hatter buff

  // Beach Comb
  if (!containsText(getProperty("_beachHeadsUsed"), "6")) {
    ensureEffect($effect`Lack of Body-Building`);
  }

  // Boombox potion - did we get one?
  if (availableAmount($item`Punching Potion`) > 0) {
    ensureEffect($effect`Feeling Punchy`);
  }

  // Pool buff. Should have fallen through.
  ensureEffect($effect`Billiards Belligerence`);

  // Corrupted marrow
  ensureEffect($effect`Cowrruption`);

  // Pastamancer d1 is weapon damage.

  ensureEffect($effect`Blessing of your Favorite Bird`);
  // ensureEffect($effect`Blessing of the Bird`);

  // ensureNpcEffect($effect`Engorged Weapon`, 1, $item`Meleegra&trade; pills`);

  // wish_effect($effect[Outer Wolf&trade;]);

  // this is just an assert, effectively.
  // ensureEffect($effect`Meteor Showered`);

  ensureEffect($effect`Bow-Legged Swagger`);

  useFamiliar($familiar`disembodied hand`);

  maximize("weapon damage", false);

  function weaponTurns() {
    return (
      60 -
      floor(numericModifier("weapon damage") / 25 + 0.001) -
      floor(numericModifier("weapon damage percent") / 25 + 0.001)
    );
  }

  if (weaponTurns() > 2) {
    error("Something went wrong with weapon damage.");
  }

  // cli_execute('modtrace weapon damage');
  // abort();
  TEMP_TURNS = myTurncount();
  doTest(TEST_WEAPON);
  WEAPON_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_SPELL)) {
  // ensureEffect($effect`Simmering`);

  ensureEffect($effect`Song of Sauce`);
  ensureEffect($effect`Carol of the Hells`);
  ensureEffect($effect`Arched Eyebrow of the Archmage`);
  ensureSong($effect`Jackasses\' Symphony of Destruction`);
  if (availableAmount($item`lov elixir \#6`) > 0) {
    ensureEffect($effect`The Magic of LOV`);
  }

  ensureEffect($effect`AAA-charged`);
  ensureEffect($effect`AA-charged`);
  ensureEffect($effect`D-charged`);

  wishEffect($effect`witch breaded`);

  // Pool buff
  ensureEffect($effect`Mental A-cue-ity`);

  // Beach Comb
  ensureEffect($effect`We\'re All Made of Starfish`);

  // Tea party
  ensureSewerItem(1, $item`mariachi hat`);
  ensureEffect($effect`Full Bottle in front of Me`);

  useSkill(1, $skill`Spirit of Cayenne`);

  // Get flimsy hardwood scraps.
  visitUrl("shop.php?whichshop=lathe");
  if (availableAmount($item`flimsy hardwood scraps`) > 0) {
    retrieveItem(1, $item`weeping willow wand`);
  }

  ensureItem(1, $item`obsidian nutcracker`);

  cliExecute("briefcase e spell");

  print("HEY GO DO SOME STUFF WITH toxic teacups and maybe summon a donut");
  abort();

  if (haveEffect($effect`gaze of the gazelle`) === 0) eat(1, $item`weird gazelle steak`);

  if (
    haveEffect($effect`filled with magic`) === 0 &&
    availableAmount($item`occult jelly donut`) === 0 &&
    get("tomeSummons") < 3
  ) {
    cliExecute("create 1 occult jelly donut");
    eat(1, $item`occult jelly donut`);
  }

  /*
  useDefaultFamiliar();
  equip($slot`acc2`, $item`backup camera`);
  equip($slot`shirt`, $item`none`);
  while (getProperty("feelNostalgicMonster") === "sausage goblin" && get("_backUpUses") < 11) {
    useDefaultFamiliar();
    adventureMacroAuto(
      $location`Noob Cave`,
      Macro.trySkill($skill`back-up to your last enemy`).step(justKillTheThing)
    );
  }
  setAutoAttack(0);
*/

  // Get inner elf for spell damage
  if (haveEffect($effect`inner elf`) === 0 && getPropertyInt("_snokebombUsed") < 3) {
    cliExecute("/whitelist hobopolis vacation home");
    ensureEffect($effect`blood bubble`);
    useFamiliar($familiar`machine elf`);
    setProperty("choiceAdventure326", "1");
    adventureMacro($location`The Slime Tube`, Macro.skill($skill`snokebomb`));
    useDefaultFamiliar();
    cliExecute("/whitelist alliance from hell");
  } else {
    print("Something went wrong with getting inner elf");
  }

  // Meteor showered
  if (haveEffect($effect`Meteor Showered`) === 0) {
    equip($item`Fourth of May Cosplay Saber`);
    adventureMacroAuto(
      $location`Noob Cave`,
      Macro.skill($skill`Meteor Shower`).skill($skill`Use the Force`)
    );
  }
  setAutoAttack(0);

  if (myClass() === $class`sauceror`) {
    cliExecute("barrelprayer buff");
  }

  // Sigils of Yeg = 200% SD
  if (!getPropertyBoolean("_cargoPocketEmptied") && haveEffect($effect`Sigils of Yeg`) === 0) {
    if (availableAmount($item`Yeg\'s Motel hand soap`) === 0) cliExecute("cargo 177");
    ensureEffect($effect`Sigils of Yeg`);
  }

  if (round(numericModifier("spell damage percent")) % 50 >= 40) {
    ensureItem(1, $item`soda water`);
    ensurePotionEffect($effect`Concentration`, $item`cordial of concentration`);
  }

  useFamiliar($familiar`disembodied hand`);

  maximize("spell damage", false);

  function spellTurns() {
    return (
      60 -
      floor(numericModifier("spell damage") / 50 + 0.001) -
      floor(numericModifier("spell damage percent") / 50 + 0.001)
    );
  }

  while (spellTurns() > myAdventures()) {
    eat(1, $item`magical sausage`);
  }

  cliExecute("modtrace spell damage");
  abort();
  TEMP_TURNS = myTurncount();
  doTest(TEST_SPELL);
  SPELL_TURNS = myTurncount() - TEMP_TURNS;
}

if (!testDone(TEST_ITEM)) {
  ensureMpSausage(500);

  fightSausageIfGuaranteed();

  // kramco messes up maps
  equip($slot`off-hand`, $item`none`);

  //getting a lil ninja costume for the tot
  if (availableAmount($item`9140`) === 0 && getPropertyInt("_shatteringPunchUsed") < 3) {
    Macro.skill($skill`shattering punch`).setAutoAttack();
    mapMonster($location`The Haiku Dungeon`, $monster`Amateur ninja`);
    setLocation($location`none`);
    setAutoAttack(0);
  }

  // use abstraction: certainty if you have it
  // ensureEffect($effect`certainty`);

  // pulls wheel of fortune from deck, gets rope and wrench for later
  if (getPropertyInt("_deckCardsDrawn") === 10) {
    cliExecute("cheat buff items");
  }

  useDefaultFamiliar();

  // get pirate DNA and make a gene tonic
  if (get("dnaSyringe") !== "pirate" && haveEffect($effect`Human-Pirate Hybrid`) === 0) {
    equip($slot`acc1`, $item`Kremlin\'s Greatest Briefcase`);
    if (get("_kgbTranquilizerDartUses") >= 3) {
      error("Out of KGB banishes");
    }
    // adv once for the opening free NC, should check NC queue here
    print($location`Pirates of the Garbage Barges`.noncombatQueue);
    adv1($location`Pirates of the Garbage Barges`, -1, "");
    print($location`Pirates of the Garbage Barges`.noncombatQueue);

    if (
      containsText(
        $location`Pirates of the Garbage Barges`.noncombatQueue,
        "Dead Men Smell No Tales"
      )
    ) {
      adventureMacroAuto(
        $location`Pirates of the Garbage Barges`,
        Macro.item($item`DNA extraction syringe`).skill($skill`KGB tranquilizer dart`)
      );
      geneTonic("pirate");
      ensureEffect($effect`Human-Pirate Hybrid`);
      setAutoAttack(0);
    } else throw "Something went wrong getting pirate DNA.";
  }

  useDefaultFamiliar();

  if (haveEffect($effect`Bat-Adjacent Form`) === 0) {
    if (getPropertyInt("_reflexHammerUsed") >= 3) error("Out of reflex hammers!");
    equip($slot`acc3`, $item`Lil\' Doctor&trade; Bag`);
    equip($item`vampyric cloake`);
    adventureMacroAuto(
      $location`The Neverending Party`,
      Macro.skill($skill`Become a Bat`).skill($skill`Reflex Hammer`)
    );
    setAutoAttack(0);
  }

  if (!getPropertyBoolean("_clanFortuneBuffUsed")) {
    ensureEffect($effect`There\'s No N In Love`);
  }

  ensureEffect($effect`Fat Leon\'s Phat Loot Lyric`);
  ensureEffect($effect`Singer\'s Faithful Ocelot`);
  ensureEffect($effect`The Spirit of Taking`);
  ensureEffect($effect`items.enh`);

  // synthesis: collection
  // cliExecute("create 1 peppermint twist");
  if (haveEffect($effect`Synthesis: Collection`) === 0) {
    use(1, $item`peppermint sprout`);
    sweetSynthesis($item`peppermint sprout`, $item`peppermint twist`);
  }
  // SynthesisPlanner.synthesize($effect`Synthesis: Collection`);

  // see what class we are, maybe a couple other buffs
  if (myClass() === $class`pastamancer`) {
    cliExecute("barrelprayer buff");
  } else if (myClass() === $class`sauceror`) {
    useSkill(1, $skill`7323`); // seek out a bird
  }

  // Use bag of grain.
  ensureEffect($effect`Nearly All-Natural`);

  ensureEffect($effect`Feeling Lost`);
  ensureEffect($effect`Steely-Eyed Squint`);

  // get big smile of the blender if available, someday use this to replace something?
  if (getPropertyInt("_campAwaySmileBuffs") === 1) {
    visitUrl("place.php?whichplace=campaway&action=campaway_sky");
  }

  useFamiliar($familiar`Trick-or-Treating Tot`);
  equip($item`9140`); // ninja costume for 150% item

  maximize(
    "item, 2 booze drop, -equip broken champagne bottle, -equip surprisingly capacious handbag",
    false
  );

  // cli_execute('modtrace item');
  // abort();
  TEMP_TURNS = myTurncount();
  doTest(TEST_ITEM);
  ITEM_TURNS = myTurncount() - TEMP_TURNS;
}

useSkill(1, $skill`spirit of nothing`);
setProperty("autoSatisfyWithNPCs", "true");
setProperty("autoSatisfyWithCoinmasters", getProperty("_saved_autoSatisfyWithCoinmasters"));
setProperty("hpAutoRecovery", "0.8");

cliExecute("mood default");
cliExecute("ccs default");
cliExecute("boombox food");
cliExecute("/whitelist alliance from hell");

visitUrl("peevpee.php?action=smashstone&confirm=on");
print("Stone smashed. Get your PVP on!", "green");
// spar for 6 fights
/*
if (get("_daycareRecruits") === 0 && hippyStoneBroken() === true) {
  visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
  runChoice(3);
  runChoice(1);
  runChoice(4);
  runChoice(5);
  runChoice(4);
}
*/
cliExecute("pvp fame select");

print(
  "This loop took " +
    (gametimeToInt() - START_TIME) / 1000 +
    " seconds, for a 1 day, " +
    (myTurncount() - 1) +
    " turn HCCS run. Organ use was " +
    myFullness() +
    "/" +
    myInebriety() +
    "/" +
    mySpleenUse() +
    ". I drank " +
    (6 - availableAmount($item`astral pilsner`)) +
    " Astral Pilsners.",
  "green"
);

print("HP test: " + HP_TURNS, "green");
print("Muscle test: " + MUS_TURNS, "green");
print("Moxie test: " + MOX_TURNS, "green");
print("Myst test: " + MYS_TURNS, "green");
print("Hot Res test: " + HOT_RES_TURNS, "green");
print("Noncombat test: " + NONCOMBAT_TURNS, "green");
print("Fam Weight test: " + FAMILIAR_TURNS, "green");
print("Weapon Damage test: " + WEAPON_TURNS, "green");
print("Spell Damage Test: " + SPELL_TURNS, "green");
print("Item Drop test: " + ITEM_TURNS, "green");
