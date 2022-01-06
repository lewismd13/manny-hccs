import {
  ensureCreateItem,
  ensureEffect,
  ensureItem,
  ensureMpSausage,
  ensureMpTonic,
  ensureNpcEffect,
  ensureOde,
  ensurePotionEffect,
  ensureSewerItem,
  ensureSong,
  fax,
  horse,
  kill,
  mapMonster,
  multiFightAutoAttack,
  sausageFightGuaranteed,
  setChoice,
  setClan,
} from "./lib";
import {
  abort,
  adv1,
  autosell,
  availableAmount,
  buy,
  cliExecute,
  containsText,
  create,
  drink,
  eat,
  equip,
  floor,
  gametimeToInt,
  getProperty,
  handlingChoice,
  haveEffect,
  haveEquipped,
  haveSkill,
  hippyStoneBroken,
  itemAmount,
  lastChoice,
  maximize,
  mpCost,
  myAdventures,
  myBasestat,
  myBuffedstat,
  myClass,
  myFullness,
  myGardenType,
  myHp,
  myInebriety,
  myLevel,
  myMaxhp,
  myMaxmp,
  myMp,
  myPathId,
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
  toInt,
  totalFreeRests,
  use,
  useFamiliar,
  useSkill,
  visitUrl,
} from "kolmafia";
import {
  $class,
  $effect,
  $familiar,
  $item,
  $location,
  $monster,
  $phylum,
  $skill,
  $slot,
  $stat,
  adventureMacro,
  adventureMacroAuto,
  Clan,
  get,
  getModifier,
  have,
  Macro,
  Witchess,
} from "libram";
import {
  getEffect,
  getTonic,
  hybridize,
  isHybridized,
  makeTonic,
  tonicsLeft,
} from "libram/dist/resources/2014/DNALab";

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
const DONATE = 30;

let moxieStat = 0;
let itemdrop = 0;
let boozedrop = 0;

let HP_TURNS = 0;
let MUS_TURNS = 0;
let MYS_TURNS = 0;
let MOX_TURNS = 0;
let FAMILIAR_TURNS = 0;
let WEAPON_TURNS = 0;
let SPELL_TURNS = 0;
let NONCOMBAT_TURNS = 0;
let ITEM_TURNS = 0;
let HOT_RES_TURNS = 0;

let TEMP_TURNS = 0;

// test order will be stats, hot, item, NC, Fam, weapon, spell

const START_TIME = gametimeToInt();

const justKillTheThing = Macro.trySkill($skill`Curse of Weaksauce`)
  .trySkill($skill`Micrometeorite`)
  .tryItem($item`Time-Spinner`)
  .trySkill($skill`Sing Along`)
  .trySkill($skill`Stuffed Mortar Shell`)
  .skill($skill`Candyblast`)
  .step("repeat");
/*
const defaultFamiliar = $familiar`melodramedary`;
const defaultFamiliarEquipment = $item`dromedary drinking helmet`;
*/

function useDefaultFamiliar() {
  if (
    get("camelSpit") < 100 &&
    !get("csServicesPerformed").split(",").includes("Reduce Gazelle Population")
  ) {
    useFamiliar($familiar`Melodramedary`);
    equip($item`dromedary drinking helmet`);
  } else if (
    availableAmount($item`short stack of pancakes`) === 0 &&
    haveEffect($effect`Shortly Stacked`) === 0 &&
    !get("csServicesPerformed").split(",").includes("Breed More Collies")
  ) {
    useFamiliar($familiar`Shorter-Order Cook`);
  } else if (
    availableAmount($item`rope`) < 1 &&
    availableAmount($item`burning newspaper`) + availableAmount($item`burning paper crane`) < 1
  ) {
    useFamiliar($familiar`Garbage Fire`);
  } else {
    useFamiliar($familiar`Machine Elf`);
  }
}

function tryUse(quantity: number, it: Item) {
  if (availableAmount(it) > 0) {
    return use(quantity, it);
  } else {
    return false;
  }
}

function tryEquip(it: Item) {
  if (availableAmount(it) > 0) {
    return equip(it);
  } else {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function wishEffect(ef: Effect) {
  if (haveEffect(ef) === 0) {
    cliExecute(`genie effect ${ef.name}`);
  } else {
    print(`Already have effect ${ef.name}.`);
  }
}

function weaponTurns() {
  return (
    60 -
    floor(numericModifier("weapon damage") / 25 + 0.001) -
    floor(numericModifier("weapon damage percent") / 25 + 0.001)
  );
}

function spellTurns() {
  return (
    60 -
    floor(numericModifier("spell damage") / 50 + 0.001) -
    floor(numericModifier("spell damage percent") / 50 + 0.001)
  );
}

// Checks that you don't already have the tonic or effect and if your syringe has the right phylum and if so, makes the appropriate tonic.

function geneTonic(ph: Phylum) {
  if (tonicsLeft() < 1) throw "You can't make any more tonics";
  if (!have(getEffect(ph)) && !have(getTonic(ph))) {
    if (get("dnaSyringe") !== ph) throw "You have the wrong DNA in your syringe";
    makeTonic();
    if (!have(getTonic(ph))) {
      throw "something went wrong getting your gene tonic";
    } else {
      print(`successfully created ${getTonic(ph).name}`);
    }
  } else {
    print(`You already have ${ph} DNA`);
  }
}

function summonBrickoOyster(maxSummons: number) {
  if (get("_brickoFights") >= 3) return false;
  if (availableAmount($item`BRICKO oyster`) > 0) return true;
  while (
    get("libramSummons") < maxSummons &&
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
    equip($item`Kramco Sausage-o-Matic™`);
    equip($item`old sweatpants`);
    equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
    equip($slot`acc2`, $item`Powerful Glove`);
    equip($slot`acc3`, $item`Lil' Doctor™ bag`);

    useDefaultFamiliar();

    adventureMacroAuto($location`The Neverending Party`, kill());
    setAutoAttack(0);
  }
}

export function testDone(testNum: number) {
  print(`Checking test ${testNum}...`);
  const text = visitUrl("council.php");
  return !containsText(text, `<input type=hidden name=option value=${testNum}>`);
}

function doTest(testNum: number) {
  if (!testDone(testNum)) {
    visitUrl(`choice.php?whichchoice=1089&option=${testNum}`);
    if (!testDone(testNum)) {
      throw `Failed to do test ${testNum}. Maybe we are out of turns.`;
    }
  } else {
    print(`Test ${testNum} already completed.`);
  }
}

function nextLibramCost() {
  return mpCost($skill`Summon BRICKOs`);
}

// TODO: combat filter functions SHOULD make this unnecessary
export function withMacro<T>(macro: Macro, action: () => T) {
  macro.save();
  try {
    return action();
  } finally {
    Macro.clearSaved();
  }
}

if (myPathId() !== 25) abort();

// Don't buy stuff from NPC stores.
setProperty("_saved_autoSatisfyWithNPCs", getProperty("autoSatisfyWithNPCs"));
setProperty("autoSatisfyWithNPCs", "false");

setProperty("recoveryScript", "");

// Do buy stuff from coinmasters (hermit).
setProperty("_saved_autoSatisfyWithCoinmasters", getProperty("autoSatisfyWithCoinmasters"));
setProperty("autoSatisfyWithCoinmasters", "true");
// setProperty("logPreferenceChange", "true");

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
equip($slot`acc3`, $item`Lil' Doctor™ bag`);

if (!testDone(TEST_COIL_WIRE)) {
  setClan("Bonus Adventures from Hell");
  /*
  if (get("_clanFortuneConsultUses") < 3) {
    while (get("_clanFortuneConsultUses") < 3) {
      cliExecute("fortune cheesefax");
      cliExecute("wait 5");
    }
  }
*/
  if (myLevel() === 1 && mySpleenUse() === 0) {
    while (get("_universeCalculated") < get("skillLevel144")) {
      cliExecute("numberology 69");
    }
  }

  // retrieve_item(1, $item[fish hatchet]);

  // get cowboy boots
  visitUrl("place.php?whichplace=town_right&action=townright_ltt");

  // Vote.
  // TODO: make this also work for PM
  if (itemAmount($item`"I Voted!" sticker`) === 0) {
    visitUrl("place.php?whichplace=town_right&action=townright_vote");
    visitUrl("choice.php?option=1&whichchoice=1331&g=2&local%5B%5D=1&local%5B%5D=3");
    // Make sure initiative-tracking works.
    // visitUrl("place.php?whichplace=town_right&action=townright_vote");
  }

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
  if (haveEffect($effect`That's Just Cloud-Talk, Man`) === 0) {
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

if (myTurncount() < 60) throw "Something went wrong coiling wire.";

if (!testDone(TEST_MOX)) {
  // just in case?
  if (haveEffect($effect`That's Just Cloud-Talk, Man`) === 0) {
    visitUrl("place.php?whichplace=campaway&action=campaway_sky");
  }

  // Grab fish hatchett here, for fam wt, -combat, and muscle tests
  // TODO: see if you can cut this
  retrieveItem(1, $item`fish hatchet`);

  // pulls wrench from deck
  if (get("_deckCardsDrawn") === 0) {
    cliExecute("cheat wrench");
  }

  // uses familiar jacks to get camel equipment
  if (availableAmount($item`dromedary drinking helmet`) === 0 && get("tomeSummons") < 3) {
    cliExecute("create 1 box of familiar jacks");
    useFamiliar($familiar`Melodramedary`);
    use(1, $item`box of Familiar Jacks`);
    equip($item`dromedary drinking helmet`);
  }

  cliExecute("call detective solver");
  buy(1, $item`shoe gum`);

  // learn extract and digitize
  cliExecute("terminal educate extract");
  cliExecute("terminal educate digitize");

  // bring along dark horse for the meats
  horse("dark");

  // Boxing Daycare
  ensureEffect($effect`Uncucumbered`);

  // Cast inscrutable gaze
  ensureEffect($effect`Inscrutable Gaze`);

  // Shower lukewarm
  ensureEffect($effect`Thaumodynamic`);

  // Beach Comb
  ensureEffect($effect`You Learned Something Maybe!`);

  // Get beach access.
  if (availableAmount($item`bitchin' meatcar`) === 0) {
    ensureItem(1, $item`cog`);
    ensureItem(1, $item`sprocket`);
    ensureItem(1, $item`spring`);
    ensureItem(1, $item`empty meat tank`);
    ensureItem(1, $item`sweet rims`);
    ensureItem(1, $item`tires`);
    create(1, $item`bitchin' meatcar`);
  }

  // scrapbook for +exp
  equip($item`familiar scrapbook`);

  // Depends on Ez's Bastille script.
  cliExecute("bastille myst brutalist");

  // Tune moon sign to Blender. Have to do this now to get chewing gum.
  if (!get("moonTuned")) {
    if (get("_campAwaySmileBuffs") === 0) {
      visitUrl("place.php?whichplace=campaway&action=campaway_sky");
    }

    // Unequip spoon.
    equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
    equip($slot`acc2`, $item`Powerful Glove`);
    equip($slot`acc3`, $item`Lil' Doctor™ bag`);

    // Actually tune the moon.
    visitUrl("inv_use.php?whichitem=10254&doit=96&whichsign=8");
  }

  cliExecute("retrocape mysticality thrill");

  // cross streams for a stat boost
  if (!get("_streamsCrossed")) {
    cliExecute("crossstreams");
  }

  equip($item`Iunion Crown`);
  equip($slot`shirt`, $item`none`);
  equip($item`unwrapped knock-off retro superhero cape`); //retrocape
  equip($item`Fourth of May Cosplay Saber`);
  // equip($item[Kramco Sausage-o-Matic&trade;]);
  equip($item`old sweatpants`);
  equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
  equip($slot`acc2`, $item`Powerful Glove`);
  equip($slot`acc3`, $item`Lil' Doctor™ bag`);

  if (
    get("_brickoFights") === 0 &&
    summonBrickoOyster(7) &&
    availableAmount($item`BRICKO oyster`) > 0
  ) {
    if (availableAmount($item`bag of many confections`) > 0) throw "We should not have a bag yet.";
    useFamiliar($familiar`Stocking Mimic`);
    equip($slot`familiar`, $item`none`);
    if (myHp() < 0.8 * myMaxhp()) {
      visitUrl("clan_viplounge.php?where=hottub");
    }
    ensureMpTonic(32);
    Macro.trySkill($skill`Otoscope`)
      .trySkill($skill`Curse of Weaksauce`)
      .trySkillRepeat($skill`Saucegeyser`)
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

  if (get("_candySummons") === 0) {
    useSkill(1, $skill`Summon Crimbo Candy`);
  }
  if (get("_chubbyAndPlumpUsed") === false) {
    useSkill(1, $skill`Chubby and Plump`);
  }

  // Depending on crimbo candy summons, gets synth learning, possibly getting bugged beanie if it needs a tome summon
  if (
    availableAmount($item`Crimbo candied pecan`) > 1 &&
    availableAmount($item`Crimbo peppermint bark`) === 0 &&
    haveEffect($effect`Synthesis: Learning`) === 0
  ) {
    useSkill(1, $skill`Summon Sugar Sheets`);
    cliExecute("create 1 sugar shotgun");
    sweetSynthesis($item`sugar shotgun`, $item`Crimbo candied pecan`);
    useFamiliar($familiar`Baby Bugged Bugbear`);
    visitUrl("arena.php");
    useDefaultFamiliar();
  } else if (
    availableAmount($item`Crimbo fudge`) >= 2 &&
    haveEffect($effect`Synthesis: Learning`) === 0
  ) {
    sweetSynthesis($item`Crimbo fudge`, $item`Crimbo fudge`);
  } else if (
    availableAmount($item`Crimbo peppermint bark`) !== 0 &&
    haveEffect($effect`Synthesis: Learning`) === 0
  ) {
    sweetSynthesis($item`Crimbo peppermint bark`, $item`peppermint sprout`);
  }

  // synthesis: smart
  if (haveEffect($effect`Synthesis: Smart`) === 0) {
    sweetSynthesis($item`bag of many confections`, $item`Chubby and Plump bar`);
  }
  // This is the sequence of synthesis effects; synthesis_plan will, if possible, come up with a plan for allocating candy to each of these.
  // SynthesisPlanner.synthesize($effect`Synthesis: Learning`);
  // SynthesisPlanner.synthesize($effect`Synthesis: Smart`);

  if (round(numericModifier("mysticality experience percent")) < 100) {
    throw "Insufficient +stat%.";
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
  ensureEffect($effect`Big`);
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
    if (
      availableAmount($item`Gene Tonic: Construct`) === 0 &&
      get("dnaSyringe") !== $phylum`construct`
    ) {
      adventureMacroAuto(
        $location`The X-32-F Combat Training Snowman`,
        Macro.item($item`DNA extraction syringe`).trySkillRepeat($skill`Saucestorm`)
      );
      geneTonic($phylum`construct`);
    }
    while (get("_snojoFreeFights") < 10) {
      useDefaultFamiliar();
      adventureMacroAuto($location`The X-32-F Combat Training Snowman`, kill());
    }
  }

  // Don't use Kramco here.
  equip($slot`off-hand`, $item`none`);

  if (haveEffect($effect`Holiday Yoked`) === 0 && get("_kgbTranquilizerDartUses") < 3) {
    equip($slot`acc1`, $item`Kremlin's Greatest Briefcase`);
    useFamiliar($familiar`Ghost of Crimbo Carols`);
    adventureMacroAuto($location`Noob Cave`, Macro.trySkill($skill`KGB tranquilizer dart`));
    setAutoAttack(0);
  }

  // Chateau rest
  while (get("timesRested") < totalFreeRests()) {
    visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
  }

  while (summonBrickoOyster(11) && availableAmount($item`BRICKO oyster`) > 0) {
    useDefaultFamiliar();
    if (myHp() < 0.8 * myMaxhp()) {
      visitUrl("clan_viplounge.php?where=hottub");
    }
    ensureMpTonic(32);
    Macro.trySkill($skill`Otoscope`)
      .trySkill($skill`Curse of Weaksauce`)
      .trySkillRepeat($skill`Saucegeyser`)
      .setAutoAttack();
    use(1, $item`BRICKO oyster`);
    autosell(1, $item`BRICKO pearl`);
    setAutoAttack(0);
  }

  ensureEffect($effect`Song of Bravado`);

  if (get("boomBoxSong") !== "Total Eclipse of Your Meat") {
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
    withMacro(Macro.skill($skill`Use the Force`), runCombat);
    if (handlingChoice()) runChoice(3);
    // setProperty("mappingMonsters", "false");
  }

  // become a human fish hybrid
  if (!isHybridized($phylum`fish`) && get("dnaSyringe") !== $phylum`fish`) {
    // tryEquip($item`powerful glove`);
    // useFamiliar($familiar`frumious bandersnatch`);
    print($location`The Bubblin' Caldera`.noncombatQueue);
    adv1($location`The Bubblin' Caldera`, -1, "");
    adv1($location`The Bubblin' Caldera`, -1, "");
    print($location`The Bubblin' Caldera`.noncombatQueue);
    if (
      containsText(
        $location`The Bubblin' Caldera`.noncombatQueue,
        "Caldera Air; Aaaaah!  Aaaaaaaah!"
      )
    ) {
      adventureMacroAuto(
        $location`The Bubblin' Caldera`,
        Macro.while_(
          "!monstername lava lamprey",
          Macro.trySkill($skill`Extract`).trySkill($skill`Macrometeorite`)
        ).if_(
          "monstername lava lamprey",
          Macro.trySkill($skill`Extract`)
            .item($item`DNA extraction syringe`)
            .skill($skill`Feel Hatred`)
        )
      );
      useDefaultFamiliar();
      cliExecute("hottub"); // removing lava effect
      setAutoAttack(0);
    } else throw "Something went wrong getting fish DNA.";
    if (!hybridize()) throw "Failed to hybridize fish";
  }

  if (!get("hasRange")) {
    ensureItem(1, $item`Dramatic™ range`);
    use(1, $item`Dramatic™ range`);
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
  equip($slot`acc3`, $item`Lil' Doctor™ bag`);

  cliExecute("mood hccs");

  // LOV tunnel for elixirs, epaulettes, and heart surgery
  if (!get("_loveTunnelUsed")) {
    useDefaultFamiliar();
    ensureEffect($effect`Carol of the Bulls`);
    ensureEffect($effect`Carol of the Hells`);
    setChoice(1222, 1); // Entrance
    setChoice(1223, 1); // Fight LOV Enforcer
    setChoice(1224, 2); // LOV Epaulettes
    setChoice(1225, 1); // Fight LOV Engineer
    setChoice(1226, 2); // Open Heart Surgery
    setChoice(1227, 1); // Fight LOV Equivocator
    setChoice(1228, 1); // Take enamorang
    Macro.if_('monstername "LOV enforcer"', Macro.attack().repeat())
      .if_('monstername "lov engineer"', Macro.skill($skill`Saucegeyser`).repeat())
      .step(justKillTheThing)
      .setAutoAttack();
    // setAutoAttack("HCCS_LOV_tunnel");
    adv1($location`The Tunnel of L.O.V.E.`, -1, "");
    setAutoAttack(0);
  }

  equip($item`LOV Epaulettes`);

  // spend 5 turns in DMT, skipping joy and cert, just get stats
  while (get("_machineTunnelsAdv") < 5) {
    useFamiliar($familiar`Machine Elf`);
    adventureMacroAuto($location`The Deep Machine Tunnels`, kill());
    /* if ((availableAmount($item`abstraction: thought`) === 0) && (availableAmount($item`abstraction: certainty`) === 0) && (get("_machineTunnelsAdv") < 5)) {
      setAutoAttack("melfgetthought");
      adv1($location`the deep machine tunnels`, -1, "");
      setAutoAttack(0);
    } else if ((availableAmount($item`abstraction: thought`) >= 1) && (availableAmount($item`abstraction: certainty`) === 0) && (get("_machineTunnelsAdv") < 5)) {
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
    equip($item`Fourth of May Cosplay Saber`);
    useDefaultFamiliar();
    while (get("_witchessFights") === 0) {
      Macro.step(justKillTheThing).setAutoAttack();
      Witchess.fightPiece($monster`Witchess Bishop`);
      setAutoAttack(0);
    }
    while (get("_witchessFights") === 1) {
      useDefaultFamiliar();
      Macro.attack().repeat().setAutoAttack();
      ensureEffect($effect`Carol of the Bulls`);
      Witchess.fightPiece($monster`Witchess King`);
      setAutoAttack(0);
    }
    while (get("_witchessFights") === 2) {
      useDefaultFamiliar();
      Macro.attack().repeat().setAutoAttack();
      ensureEffect($effect`Carol of the Bulls`);
      Witchess.fightPiece($monster`Witchess Witch`);
      setAutoAttack(0);
    }
    while (get("_witchessFights") === 3) {
      useDefaultFamiliar();
      Macro.step(justKillTheThing).setAutoAttack();
      Witchess.fightPiece($monster`Witchess Bishop`);
      setAutoAttack(0);
    }
  }
  /*
  // backing up bishops - leaving a few backups for garbo
  useDefaultFamiliar();
  equip($slot`acc2`, $item`backup camera`);
  equip($slot`shirt`, $item`none`);
  while (get("lastCopyableMonster") === $monster`Witchess Bishop` && get("_backUpUses") < 5) {
    useDefaultFamiliar();
    adventureMacroAuto(
      $location`Noob Cave`,
      Macro.trySkill($skill`Back-Up to your Last Enemy`).step(justKillTheThing)
    );
  }
  setAutoAttack(0);
*/
  equip($item`makeshift garbage shirt`);

  // get witchess buff, this should fall all the way through to fam wt
  if (haveEffect($effect`Puzzle Champ`) === 0) {
    cliExecute("witchess");
  }

  // Checking if it's gerald(ine) and accepting the quest if it is, otherwise just here to party.
  if (get("_questPartyFair") === "unstarted") {
    setProperty("choiceAventure1322", "");
    visitUrl("adventure.php?snarfblat=528");
    if (get("_questPartyFairQuest") === "food") {
      runChoice(1);
      setChoice(1324, 2);
      setChoice(1326, 3);
    } else if (get("_questPartyFairQuest") === "booze") {
      runChoice(1);
      setChoice(1324, 3);
      setChoice(1327, 3);
    } else {
      runChoice(2);
      setChoice(1324, 5);
    }
  }

  // Professor 10x free sausage fight @ NEP
  // TODO: Maybe switch this to bishops
  // TODO: make this work - either stop after 5 or skip altogether

  if (get("_sausageFights") === 0) {
    useFamiliar($familiar`Pocket Professor`);
    tryEquip($item`Pocket Professor memory chip`);
    equip($item`Kramco Sausage-o-Matic™`);
    equip($slot`acc2`, $item`Brutal brogues`);
    equip($slot`acc3`, $item`Beach Comb`);
    while (get("_sausageFights") === 0) {
      if (myHp() < 0.8 * myMaxhp()) {
        visitUrl("clan_viplounge.php?where=hottub");
      }

      // setChoice(1322, 2);
      adventureMacroAuto(
        $location`The Neverending Party`,
        Macro.if_('!monstername "sausage goblin"', new Macro().step("abort"))
          .trySkill(Skill.get("Lecture on Relativity"))
          .step(justKillTheThing)
      );
      setAutoAttack(0);
    }
  }

  // Breakfast

  // Visiting Looking Glass in clan VIP lounge
  visitUrl("clan_viplounge.php?action=lookingglass&whichfloor=2");
  cliExecute("swim item");
  while (get("_genieWishesUsed") < 3) {
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
  useSkill(1, $skill`Summon Kokomo Resort Pass`);
  autosell(1, $item`Kokomo Resort Pass`);
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

  if (haveEffect($effect`Carlweather's Cantata of Confrontation`) > 0) {
    cliExecute("shrug Carlweather's Cantata of Confrontation");
  }

  cliExecute("mood hccs");
  equip($item`makeshift garbage shirt`);
  useFamiliar($familiar`God Lobster`);
  while (get("_godLobsterFights") < 2) {
    print("Find me debug message hi");
    setChoice(1310, 1);
    tryEquip($item`God Lobster's Scepter`);
    visitUrl("main.php?fightgodlobster=1");
    runCombat(Macro.trySkillRepeat($skill`Saucegeyser`).toString());
    multiFightAutoAttack();
    runChoice(-1);
    setAutoAttack(0);
  }

  // fight a witchess queen for pointy crown, getting a couple weapon damage effects just in case
  if (get("_witchessFights") === 4) {
    useDefaultFamiliar();
    Macro.attack().repeat().setAutoAttack();
    ensureEffect($effect`Carol of the Bulls`);
    ensureEffect($effect`Song of the North`);
    Witchess.fightPiece($monster`Witchess Queen`);
    setAutoAttack(0);
  }

  useDefaultFamiliar();

  equip($slot`acc3`, $item`Lil' Doctor™ bag`);

  ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);
  ensureSong($effect`The Magical Mojomuscular Melody`);
  ensureSong($effect`Polka of Plenty`);
  ensureEffect($effect`Inscrutable Gaze`);
  ensureEffect($effect`Pride of the Puffin`);
  ensureEffect($effect`Drescher's Annoying Noise`);
  ensureSong($effect`Ur-Kel's Aria of Annoyance`);
  ensureEffect($effect`Feeling Excited`);

  if (!have($item`makeshift garbage shirt`)) {
    cliExecute("fold makeshift garbage shirt");
  }

  if (!haveEquipped($item`makeshift garbage shirt`)) equip($item`makeshift garbage shirt`);

  // 14 free NEP fights, using mob hit and xray
  while (
    get("_neverendingPartyFreeTurns") < 10 ||
    (haveSkill($skill`Chest X-Ray`) && get("_chestXRayUsed") < 3) ||
    (haveSkill($skill`Gingerbread Mob Hit`) && !get("_gingerbreadMobHitUsed"))
  ) {
    // Get inner elf for leveling and moxie test
    // TODO: make this try again if she's busy
    // TODO: make this a function and move into lib
    if (haveEffect($effect`Inner Elf`) === 0 && get("_snokebombUsed") < 3 && myLevel() > 12) {
      print(`${myLevel()}is my level at the moment, trying to get inner elf`, "red");
      Clan.join("Beldungeon");
      ensureEffect($effect`Blood Bubble`);
      useFamiliar($familiar`Machine Elf`);
      setChoice(326, 1);
      adventureMacro($location`The Slime Tube`, Macro.skill($skill`Snokebomb`));
      useDefaultFamiliar();
      Clan.join("Alliance from Hell");
    }

    // Otherwise fight.
    setChoice(1324, 5);
    ensureMpSausage(100);
    if (get("_neverendingPartyFreeTurns") < 10 && get("_feelPrideUsed") < 3) {
      useDefaultFamiliar();
      adventureMacroAuto(
        $location`The Neverending Party`,
        Macro.trySkill($skill`Feel Pride`).step(justKillTheThing)
      );
    } else if (get("_neverendingPartyFreeTurns") < 10) {
      useDefaultFamiliar();
      adventureMacroAuto($location`The Neverending Party`, Macro.step(justKillTheThing));
    } else {
      useDefaultFamiliar();
      adventureMacroAuto(
        $location`The Neverending Party`,
        Macro.trySkill($skill`Chest X-Ray`).trySkill($skill`Gingerbread Mob Hit`)
      );
    }
  }

  if (myClass() === $class`Pastamancer`) useSkill(1, $skill`Bind Undead Elbow Macaroni`);
  else ensurePotionEffect($effect`Expert Oiliness`, $item`oil of expertise`);

  if (myClass() === $class`Pastamancer`) useSkill(1, $skill`Bind Penne Dreadful`);
  else ensurePotionEffect($effect`Expert Oiliness`, $item`oil of expertise`);

  // Beach Comb
  ensureEffect($effect`Pomp & Circumsands`);

  use(1, $item`Bird-a-Day calendar`);
  ensureEffect($effect`Blessing of the Bird`);

  // Should be 11% NC and 50% moxie, will fall through to NC test
  // ensureEffect($effect`Blessing of your favorite Bird`);

  ensureEffect($effect`Big`);
  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave's Shanty of Superiority`);
  ensureSong($effect`The Moxious Madrigal`);
  ensureEffect($effect`Quiet Desperation`);
  ensureEffect($effect`Disco Fever`);
  // ensure_effect($effect[Tomato Power]);
  ensureNpcEffect($effect`Butt-Rock Hair`, 5, $item`hair spray`);
  use(availableAmount($item`rhinestone`), $item`rhinestone`);
  if (haveEffect($effect`Unrunnable Face`) === 0) {
    tryUse(1, $item`runproof mascara`);
  }
  ensureEffect($effect`Blubbered Up`);
  ensureEffect($effect`Penne Fedora`);
  ensureEffect($effect`Mariachi Mood`);
  ensureEffect($effect`Disco State of Mind`);

  maximize("moxie", false);
  if (
    myClass() === $class`Pastamancer` &&
    myBuffedstat($stat`moxie`) - myBasestat($stat`mysticality`) < 1770
  ) {
    throw "Not enough moxie to cap.";
  } else if (myBuffedstat($stat`moxie`) - myBasestat($stat`moxie`) < 1770) {
    throw "Not enough moxie to cap.";
  }

  moxieStat = 60 - Math.floor((myBuffedstat($stat`moxie`) - myBasestat($stat`moxie`)) / 30);

  TEMP_TURNS = myTurncount();
  doTest(TEST_MOX);
  MOX_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsMoxTurns", MOX_TURNS.toString());
}

if (!testDone(TEST_HP)) {
  ensureEffect($effect`Song of Starch`);
  ensureEffect($effect`Big`);
  ensureSong($effect`Power Ballad of the Arrowsmith`);
  ensureEffect($effect`Rage of the Reindeer`);
  ensureEffect($effect`Quiet Determination`);
  ensureEffect($effect`Disdain of the War Snapper`);
  ensureNpcEffect($effect`Go Get 'Em, Tiger!`, 5, $item`Ben-Gal™ Balm`);

  useFamiliar($familiar`Disembodied Hand`);

  maximize("hp", false);

  // QUEST - Donate Blood (HP)
  if (myMaxhp() - myBuffedstat($stat`muscle`) - 3 < 1770) {
    throw "Not enough HP to cap.";
  }
  TEMP_TURNS = myTurncount();
  doTest(TEST_HP);
  HP_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsHpTurns", HP_TURNS.toString());
}

if (!testDone(TEST_MUS)) {
  if (myClass() === $class`Pastamancer`) useSkill(1, $skill`Bind Undead Elbow Macaroni`);
  else ensurePotionEffect($effect`Expert Oiliness`, $item`oil of expertise`);

  if (myInebriety() === 0) {
    ensureOde(4);
    tryUse(1, $item`astral six-pack`);
    drink(4, $item`astral pilsner`);
  }

  ensureEffect($effect`Big`);
  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave's Shanty of Superiority`);
  ensureSong($effect`Power Ballad of the Arrowsmith`);
  ensureEffect($effect`Rage of the Reindeer`);
  ensureEffect($effect`Quiet Determination`);
  ensureEffect($effect`Disdain of the War Snapper`);
  ensureNpcEffect($effect`Go Get 'Em, Tiger!`, 5, $item`Ben-Gal™ Balm`);
  create(1, $item`philter of phorce`);
  ensureEffect($effect`Phorcefullness`);
  maximize("muscle", false);

  if (
    myClass() === $class`Pastamancer` &&
    myBuffedstat($stat`muscle`) - myBasestat($stat`mysticality`) < 1770
  ) {
    throw "Not enough muscle to cap.";
  } else if (myBuffedstat($stat`muscle`) - myBasestat($stat`muscle`) < 1770) {
    throw "Not enough muscle to cap.";
  }

  TEMP_TURNS = myTurncount();
  doTest(TEST_MUS);
  MUS_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsMusTurns", MUS_TURNS.toString());
}

if (!testDone(TEST_MYS)) {
  ensureEffect($effect`Big`);
  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave's Shanty of Superiority`);
  ensureSong($effect`The Magical Mojomuscular Melody`);
  ensureEffect($effect`Quiet Judgement`);
  // ensure_effect($effect[Tomato Power]);
  ensureEffect($effect`Mystically Oiled`);
  ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);

  maximize("mysticality", false);

  if (myBuffedstat($stat`mysticality`) - myBasestat($stat`mysticality`) < 1770) {
    throw "Not enough mysticality to cap.";
  }
  TEMP_TURNS = myTurncount();
  doTest(TEST_MYS);
  MYS_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsMysTurns", MYS_TURNS.toString());
}

if (!testDone(TEST_HOT_RES)) {
  ensureMpSausage(500);
  useDefaultFamiliar();
  fightSausageIfGuaranteed();

  // Make sure no moon spoon.
  equip($slot`acc1`, $item`Eight Days a Week Pill Keeper`);
  equip($slot`acc2`, $item`Powerful Glove`);
  equip($slot`acc3`, $item`Lil' Doctor™ bag`);

  // Sabering an NEP mob to get cloud of mist and foam yourself

  if (get("_saberForceUses") < 5 && !have($effect`Fireproof Foam Suit`)) {
    equip($item`Fourth of May Cosplay Saber`, $slot`weapon`);
    equip($item`industrial fire extinguisher`, $slot`offhand`);
    equip($item`vampyric cloake`);
    setProperty("choiceAdventure1387", "3");
    adventureMacroAuto(
      $location`The Neverending Party`,
      Macro.skill($skill`Become a Cloud of Mist`)
        .skill($skill`Fire Extinguisher: Foam Yourself`)
        .skill($skill`Use the Force`)
    );
    while (lastChoice() === 1387 && handlingChoice()) {
      runChoice(3);
    }
  }
  /*
  if (availableAmount($item`heat-resistant gloves`) === 0) {
    adv1($location`LavaCo™ Lamp Factory`, -1, "");
    if (
      !containsText($location`LavaCo™ Lamp Factory`.noncombatQueue, "LavaCo&trade; Welcomes You")
    ) {
      throw "Something went wrong at LavaCo.";
    }
    equip($item`Fourth of May Cosplay Saber`);
    equip($item`industrial fire extinguisher`, $slot`offhand`);
    equip($item`vampyric cloake`);
    setProperty("choiceAdventure1387", "3");
    mapMonster($location`LavaCo™ Lamp Factory`, $monster`factory worker (female)`);
    withMacro(
      Macro.skill($skill`Become a Cloud of Mist`)
        // .skill($skill`Meteor Shower`)
        .skill($skill`Fire Extinguisher: Foam Yourself`)
        .skill($skill`Use the Force`),
      runCombat
    );
    while (lastChoice() === 1387 && handlingChoice()) {
      runChoice(3);
    }
    setProperty("mappingMonsters", "false");
  }
*/
  // synth hot
  /*
  if (haveEffect($effect`Synthesis: Hot`) === 0) {
    cliExecute("synthesize hot");
    while (haveEffect($effect`Synthesis: Hot`) === 0) {
      useSkill($skill`Summon Candy Heart`);
      cliExecute("synthesize hot");
    }
  }

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
  // cliExecute("briefcase e hot");

  // set retrocape to elemental resistance
  cliExecute("retrocape mus hold");

  ensureEffect($effect`Blood Bond`);
  ensureEffect($effect`Leash of Linguini`);
  ensureEffect($effect`Empathy`);
  ensureEffect($effect`Feeling Peaceful`);

  // Pool buff. This will fall through to fam weight.
  ensureEffect($effect`Billiards Belligerence`);
  /*
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
*/
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
  //ensureEffect($effect`Hot-Headed`);

  // Use pocket maze
  // if (availableAmount($item`pocket maze`) > 0) ensureEffect($effect`Amazing`);

  useFamiliar($familiar`Exotic Parrot`);
  if (availableAmount($item`cracker`) === 0 && get("tomeSummons") < 3) {
    retrieveItem(1, $item`box of Familiar Jacks`);
    use(1, $item`box of Familiar Jacks`);
    equip($item`cracker`);
  }

  // Mafia sometimes can't figure out that multiple +weight things would get us to next tier.
  maximize("hot res, 0.01 familiar weight", false);

  if (round(numericModifier("hot resistance")) < 58) {
    throw "Something went wrong building hot res.";
  }

  // logprint(cliExecuteOutput("modtrace hot resistance"));

  TEMP_TURNS = myTurncount();
  doTest(TEST_HOT_RES);
  HOT_RES_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsHotResTurns", HOT_RES_TURNS.toString());
}

if (!testDone(TEST_NONCOMBAT)) {
  if (myHp() < 30) useSkill(1, $skill`Cannelloni Cocoon`);
  ensureEffect($effect`Blood Bond`);
  ensureEffect($effect`Leash of Linguini`);
  ensureEffect($effect`Empathy`);
  horse("dark");

  if (get("_godLobsterFights") < 3) {
    if (myHp() < 0.8 * myMaxhp()) useSkill(1, $skill`Cannelloni Cocoon`);
    useFamiliar($familiar`God Lobster`);
    // Get -combat buff.
    setProperty("choiceAdventure1310", "2");
    equip($item`God Lobster's Ring`);
    visitUrl("main.php?fightgodlobster=1");
    withMacro(Macro.skill($skill`Saucegeyser`), runCombat);
    visitUrl("choice.php");
    if (handlingChoice()) runChoice(2);
    setAutoAttack(0);
  }

  // setting KGB to NC, relies on Ezandora's script
  cliExecute("briefcase e -combat");

  // Pool buff. Should fall through to weapon damage.
  ensureEffect($effect`Billiards Belligerence`);

  equip($slot`acc3`, $item`Powerful Glove`);

  ensureEffect($effect`Gummed Shoes`);
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
  if (myClass() === $class`Pastamancer`) {
    ensureEffect($effect`Blessing of the Bird`);
  }

  maximize("-combat, 0.01 familiar weight", false);

  if (round(numericModifier("combat rate")) > -40) {
    throw "Not enough -combat to cap.";
  }

  TEMP_TURNS = myTurncount();
  doTest(TEST_NONCOMBAT);
  NONCOMBAT_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsNoncombatTurns", NONCOMBAT_TURNS.toString());
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
  ensureEffect($effect`Robot Friends`);
  ensureEffect($effect`Human-Machine Hybrid`);
  if (have($item`short stack of pancakes`)) ensureEffect($effect`Shortly Stacked`);
  /*
  if (availableAmount($item`cracker`) > 0 && get("tomeSummons") < 3) {
    useFamiliar($familiar`Exotic Parrot`);
    equip($item`cracker`);
  }
*/

  // this is going to be all the gingerbread stuff, it is a work in progress
  if (
    haveEffect($effect`Whole Latte Love`) === 0 &&
    availableAmount($item`gingerbread spice latte`) === 0
  ) {
    useFamiliar($familiar`Chocolate Lab`);
    maximize("sprinkle drop", false);
    if (!get("_gingerbreadClockAdvanced")) {
      visitUrl("adventure.php?snarfblat=477");
      runChoice(1);
    }
    if (availableAmount($item`sprinkles`) < 50) {
      adventureMacroAuto(
        $location`Gingerbread Upscale Retail District`,
        Macro.if_("monstername gingerbread gentrifier", Macro.skill($skill`Macrometeorite`)).skill(
          $skill`Shattering Punch`
        )
      );
      setAutoAttack(0);
    }
    if (availableAmount($item`sprinkles`) >= 50) {
      // equip($slot`acc3`, $item`kremlin's greatest briefcase`);
      useFamiliar($familiar`Frumious Bandersnatch`);
      ensureEffect($effect`Ode to Booze`);
      setChoice(1208, 3);
      while (
        availableAmount($item`gingerbread spice latte`) === 0 &&
        haveEffect($effect`Whole Latte Love`) === 0
      ) {
        adventureMacro($location`Gingerbread Upscale Retail District`, Macro.runaway());
      }
    } else {
      throw "Something went wrong getting sprinkles";
    }
    use($item`gingerbread spice latte`);
    useDefaultFamiliar();
  }

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

  // checking here to see if we had a tome summon for a cracker or if we should use BBB
  if (availableAmount($item`cracker`) > 0) {
    useFamiliar($familiar`Exotic Parrot`);
  } else if (availableAmount($item`bugged beanie`) === 1) {
    useFamiliar($familiar`Baby Bugged Bugbear`);
  }

  while (myMp() / myMaxmp() > 0.3 && nextLibramCost() <= myMp()) {
    useSkill($skill`Summon Candy Heart`);
  }

  if (availableAmount($item`green candy heart`) > 0) {
    ensureEffect($effect`Heart of Green`);
  }

  maximize("familiar weight", false);

  TEMP_TURNS = myTurncount();
  doTest(TEST_FAMILIAR);
  FAMILIAR_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsFamiliarTurns", FAMILIAR_TURNS.toString());
}

if (!testDone(TEST_WEAPON)) {
  fightSausageIfGuaranteed();

  // Get inner elf for weapon damage
  if (haveEffect($effect`Inner Elf`) === 0 && get("_snokebombUsed") < 3) {
    Clan.join("Beldungeon");
    ensureEffect($effect`Blood Bubble`);
    useFamiliar($familiar`Machine Elf`);
    setProperty("choiceAdventure326", "1");
    adventureMacro($location`The Slime Tube`, Macro.skill($skill`Snokebomb`));
    useDefaultFamiliar();
    Clan.join("Alliance from Hell");
  } else {
    print("Something went wrong with getting inner elf");
  }

  // Deck pull elf for DNA and ghost buff (reflex hammer)
  if (!have($effect`Do You Crush What I Crush?`) || get("dnaSyringe") !== $phylum`elf`) {
    if (get("_deckCardsDrawn") === 5) {
      useFamiliar($familiar`Ghost of Crimbo Carols`);
      equip($slot`acc3`, $item`Lil' Doctor™ bag`);
      if (get("_reflexHammerUsed") > 2) {
        throw "You do not have any banishes left";
      }
      Macro.item($item`DNA extraction syringe`)
        .skill($skill`Reflex Hammer`)
        .setAutoAttack();
      cliExecute("cheat phylum elf");
      runCombat();
      useDefaultFamiliar();
    } else {
      throw "You are out of deck pulls.";
    }
  }
  /*
  if (!get("_chateauMonsterFought")) {
    // const chateauText = visitUrl("place.php?whichplace=chateau", false);
    // const match = chateauText.match(/alt="Painting of an? ([^(]*) .1."/);
    // if (get("camelSpit") === 100) useFamiliar($familiar`Melodramedary`);
    useFamiliar($familiar`Ghost of Crimbo Carols`);
    equip($slot`acc3`, $item`Lil' Doctor™ bag`);
    if (get("_reflexHammerUsed") > 2) {
      throw "You do not have any banishes left";
    }
    Macro.item($item`DNA extraction syringe`)
      .skill($skill`Reflex Hammer`)
      .setAutoAttack();
    visitUrl("place.php?whichplace=chateau&action=chateau_painting", false);
    runCombat();
    useDefaultFamiliar();
  } else {
    throw "You already fought your painting";
  }
*/

  geneTonic($phylum`elf`);
  ensureEffect($effect`Human-Elf Hybrid`);

  // fax an ungulith to get corrupted marrow, meteor showered, and spit upon (if applicable)
  if (availableAmount($item`corrupted marrow`) === 0 && haveEffect($effect`Cowrruption`) === 0) {
    if (!get("_photocopyUsed")) {
      useFamiliar($familiar`Melodramedary`);
      equip($item`Fourth of May Cosplay Saber`, $slot`weapon`);
      setChoice(1387, 3);
      Macro.skill($skill`Meteor Shower`)
        .skill($skill`%fn\, spit on me!`)
        .skill($skill`Use the Force`)
        .setAutoAttack();
      try {
        Clan.join("Beldungeon");
        fax($monster`ungulith`);
      } finally {
        Clan.join("Alliance from Hell");
      }
      use($item`photocopied monster`);
      if (handlingChoice()) runChoice(3);
      setProperty("camelSpit", "0");
      useDefaultFamiliar();
    } else {
      throw "You used your photocopy and don't have corrupted marrow, so that's bad.";
    }
  }
  /*
  if (availableAmount($item`corrupted marrow`) === 0 && haveEffect($effect`Cowrruption`) === 0) {
    print(`Your camel spit level is ${get("camelSpit")}`, "green");
    if (availableAmount($item`photocopied monster`) === 0) {
      if (get("_photocopyUsed")) throw "Already used fax for the day.";
      cliExecute("/whitelist alliance from hell");
      chatPrivate("cheesefax", "ungulith");
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
    if (get("camelSpit") === 100) {
      useFamiliar($familiar`Melodramedary`);
      Macro.skill($skill`Meteor Shower`)
        .skill($skill`%fn\, spit on me!`)
        .skill($skill`Use the Force`)
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
  ensureSong($effect`Jackasses' Symphony of Destruction`);
  if (availableAmount($item`LOV Elixir #3`) > 0) {
    ensureEffect($effect`The Power of LOV`);
  }

  if (availableAmount($item`vial of hamethyst juice`) > 0) {
    ensureEffect($effect`Ham-Fisted`);
  }

  // make KGB set to weapon
  cliExecute("briefcase e weapon");

  // Beach Comb
  if (!containsText(get("_beachHeadsUsed"), "6")) {
    ensureEffect($effect`Lack of Body-Building`);
  }

  // Pool buff. Should have fallen through.
  ensureEffect($effect`Billiards Belligerence`);

  // Corrupted marrow
  ensureEffect($effect`Cowrruption`);

  // Pastamancer d1 is weapon damage.

  ensureEffect($effect`Blessing of your favorite Bird`);
  // ensureEffect($effect`Blessing of the Bird`);

  ensureNpcEffect($effect`Engorged Weapon`, 1, $item`Meleegra™ pills`);

  ensureEffect($effect`Bow-Legged Swagger`);

  useFamiliar($familiar`Disembodied Hand`);

  maximize("weapon damage", false);

  if (weaponTurns() > 2) {
    throw "Something went wrong with weapon damage.";
  }

  TEMP_TURNS = myTurncount();
  doTest(TEST_WEAPON);
  WEAPON_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsWeaponTurns", WEAPON_TURNS.toString());
}

if (!testDone(TEST_SPELL)) {
  ensureEffect($effect`Simmering`);

  ensureEffect($effect`Song of Sauce`);
  ensureEffect($effect`Carol of the Hells`);
  ensureEffect($effect`Arched Eyebrow of the Archmage`);
  ensureSong($effect`Jackasses' Symphony of Destruction`);
  if (availableAmount($item`LOV Elixir #6`) > 0) {
    ensureEffect($effect`The Magic of LOV`);
  }

  // Pool buff
  ensureEffect($effect`Mental A-cue-ity`);

  // Beach Comb
  ensureEffect($effect`We're All Made of Starfish`);

  useSkill(1, $skill`Spirit of Cayenne`);

  // Get flimsy hardwood scraps.
  visitUrl("shop.php?whichshop=lathe");
  if (availableAmount($item`flimsy hardwood scraps`) > 0) {
    retrieveItem(1, $item`weeping willow wand`);
  }

  cliExecute("briefcase e spell");

  // Get inner elf for spell damage
  if (haveEffect($effect`Inner Elf`) === 0 && get("_snokebombUsed") < 3) {
    Clan.join("Beldungeon");
    ensureEffect($effect`Blood Bubble`);
    useFamiliar($familiar`Machine Elf`);
    setProperty("choiceAdventure326", "1");
    adventureMacro($location`The Slime Tube`, Macro.skill($skill`Snokebomb`));
    useDefaultFamiliar();
    Clan.join("Alliance from Hell");
  } else {
    print("Something went wrong with getting inner elf");
  }

  useDefaultFamiliar();
  // Meteor showered
  if (haveEffect($effect`Meteor Showered`) === 0) {
    equip($item`Fourth of May Cosplay Saber`);
    adventureMacroAuto(
      $location`Noob Cave`,
      Macro.skill($skill`Meteor Shower`).skill($skill`Use the Force`)
    );
  }
  setAutoAttack(0);

  if (myClass() === $class`Sauceror`) {
    cliExecute("barrelprayer buff");
  }

  // Sigils of Yeg = 200% SD
  if (!get("_cargoPocketEmptied") && haveEffect($effect`Sigils of Yeg`) === 0) {
    if (availableAmount($item`Yeg's Motel hand soap`) === 0) cliExecute("cargo 177");
    ensureEffect($effect`Sigils of Yeg`);
  }

  if (round(numericModifier("spell damage percent")) % 50 >= 40) {
    ensureItem(1, $item`soda water`);
    ensurePotionEffect($effect`Concentration`, $item`cordial of concentration`);
  }

  useFamiliar($familiar`Left-Hand Man`);

  maximize("spell damage", false);

  while (spellTurns() > myAdventures()) {
    eat(1, $item`magical sausage`);
  }

  TEMP_TURNS = myTurncount();
  doTest(TEST_SPELL);
  SPELL_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsSpellTurns", SPELL_TURNS.toString());
}

if (!testDone(TEST_ITEM)) {
  ensureMpSausage(500);

  fightSausageIfGuaranteed();

  // kramco messes up maps
  equip($slot`off-hand`, $item`none`);

  //getting a lil ninja costume for the tot
  if (availableAmount($item`li'l ninja costume`) === 0 && get("_shatteringPunchUsed") < 3) {
    Macro.skill($skill`Shattering Punch`).setAutoAttack();
    mapMonster($location`The Haiku Dungeon`, $monster`amateur ninja`);
    setLocation($location`none`);
    setAutoAttack(0);
  }

  // use abstraction: certainty if you have it
  // ensureEffect($effect`certainty`);

  // pulls wheel of fortune from deck
  if (get("_deckCardsDrawn") === 10) {
    cliExecute("cheat buff items");
  }
  // get pirate DNA and make a gene tonic
  if (get("dnaSyringe") !== $phylum`pirate` && haveEffect($effect`Human-Pirate Hybrid`) === 0) {
    equip($slot`acc1`, $item`Kremlin's Greatest Briefcase`);
    if (get("_kgbTranquilizerDartUses") >= 3) {
      throw "Out of KGB banishes";
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
      geneTonic($phylum`pirate`);
      ensureEffect($effect`Human-Pirate Hybrid`);
      setAutoAttack(0);
    } else throw "Something went wrong getting pirate DNA.";
  }

  useDefaultFamiliar();
  // TODO: Add bowling ball skill for 25% item
  if (haveEffect($effect`Bat-Adjacent Form`) === 0) {
    if (get("_reflexHammerUsed") >= 3) throw "Out of reflex hammers!";
    equip($slot`acc3`, $item`Lil' Doctor™ bag`);
    equip($item`vampyric cloake`);
    adventureMacroAuto(
      $location`The Neverending Party`,
      Macro.skill($skill`Become a Bat`).skill($skill`Reflex Hammer`)
    );
    setAutoAttack(0);
  }
  /*
  if (!get("_clanFortuneBuffUsed")) {
    ensureEffect($effect`There's No N In Love`);
  }
*/
  ensureEffect($effect`Fat Leon's Phat Loot Lyric`);
  ensureEffect($effect`Singer's Faithful Ocelot`);
  ensureEffect($effect`The Spirit of Taking`);
  // ensureEffect($effect`items.enh`);
  ensureEffect($effect`El Aroma de Salsa`);

  // synthesis: collection
  // cliExecute("create 1 peppermint twist");
  if (haveEffect($effect`Synthesis: Collection`) === 0) {
    use(1, $item`peppermint sprout`);
    sweetSynthesis($item`peppermint sprout`, $item`peppermint twist`);
  }
  // SynthesisPlanner.synthesize($effect`Synthesis: Collection`);

  // see what class we are, maybe a couple other buffs
  if (myClass() === $class`Pastamancer`) {
    cliExecute("barrelprayer buff");
  } else if (myClass() === $class`Sauceror`) {
    useSkill(1, $skill`Seek out a Bird`); // seek out a bird
  }

  // Use bag of grain.
  //    ensure_effect($effect[Nearly All-Natural]);

  ensureEffect($effect`Feeling Lost`);
  ensureEffect($effect`Steely-Eyed Squint`);

  // get big smile of the blender if available, someday use this to replace something?
  if (get("_campAwaySmileBuffs") === 1) {
    visitUrl("place.php?whichplace=campaway&action=campaway_sky");
  }

  useFamiliar($familiar`Trick-or-Treating Tot`);
  equip($item`li'l ninja costume`);

  maximize(
    "item, 2 booze drop, -equip broken champagne bottle, -equip surprisingly capacious handbag",
    false
  );

  itemdrop = getModifier("Item Drop");
  boozedrop = getModifier("Booze Drop");

  TEMP_TURNS = myTurncount();
  doTest(TEST_ITEM);
  ITEM_TURNS = myTurncount() - TEMP_TURNS;
  setProperty("_hccsItemTurns", ITEM_TURNS.toString());
}

const END_TIME = gametimeToInt();

useSkill(1, $skill`Spirit of Nothing`);
setProperty("autoSatisfyWithNPCs", "true");
setProperty("autoSatisfyWithCoinmasters", getProperty("_saved_autoSatisfyWithCoinmasters"));
setProperty("hpAutoRecovery", "0.8");
setProperty("mpAutoRecovery", "0.1");
setProperty("_meteorShowerUses", "4");

cliExecute("mood default");
cliExecute("ccs default");
cliExecute("boombox food");

visitUrl("peevpee.php?action=smashstone&confirm=on");
print("Stone smashed. Get your PVP on!", "green");
// spar for 6 fights
if (get("_daycareRecruits") === 0 && hippyStoneBroken() === true) {
  visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
  runChoice(3);
  runChoice(1);
  runChoice(4);
  runChoice(5);
  runChoice(4);
}

cliExecute("uberpvpoptimizer");
cliExecute("pvp fame nice list");

doTest(DONATE);

const totalSeconds = (END_TIME - START_TIME) / 1000;
const min = Math.floor(totalSeconds / 60);
const sec = Math.floor(totalSeconds % 60);

print(
  `This loop took ${min} minutes and ${sec} seconds, for a 1 day, ${
    myTurncount() - 1
  } turn HCCS run. Organ use was ${myFullness()}/${myInebriety()}/${mySpleenUse()}. I drank ${
    6 - availableAmount($item`astral pilsner`)
  } Astral Pilsners.`,
  "green"
);

print(`HP test: ${get("_hccsHpTurns")}`, "green");
print(`Muscle test: ${get("_hccsHpTurns")}`, "green");
print(`moxie prediction: ${moxieStat}`);
print(`Moxie test: ${get("_hccsMoxTurns")}`, "green");
print(`Myst test: ${get("_hccsMysTurns")}`, "green");
print(`Hot Res test: ${get("_hccsHotResTurns")}`, "green");
print(`Noncombat test: ${get("_hccsNoncombatTurns")}`, "green");
print(`Fam Weight test: ${get("_hccsFamiliarTurns")}`, "green");
print(`Weapon Damage test: ${get("_hccsWeaponTurns")}`, "green");
print(`Spell Damage Test: ${get("_hccsSpellTurns")}`, "green");
print(
  `item drop was ${itemdrop} and booze drop was ${boozedrop}, so that test should have taken ${
    60 - (Math.floor(boozedrop / 15) + Math.floor(itemdrop / 30))
  }`
);
print(`Item Drop test: ${get("_hccsItemTurns")}`, "green");

print(`You spent ${get("_pocketProfessorLectures")} lectures this run.`);
