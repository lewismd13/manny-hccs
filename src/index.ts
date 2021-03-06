import {
    cliExecute,
    hippyStoneBroken,
    myDaycount,
    myLevel,
    myTurncount,
    print,
    setAutoAttack,
    visitUrl,
} from "kolmafia";
import { Clan, CommunityService } from "libram";
import { get, PropertiesManager } from "libram/dist/property";
import { level } from "./level";
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
    cliExecute("pvp fame ASCII");
}

cliExecute("mood apathetic");

// All combat handled by our consult script (libramMacro.js).
cliExecute("ccs libramMacro");

Clan.join("Alliance from Hell");
try {
    assertTest(CommunityService.CoilWire.run(coilPrep, 60), "Coil Wire");
    if (myLevel() < 14 || !CommunityService.HP.isDone())
        CommunityService.logTask("leveling", level);
    assertTest(CommunityService.HP.run(hpPrep, 1), "HP");
    assertTest(CommunityService.Muscle.run(musPrep, 1), "Muscle");
    assertTest(CommunityService.Moxie.run(moxPrep, 1), "Moxie");
    assertTest(CommunityService.Mysticality.run(mysPrep, 1), "Mysticality");
    assertTest(CommunityService.HotRes.run(hotResPrep, 1), "Hot Res");
    assertTest(CommunityService.Noncombat.run(nonCombatPrep, 1), "Noncombat");
    assertTest(CommunityService.FamiliarWeight.run(famWtPrep, 25), "Familiar Weight");
    assertTest(CommunityService.WeaponDamage.run(WeaponPrep, 1), "Weapon Damage");
    assertTest(CommunityService.SpellDamage.run(spellPrep, 25), "Spell Damage");
    assertTest(CommunityService.BoozeDrop.run(itemPrep, 1), "Item");
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
    print();
    print(`That is a ${myDaycount()} day, ${myTurncount()} turn HCCS run. Nice work!`, `yellow`);
    print();
    resources.summarize();
} else print("You don't actually appear to be done.", "red");
