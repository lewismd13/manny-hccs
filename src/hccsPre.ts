import {
    cliExecute,
    fullnessLimit,
    inebrietyLimit,
    myFullness,
    myGardenType,
    myInebriety,
    pvpAttacksLeft,
    use,
} from "kolmafia";
import { $item, Clan } from "libram";

Clan.join("Alliance from Hell");

if (pvpAttacksLeft() > 0) {
    cliExecute("uberpvpoptimizer");
    cliExecute("swagger");
}

if (myInebriety() <= inebrietyLimit() || myFullness() < fullnessLimit()) {
    throw "are you sure you want to ascend? you have some open organ space";
}

if (myGardenType() !== "peppermint") {
    cliExecute("garden pick");
    use($item`Peppermint Pip Packet`);
}
