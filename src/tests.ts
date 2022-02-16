import {
  availableAmount,
  cliExecute,
  cliExecuteOutput,
  eat,
  equip,
  getProperty,
  handlingChoice,
  haveEffect,
  logprint,
  myBasestat,
  myBuffedstat,
  myClass,
  myHp,
  myMaxhp,
  myMp,
  numericModifier,
  print,
  runChoice,
  runCombat,
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
  $skill,
  $slot,
  $stat,
  adventureMacro,
  AsdonMartin,
  CommunityService,
  ensureEffect,
  get,
  have,
} from "libram";
import { propertyManager, resources } from ".";
import Macro from "./combat";
import { withMacro } from "./hccs";
import {
  ensureCreateItem,
  ensureInnerElf,
  ensureMpTonic,
  ensureNpcEffect,
  ensurePotionEffect,
  ensureSong,
  equalizeStat,
  tryUse,
} from "./lib";
import { globalOptions } from "./options";
import {
  hotresOutfit,
  hpOutfit,
  moxieOutfit,
  muscleOutfit,
  mysticalityOutfit,
  noncombatOutfit,
} from "./outfits";

export function moxPrep() {
  equalizeStat($stat`Moxie`);

  // Beach Comb
  ensureEffect($effect`Pomp & Circumsands`);

  // PM day 1 is moxie, as is sauce
  ensureEffect($effect`Blessing of the Bird`);

  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave's Shanty of Superiority`);
  ensureEffect($effect`Quiet Desperation`);
  ensureEffect($effect`Disco Fever`);
  ensureEffect($effect`Big`);
  ensureEffect($effect`Blubbered Up`);
  ensureNpcEffect($effect`Butt-Rock Hair`, 5, $item`hair spray`);
  useSkill($skill`Acquire Rhinestones`);
  use(availableAmount($item`rhinestone`), $item`rhinestone`);
  if (!have($effect`Unrunnable Face`)) {
    tryUse(1, $item`runproof mascara`);
  }

  moxieOutfit();
  if (globalOptions.debug) {
    print(`equalized base stat: ${myBasestat($stat`mysticality`)}`);
    print(`buffed moxie: ${myBuffedstat($stat`moxie`)}`);
    logprint(cliExecuteOutput("modtrace mox"));
  }
}

export function hpPrep() {
  equalizeStat($stat`Muscle`);

  ensureEffect($effect`Song of Starch`);
  ensureEffect($effect`Rage of the Reindeer`);
  ensureEffect($effect`Quiet Determination`);
  ensureEffect($effect`Disdain of the War Snapper`);
  ensureNpcEffect($effect`Go Get 'Em, Tiger!`, 5, $item`Ben-Gal™ Balm`);

  useFamiliar($familiar`Left-Hand Man`);

  // FIXME: Outfit
  hpOutfit();
  if (globalOptions.debug) {
    logprint(cliExecuteOutput("modtrace hp"));
  }
}

export function musPrep() {
  equalizeStat($stat`Muscle`);

  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave's Shanty of Superiority`);
  ensureSong($effect`Power Ballad of the Arrowsmith`);
  ensureEffect($effect`Rage of the Reindeer`);
  ensureEffect($effect`Quiet Determination`);
  ensureEffect($effect`Lack of Body-Building`);
  ensureEffect($effect`Big`);
  if (myClass() !== $class`Turtle Tamer`) ensureEffect($effect`Disdain of the War Snapper`);
  ensureNpcEffect($effect`Go Get 'Em, Tiger!`, 5, $item`Ben-Gal™ Balm`);

  muscleOutfit();
  if (CommunityService.Muscle.prediction > 1) ensureInnerElf();
  if (globalOptions.debug) {
    print(`equalized base stat: ${myBasestat($stat`mysticality`)}`);
    print(`buffed muscle: ${myBuffedstat($stat`muscle`)}`);
    logprint(cliExecuteOutput("modtrace muscle"));
  }
}

export function mysPrep() {
  ensureEffect($effect`Song of Bravado`);
  ensureSong($effect`Stevedave's Shanty of Superiority`);
  ensureEffect($effect`Quiet Judgement`);
  ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);

  mysticalityOutfit();
  if (globalOptions.debug) {
    logprint(cliExecuteOutput("modtrace mys"));
  }
}

export function nonCombatPrep() {
  if (get("_godLobsterFights") < 3) {
    if (myHp() < 0.8 * myMaxhp()) useSkill(1, $skill`Cannelloni Cocoon`);
    useFamiliar($familiar`God Lobster`);
    // Get -combat buff.
    propertyManager.setChoices({ [1310]: 2 });
    equip($item`God Lobster's Ring`);
    visitUrl("main.php?fightgodlobster=1");
    withMacro(Macro.kill(), () => runCombat());
    if (handlingChoice()) runChoice(2);
  }

  if (getProperty("_horsery") !== "dark horse") cliExecute("horsery dark");

  if (myHp() < 30) useSkill(1, $skill`Cannelloni Cocoon`);
  ensureEffect($effect`Blood Bond`);
  ensureEffect($effect`Leash of Linguini`);
  ensureEffect($effect`Empathy`);

  equip($slot`acc2`, $item`Powerful Glove`);

  ensureEffect($effect`The Sonata of Sneakiness`);
  ensureEffect($effect`Smooth Movements`);
  ensureEffect($effect`Invisible Avatar`);
  ensureEffect($effect`Silent Running`);
  ensureEffect($effect`Feeling Lonely`);

  useFamiliar($familiar`Disgeist`);

  AsdonMartin.drive($effect`Driving Stealthily`, 1);

  // Without the PM bird, we need shoe gum
  if (myClass() !== $class`Pastamancer`) ensurePotionEffect($effect`Gummed Shoes`, $item`shoe gum`);

  // Pastamancer d1 is -combat.
  if (myClass() === $class`Pastamancer`) ensureEffect($effect`Blessing of the Bird`);

  noncombatOutfit();

  // Rewards
  ensureEffect($effect`Throwing Some Shade`);
  if (globalOptions.debug) {
    logprint(cliExecuteOutput("modtrace combat rate"));
  }
}

export function hotResPrep() {
  ensureMpTonic(500);

  useFamiliar($familiar`Exotic Parrot`);

  // These should have fallen through all the way from leveling.
  ensureEffect($effect`Fidoxene`);
  ensureEffect($effect`Do I Know You From Somewhere?`);
  ensureEffect($effect`Puzzle Champ`);
  ensureEffect($effect`Billiards Belligerence`);
  ensureEffect($effect`Astral Shell`);
  ensureEffect($effect`Elemental Saucesphere`);
  cliExecute(`smash ${availableAmount($item`ratty knitted cap`)} ratty knitted cap`);

  while (
    have($skill`Deep Dark Visions`) &&
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
    if (Math.round(numericModifier("spooky resistance")) < 10) {
      ensureEffect($effect`Does It Have a Skull In There??`);
      if (Math.round(numericModifier("spooky resistance")) < 10) {
        throw "Not enough spooky res for Deep Dark Visions.";
      }
    }
    useSkill(1, $skill`Deep Dark Visions`);
  }

  if (!have($effect`Fireproof Foam Suit`)) {
    equip($slot`weapon`, $item`industrial fire extinguisher`);
    equip($slot`off-hand`, $item`Fourth of May Cosplay Saber`);
    equip($item`vampyric cloake`);
    propertyManager.setChoices({ [1387]: 3 });
    adventureMacro(
      $location`The Dire Warren`,
      Macro.skill($skill`Become a Cloud of Mist`)
        .skill($skill`Fire Extinguisher: Foam Yourself`)
        .skill($skill`Use the Force`)
    );
    resources.saberForces.push($effect`Fireproof Foam Suit`);
  }

  if (
    availableAmount($item`sleaze powder`) > 0 ||
    availableAmount($item`lotion of sleaziness`) > 0
  ) {
    ensurePotionEffect($effect`Sleazy Hands`, $item`lotion of sleaziness`);
  }

  ensureEffect($effect`Feeling Peaceful`);

  if (availableAmount($item`cracker`) === 0 && get("tomeSummons") < 3) {
    useFamiliar($familiar`Exotic Parrot`);
    resources.clipArt($item`box of Familiar Jacks`);
    use($item`box of Familiar Jacks`);
  }

  useFamiliar($familiar`Exotic Parrot`);

  // Mafia sometimes can't figure out that multiple +weight things would get us to next tier.
  // FIXME: Outfit
  hotresOutfit();
  if (globalOptions.debug) {
    logprint(cliExecuteOutput("modtrace hot res"));
  }
}
