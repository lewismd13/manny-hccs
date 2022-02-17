import { canInteract, cliExecute, hippyStoneBroken, myLevel, runChoice, visitUrl } from "kolmafia";
import { Clan, CommunityService } from "libram";
import { get, PropertiesManager } from "libram/dist/property";
import { level } from "./level";
import { globalOptions } from "./options";
import { ResourceTracker } from "./resources";
import {
  coilPrep,
  famWtPrep,
  hotResPrep,
  hpPrep,
  itemPrep,
  moxPrep,
  musPrep,
  mysPrep,
  nonCombatPrep,
  spellPrep,
  WeaponPrep,
} from "./tests";

export const resources = new ResourceTracker();
export const propertyManager = new PropertiesManager();

const assertTest = (action: boolean, test: string) => {
  if (!action) throw `${test} test failed to complete.`;
};

function endOfRunPvp(): void {
  // break stone
  if (!hippyStoneBroken()) visitUrl("peevpee.php?action=smashstone&confirm=on");

  // recruit once and spar for 6 fights
  if (get("_daycareRecruits") === 0 && hippyStoneBroken() === true) {
    visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
    runChoice(3);
    runChoice(1);
    runChoice(4);
    runChoice(5);
    runChoice(4);
  }

  // run optimizer and fight, choosing whatever mini you like this season
  cliExecute("uberpvpoptimizer");
  cliExecute("pvp fame nice list");
}

cliExecute("mood apathetic");

// All combat handled by our consult script (libramMacro.js).
cliExecute("ccs libramMacro");

Clan.join("Alliance from Hell");

try {
  assertTest(CommunityService.CoilWire.run(coilPrep, globalOptions.debug, 60), "Coil Wire");
  if (myLevel() < 14 && !CommunityService.HP.isDone()) level();
  assertTest(CommunityService.HP.run(hpPrep, globalOptions.debug, 1), "HP");
  assertTest(CommunityService.Muscle.run(musPrep, globalOptions.debug, 1), "Muscle");
  assertTest(CommunityService.Moxie.run(moxPrep, globalOptions.debug, 1), "Moxie");
  assertTest(CommunityService.Mysticality.run(mysPrep, globalOptions.debug, 1), "Mysticality");
  assertTest(CommunityService.HotRes.run(hotResPrep, globalOptions.debug, 1), "Hot Res");
  assertTest(CommunityService.Noncombat.run(nonCombatPrep, globalOptions.debug, 1), "Noncombat");
  assertTest(
    CommunityService.FamiliarWeight.run(famWtPrep, globalOptions.debug, 25),
    "Familiar Weight"
  );
  assertTest(
    CommunityService.WeaponDamage.run(WeaponPrep, globalOptions.debug, 1),
    "Weapon Damage"
  );
  assertTest(CommunityService.SpellDamage.run(spellPrep, globalOptions.debug, 25), "Spell Damage");
  assertTest(CommunityService.BoozeDrop.run(itemPrep, globalOptions.debug, 1), "Item");
} finally {
  endOfRunPvp();
  // CommunityService.donate();
  if (!canInteract()) {
    visitUrl("council.php");
    visitUrl("choice.php?whichchoice=1089&option=30");
  }
  propertyManager.resetAll();
  CommunityService.printLog();
  resources.summarize();
}
