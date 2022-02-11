import {
  availableAmount,
  cliExecuteOutput,
  logprint,
  myBasestat,
  myBuffedstat,
  myClass,
  print,
  use,
  useFamiliar,
  useSkill,
} from "kolmafia";
import {
  $class,
  $effect,
  $familiar,
  $item,
  $skill,
  $stat,
  CommunityService,
  ensureEffect,
  have,
} from "libram";
import { ensureInnerElf, ensureNpcEffect, ensureSong, equalizeStat, tryUse } from "./lib";
import { globalOptions } from "./options";
import { hpOutfit, moxieOutfit, muscleOutfit } from "./outfits";

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
