import {
    adv1,
    autosell,
    availableAmount,
    cliExecute,
    containsText,
    create,
    equip,
    handlingChoice,
    haveEffect,
    inMultiFight,
    itemAmount,
    mpCost,
    myBasestat,
    myClass,
    myLevel,
    myPrimestat,
    numericModifier,
    print,
    retrieveItem,
    round,
    runChoice,
    runCombat,
    setAutoAttack,
    setLocation,
    sweetSynthesis,
    totalFreeRests,
    toUrl,
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
    $skill,
    $slot,
    $stat,
    adventureMacroAuto,
    ensureEffect,
    get,
    have,
    Mood,
    TunnelOfLove,
    Witchess,
} from "libram";
import { propertyManager, resources } from ".";
import Macro, { withMacro } from "./combat";
import {
    ensureInnerElf,
    ensureMpTonic,
    ensureNpcEffect,
    ensurePotionEffect,
    libramBurn,
    oysterAvailable,
    sausageFightGuaranteed,
    setChoice,
    tryEnsureEffect,
    tryEquip,
    tryUse,
    useDefaultFamiliar,
} from "./lib";
import { globalOptions } from "./options";
import uniform from "./outfits";

// TODO: Use libram freekill and freerun handling

export function level(): void {
    if (!have($effect`That's Just Cloud-Talk, Man`)) {
        visitUrl("place.php?whichplace=campaway&action=campaway_sky");
    }

    if (availableAmount($item`Flaskfull of Hollow`) > 0) {
        ensureEffect($effect`Merry Smithsness`);
    }

    if (myPrimestat() === $stat`Muscle`) {
        ensureEffect($effect`Muddled`);
        ensureEffect($effect`Muscle Unbound`);
        ensureEffect($effect`Lack of Body-Building`);

        if (globalOptions.levelAggressively) {
            resources.wish($effect`HGH-charged`);
            resources.deck("strength");
            resources.wish($effect`New and Improved`);
        }
    } else {
        ensureEffect($effect`Uncucumbered`);
        ensureEffect($effect`Inscrutable Gaze`);
        ensureEffect($effect`Thaumodynamic`);
        ensureEffect($effect`We're All Made of Starfish`);

        if (globalOptions.levelAggressively) {
            resources.deck("magician");
            resources.wish($effect`New and Improved`);
            resources.wish($effect`Different Way of Seeing Things`);
        }

        if (!get("_preventScurvy")) useSkill($skill`Prevent Scurvy and Sobriety`);
        if (get("reagentSummons") === 0) useSkill($skill`Advanced Saucecrafting`);
        ensurePotionEffect($effect`Mystically Oiled`, $item`ointment of the occult`);
    }

    ensureEffect($effect`You Learned Something Maybe!`);

    uniform();

    if (availableAmount($item`li'l ninja costume`) === 0) {
        if (
            !have($item`tomato`) &&
            !have($item`tomato juice of powerful power`) &&
            !have($effect`Tomato Power`) &&
            get("lastCopyableMonster") !== $monster`possessed can of tomatoes` &&
            myClass() === $class`Pastamancer`
        ) {
            equip($slot`off-hand`, $item`none`);
            equip($slot`acc3`, $item`Lil' Doctor™ bag`);
            useDefaultFamiliar();
            resources.mapMacro(
                $location`The Haunted Pantry`,
                $monster`possessed can of tomatoes`,
                Macro.skill($skill`Reflex Hammer`)
            );
        }
        ensureMpTonic(50);
        useDefaultFamiliar();
        resources.mapMacro(
            $location`The Haiku Dungeon`,
            $monster`amateur ninja`,
            Macro.skill($skill`Feel Nostalgic`).skill($skill`Chest X-Ray`)
        );
        runCombat();

        ensurePotionEffect($effect`Tomato Power`, $item`tomato juice of powerful power`);
    }

    // Summon brickos for the extra fights
    while (
        (itemAmount($item`BRICKO eye brick`) < 1 || itemAmount($item`BRICKO brick`) < 8) &&
        get("_brickoFights") < 2
    ) {
        ensureMpTonic(mpCost($skill`Summon BRICKOs`));
        useSkill($skill`Summon BRICKOs`);
    }

    if (get("_brickoFights") === 0 && oysterAvailable() && !have($item`bag of many confections`)) {
        useFamiliar($familiar`Stocking Mimic`);
        equip($slot`acc2`, $item`Lil' Doctor™ bag`);
        create($item`BRICKO oyster`);
        ensureMpTonic(34);
        Macro.trySkill($skill`Otoscope`)
            .trySkill($skill`Curse of Weaksauce`)
            .trySkillRepeat($skill`Saucegeyser`)
            .setAutoAttack();
        use(1, $item`BRICKO oyster`);
        autosell(1, $item`BRICKO pearl`);
        retrieveItem($item`bag of many confections`);
        setAutoAttack(0);
    }

    if (get("_candySummons") === 0) {
        useSkill(1, $skill`Summon Crimbo Candy`);
    }

    useSkill(1, $skill`Chubby and Plump`);

    // Depending on crimbo candy summons, gets synth learning, possibly getting bugged beanie if it needs a tome summon
    // TODO: muscle support
    if (
        availableAmount($item`Crimbo candied pecan`) > 1 &&
        availableAmount($item`Crimbo peppermint bark`) === 0 &&
        haveEffect($effect`Synthesis: Learning`) === 0
    ) {
        resources.tome($skill`Summon Sugar Sheets`);
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

    cliExecute("briefcase enchantment spell hot");

    // Depends on Ez's Bastille script.
    cliExecute(`bastille ${myPrimestat() === $stat`Muscle` ? "muscle" : "myst"} brutalist`);

    // Use ten-percent bonus
    tryUse(1, $item`a ten-percent bonus`);

    // Scavenge for gym equipment
    if (get("_daycareGymScavenges") < 1) {
        visitUrl("/place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
        const pg = runChoice(3);
        if (containsText(pg, "[free]")) runChoice(2);
        runChoice(5);
        runChoice(4);
    }

    // Make umbrella +ML
    cliExecute("umbrella ml");

    equip($slot`acc1`, $item`Powerful Glove`);
    ensureEffect($effect`Starry-Eyed`);
    ensureEffect($effect`Favored by Lyle`);
    ensureEffect($effect`Triple-Sized`);
    ensureEffect($effect`Feeling Excited`);
    if (myPrimestat() === $stat`Muscle`) {
        ensureNpcEffect($effect`Go Get 'Em, Tiger!`, 5, $item`glittery mascara`);
    } else {
        ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);
    }
    tryEnsureEffect($effect`Confidence of the Votive`);
    if (!get("_streamsCrossed")) cliExecute("crossstreams");
    ensureEffect($effect`Broad-Spectrum Vaccine`);

    // Plan is for these buffs to fall all the way through to item -> hot res -> fam weight.
    ensureEffect($effect`Fidoxene`);
    ensureEffect($effect`Do I Know You From Somewhere?`);
    ensureEffect($effect`Lack of Body-Building`);
    ensureEffect($effect`Puzzle Champ`);
    ensureEffect($effect`Billiards Belligerence`);

    // initialize snojo, picking myst for ice rice
    setChoice(1310, 3);
    visitUrl("place.php?whichplace=snojo&action=snojo_controller");
    while (get("_snojoFreeFights") < 10) {
        useDefaultFamiliar();
        adventureMacroAuto($location`The X-32-F Combat Training Snowman`, Macro.attack().repeat());
    }

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
        setChoice(1387, 3);
        resources.mapMacro(
            $location`The Skeleton Store`,
            $monster`novelty tropical skeleton`,
            Macro.skill($skill`Use the Force`)
        );
        if (handlingChoice()) runChoice(-1);
        resources.saberForces.push($item`cherry`);
        // setProperty("mappingMonsters", "false");
    }

    // Chateau rest
    while (get("timesRested") < totalFreeRests()) {
        visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
        libramBurn();
    }

    while (oysterAvailable()) {
        useDefaultFamiliar();
        equip($slot`acc2`, $item`Lil' Doctor™ bag`);
        create($item`BRICKO oyster`);
        ensureMpTonic(34);
        Macro.trySkill($skill`Otoscope`)
            .trySkill($skill`Curse of Weaksauce`)
            .trySkillRepeat($skill`Saucegeyser`)
            .setAutoAttack();
        use(1, $item`BRICKO oyster`);
        autosell(1, $item`BRICKO pearl`);
        setAutoAttack(0);
    }

    // fight ghost
    const ghostLocation = get("ghostLocation");
    if (ghostLocation) {
        equip($slot`off-hand`, $item`latte lovers member's mug`);
        equip($item`protonic accelerator pack`);
        useDefaultFamiliar();
        adventureMacroAuto(
            ghostLocation,
            Macro.item($item`Time-Spinner`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Trap Ghost`)
        );
    }

    cliExecute("fold makeshift garbage shirt");
    uniform($item`makeshift garbage shirt`);

    if (!have($effect`Holiday Yoked`) || !have($item`Sacramento wine`)) {
        useFamiliar($familiar`Ghost of Crimbo Carols`);
        withMacro(Macro.kill(), () => Witchess.fightPiece($monster`Witchess Bishop`));
    }

    ensureEffect($effect`Song of Bravado`);

    if (
        myPrimestat() === $stat`Mysticality` &&
        availableAmount($item`flask of baconstone juice`) > 0
    ) {
        ensureEffect($effect`Baconstoned`);
    }

    const mood = new Mood();
    mood.skill($skill`Blood Bond`);
    mood.skill($skill`Blood Bubble`);
    mood.skill($skill`Carol of the Bulls`);
    mood.skill($skill`Carol of the Hells`);
    mood.skill($skill`Carol of the Thrills`);
    mood.skill($skill`Drescher's Annoying Noise`);
    mood.skill($skill`Get Big`);
    mood.skill($skill`Leash of Linguini`);
    mood.skill($skill`Pride of the Puffin`);
    mood.skill($skill`Rage of the Reindeer`);
    mood.skill($skill`Singer's Faithful Ocelot`);
    mood.skill($skill`Stevedave's Shanty of Superiority`);
    mood.skill($skill`Ur-Kel's Aria of Annoyance`);
    if (myPrimestat() === $stat`Mysticality`) mood.skill($skill`Inscrutable Gaze`);
    mood.execute();

    // LOV Tunnel
    if (!TunnelOfLove.isUsed()) {
        useDefaultFamiliar();
        Macro.if_(
            "monstername LOV Enforcer",
            Macro.externalIf(
                myPrimestat() === $stat`Muscle`,
                Macro.skill($skill`Micrometeorite`).item($item`Time-Spinner`)
            )
                .attack()
                .repeat()
        )
            .if_("monstername LOV Engineer", Macro.skill($skill`Weapon of the Pastalord`).repeat())
            .if_("monstername LOV Equivocator", Macro.kill())
            .setAutoAttack();

        TunnelOfLove.fightAll(
            "LOV Epaulettes",
            "Open Heart Surgery",
            "LOV Extraterrestrial Chocolate"
        );

        if (handlingChoice()) throw "Did not get all the way through LOV.";
    }
    // TODO: switch to stats, do all 3 fights
    if (get("_godLobsterFights") < 2) {
        equip($item`LOV Epaulettes`);
        useFamiliar($familiar`God Lobster`);
        setChoice(1310, 1);
        while (get("_godLobsterFights") < 2) {
            tryEquip($item`God Lobster's Scepter`);
            visitUrl("main.php?fightgodlobster=1");
            withMacro(Macro.kill(), () => runCombat());
            visitUrl("choice.php");
            if (handlingChoice()) runChoice(1);
        }
    }
    //witchess fights
    if (get("_witchessFights") < 5) {
        equip($item`Fourth of May Cosplay Saber`);
        useDefaultFamiliar();
        while (get("_witchessFights") === 0) {
            Macro.kill().setAutoAttack();
            Witchess.fightPiece($monster`Witchess Bishop`);
            setAutoAttack(0);
        }
        while (get("_witchessFights") === 1) {
            useDefaultFamiliar();
            equip($item`familiar scrapbook`);
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
        while (get("_witchessFights") === 3 && !globalOptions.halloween) {
            useDefaultFamiliar();
            // eslint-disable-next-line libram/verify-constants
            equip($item`unbreakable umbrella`);
            Macro.kill().setAutoAttack();
            Witchess.fightPiece($monster`Witchess Bishop`);
            setAutoAttack(0);
        }
    }

    // Professor 10x free witchess knight if on halloween
    if (get("_witchessFights") === 3 && globalOptions.halloween) {
        useFamiliar($familiar`Pocket Professor`);
        equip($item`LOV Epaulettes`);
        tryEquip($item`Pocket Professor memory chip`);
        equip($slot`weapon`, $item`Fourth of May Cosplay Saber`);
        equip($item`Kramco Sausage-o-Matic™`);
        equip($slot`acc1`, $item`hewn moon-rune spoon`);
        equip($slot`acc2`, $item`Brutal brogues`);
        equip($slot`acc3`, $item`Beach Comb`);
        equip($item`Daylight Shavings Helmet`);
        // ensureOutfit("CS Professor");

        Macro.if_("!monstername witchess knight", Macro.abort())
            .trySkill($skill`lecture on relativity`)
            .kill()
            .setAutoAttack();
        Witchess.fightPiece($monster`Witchess Knight`);
        while (inMultiFight()) runCombat();
        setAutoAttack(0);
    }

    while (get("_machineTunnelsAdv") < 5) {
        // DMT noncombat. Run.
        propertyManager.setChoices({ [1119]: 5 });

        useFamiliar($familiar`Machine Elf`);
        if (globalOptions.debug)
            print(
                `mannydebug my base mainstat is ${myBasestat(
                    $stat`mysticality`
                )} and this is DMT fight ${get("_machineTunnelsAdv")}`
            );

        adventureMacroAuto(
            $location`The Deep Machine Tunnels`,
            Macro.externalIf(
                get("_machineTunnelsAdv") === 0 && get("_cosmicBowlingSkillsUsed") === 0,
                Macro.trySkill($skill`Bowl Sideways`)
            ).kill()
        );
    }

    cliExecute("fold makeshift garbage shirt");
    uniform($item`makeshift garbage shirt`);

    while (
        globalOptions.levelAggressively &&
        get("lastCopyableMonster") === $monster`sausage goblin` &&
        get("_backUpUses") < 11
    ) {
        useDefaultFamiliar();
        if (get("backupCameraMode") !== "ml") cliExecute("backupcamera ml");
        equip($item`backup camera`);
        adventureMacroAuto(
            $location`Noob Cave`,
            Macro.skill($skill`Back-Up to your Last Enemy`).kill()
        );
    }

    // TODO: this needs to move down and become an if statement with umbrella
    equip($item`Kramco Sausage-o-Matic™`);

    // 14 free NEP fights
    while (
        get("_neverendingPartyFreeTurns") < 10 ||
        get("_shatteringPunchUsed") < 2 ||
        !get("_gingerbreadMobHitUsed")
    ) {
        useDefaultFamiliar();
        if (globalOptions.debug)
            print(
                `mannydebug my base mainstat is ${myBasestat(
                    $stat`mysticality`
                )} and this is NEP fight ${get("_neverendingPartyFreeTurns")}`
            );

        ensureInnerElf();

        if (get("_questPartyFair") === "unstarted") {
            visitUrl(toUrl($location`The Neverending Party`));
            if (["food", "booze"].includes(get("_questPartyFairQuest"))) {
                print("Gerald/ine quest!", "blue");
                runChoice(1); // Accept quest
            } else {
                runChoice(2); // Decline quest
            }
        }

        // NEP noncombat. Fight.
        propertyManager.setChoices({ [1324]: 5 });
        if (sausageFightGuaranteed()) equip($item`Kramco Sausage-o-Matic™`);
        // eslint-disable-next-line libram/verify-constants
        else equip($item`unbreakable umbrella`);
        adventureMacroAuto(
            $location`The Neverending Party`,
            Macro.externalIf(
                get("_cosmicBowlingSkillsUsed") < 3,
                Macro.trySkill($skill`Bowl Sideways`)
            ) // TODO: figure out how to save a feel price here without breaking everything
                .if_($effect`Inner Elf`, Macro.trySkill($skill`Feel Pride`))
                .externalIf(
                    get("_neverendingPartyFreeTurns") === 10,
                    Macro.trySkill($skill`Shattering Punch`, $skill`Gingerbread Mob Hit`).abort()
                )

                .kill()
        );
    }

    // fight a witchess queen for pointy crown, getting a couple weapon damage effects just in case
    if (get("_witchessFights") === 4) {
        useDefaultFamiliar();
        equip($item`familiar scrapbook`);
        Macro.attack().repeat().setAutoAttack();
        ensureEffect($effect`Carol of the Bulls`);
        ensureEffect($effect`Song of the North`);
        Witchess.fightPiece($monster`Witchess Queen`);
        setAutoAttack(0);
    }

    if (globalOptions.debug)
        print(`DEBUG: Your mainstat at the end of levelling is ${myBasestat(myPrimestat())}`);

    // Reset location so maximizer doesn't get confused.
    setLocation($location`none`);

    if (myLevel() >= 13) {
        tryUse(1, $item`astral six-pack`);
        resources.consumeTo(5, $item`astral pilsner`);
    } else throw "You're not level 13 at the end of leveling and that is bad";
}
