import {
    cliExecute,
    equippedItem,
    fullnessLimit,
    inebrietyLimit,
    myFullness,
    myGardenType,
    myInebriety,
    print,
    pvpAttacksLeft,
    stashAmount,
    takeStash,
    use,
    useSkill,
} from "kolmafia";
import {
    $class,
    $item,
    $path,
    $skill,
    $slot,
    ascend,
    Clan,
    get,
    have,
    Lifestyle,
    prepareAscension,
} from "libram";

export const stashpulls = [$item`Snow Suit`, $item`moveable feast`, $item`repaid diaper`];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function main(args = ""): void {
    const myworkshed = args.split(" ").includes("dna")
        ? `Little Geneticist DNA-Splicing Lab`
        : `Asdon Martin keyfob`;

    let myClass = $class`Pastamancer`;

    if (args.split(" ").includes("sauceror")) {
        myClass = $class`Sauceror`;
    }

    let lifestyleMode = Lifestyle.softcore;

    if (args.split(" ").includes("hardcore")) {
        lifestyleMode = Lifestyle.hardcore;
    }

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
        // "boesbert",
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
        useSkill(
            $skill`Experience Safari`,
            1,
            playerIDs[Math.round(Math.random() * playerIDs.length)]
        );
    }

    if (myGardenType() !== "peppermint") {
        cliExecute("garden pick");
        use($item`Peppermint Pip Packet`);
    }

    while (have($item`MayDay™ supply package`)) use($item`MayDay™ supply package`);

    if (equippedItem($slot`bootskin`) !== $item`frontwinder skin`) {
        throw "Your cowboy boots have the wrong skin";
    }

    if (equippedItem($slot`bootspur`) !== $item`nicksilver spurs`) {
        throw "Your cowboy boots have the wrong spurs";
    }
    if (lifestyleMode === Lifestyle.softcore) {
        Clan.join("Alliance From Heck");
        for (const pull of stashpulls) {
            if (!have(pull) && stashAmount(pull) > 0) takeStash(pull, 1);
        }
    }
    print(
        `you're about to ascend as a ${myClass} with a ${myworkshed}! you provided ${args} as options`,
        "green"
    );

    prepareAscension({
        workshed: myworkshed,
        garden: "Peppermint Pip Packet",
        eudora: "Our Daily Candles™ order form",

        chateau: {
            desk: "Swiss piggy bank",
            nightstand: "foreign language tapes",
            ceiling: "ceiling fan",
        },
    });

    ascend(
        $path`Community Service`,
        myClass,
        lifestyleMode,
        "wallaby",
        $item`astral six-pack`,
        $item`astral statuette`
    );
}
