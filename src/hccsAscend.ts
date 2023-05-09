import { Args } from "grimoire-kolmafia";
import {
    Skill,
    cliExecute,
    equippedItem,
    fullnessLimit,
    getPermedSkills,
    inebrietyLimit,
    myFullness,
    myGardenType,
    myInebriety,
    pvpAttacksLeft,
    stashAmount,
    takeStash,
    use,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $class,
    $item,
    $path,
    $skill,
    $slot,
    Clan,
    Lifestyle,
    ascend,
    get,
    have,
    prepareAscension,
} from "libram";

const args = Args.create("hccsAscend", "Manny's script to ascend into a CS loop", {
    core: Args.string({
        help: "Hardcore or softcore",
        options: [
            ["hard", "Ascend HCCS"],
            ["soft", "Ascend SCCS"],
        ],
        default: "soft",
    }),
    class: Args.class({
        help: "What class should we ascend as? Currently only PM is stable, S is probably fine, the others are not supported",
        default: $class`Pastamancer`,
    }),
});

export const stashpulls = [];

export function createPermOptions(): { permSkills: Map<Skill, Lifestyle>; neverAbort: boolean } {
    return {
        permSkills: new Map(
            Skill.all()
                .filter(
                    (skill) =>
                        have(skill) && skill.permable && getPermedSkills()[skill.name] === undefined
                )
                .map((skill) => [skill, Lifestyle.hardcore])
        ),
        neverAbort: false,
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function main(command?: string): void {
    Args.fill(args, command);

    const myClass = args.class;

    const lifestyleMode = args.core === "soft" ? Lifestyle.softcore : Lifestyle.hardcore;

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
        "Malibu Stacey",
        "ReverKiller",
        "beldur",
        "BC_Goldman",
        "katarn",
        "gausie",
        "Captain Scotch",
        "playultm8",
        "busta_rhymes",
        "freddyjoehanson",
        "kenny kamAKAzi",
        "SSBBHax",
        "tHE eROsIoNseEker",
        "The Dictator",
        "ALAVG",
        "worthawholebean",
        "Butts McGruff",
        "burningbman",
        "kha0z",
        "Grushvak",
        "threebullethamburgler",
        "Superechidna",
        "DanceCommander6",
        "Baden",
        "irrat",
        "Kasekopf",
        "king dave",
        "slifty",
        "dician",
        "Joe The Sauceror",
        "beldur",
        "soolar",
        "blazex",
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

    visitUrl("council.php");

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

    prepareAscension({
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
        $item`astral statuette`,
        createPermOptions()
    );

    if (have($item`Asdon Martin keyfob`)) use($item`Asdon Martin keyfob`);
}
