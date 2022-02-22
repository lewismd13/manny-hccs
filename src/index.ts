import { cliExecute, hippyStoneBroken, myLevel, print, setAutoAttack, visitUrl } from "kolmafia";
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

const assertTest = (action: string, test: string) => {
    if (action === "failed") throw `${test} test failed to complete.`;
};

export function endOfRunPvp(): void {
    // break stone
    if (!hippyStoneBroken()) visitUrl("peevpee.php?action=smashstone&confirm=on");

    // run optimizer and fight, choosing whatever mini you like this season
    cliExecute("uberpvpoptimizer");
    cliExecute("pvp fame nice list");
}

cliExecute("mood apathetic");

// All combat handled by our consult script (libramMacro.js).
cliExecute("ccs libramMacro");

Clan.join("Alliance from Hell");
try {
    assertTest(CommunityService.CoilWire.run(coilPrep, false, 60), "Coil Wire");
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
    assertTest(
        CommunityService.SpellDamage.run(spellPrep, globalOptions.debug, 25),
        "Spell Damage"
    );
    assertTest(CommunityService.BoozeDrop.run(itemPrep, globalOptions.debug, 1), "Item");
} finally {
    propertyManager.resetAll();
    setAutoAttack(0);
    cliExecute("ccs default");
    cliExecute("mood apathetic");
}

// only do pvp and donate if we're done with all the quests
if (get("csServicesPerformed").split(",").length === 11) {
    endOfRunPvp();
    CommunityService.donate();
    CommunityService.printLog("yellow");
    resources.summarize();
} else print("You don't actually appear to be done.");
