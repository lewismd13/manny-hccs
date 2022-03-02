import {
    cliExecute,
    fullnessLimit,
    inebrietyLimit,
    myFullness,
    myGardenType,
    myInebriety,
    pvpAttacksLeft,
    use,
    useSkill,
} from "kolmafia";
import { $item, $skill, Clan, get } from "libram";

Clan.join("Alliance from Hell");

if (pvpAttacksLeft() > 0) {
    cliExecute("uberpvpoptimizer");
    cliExecute("swagger");
}

if (myInebriety() <= inebrietyLimit() || myFullness() < fullnessLimit()) {
    throw "are you sure you want to ascend? you have some open organ space";
}

const playerIDs: string[] = [
    "phreddrickkv2",
    "2548033",
    "Phillammon",
    "2705901",
    "ReverKiller",
    "beldur",
    "887028",
    "786069",
    "1197090",
    "437479",
    "playultm8",
    "busta_rhymes",
    "644996",
    "kenny kamAKAzi",
    "SSBBHax",
    "1937905",
    "2766368",
    "2203016",
    "1972588",
    "Butts McGruff",
    "burningbman",
    "2533291",
    "1741165",
    "1993636",
    "2339258",
    "DanceCommander6",
];

while ($skill`Experience Safari`.timescast < get("skillLevel180")) {
    useSkill($skill`Experience Safari`, 1, playerIDs[Math.round(Math.random() * playerIDs.length)]);
}

if (myGardenType() !== "peppermint") {
    cliExecute("garden pick");
    use($item`Peppermint Pip Packet`);
}
