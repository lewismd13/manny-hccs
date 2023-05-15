import {
    adv1,
    autosell,
    availableAmount,
    canAdventure,
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
    print,
    retrieveItem,
    runChoice,
    runCombat,
    setAutoAttack,
    setLocation,
    storageAmount,
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
    SourceTerminal,
    TunnelOfLove,
    Witchess,
    adventureMacroAuto,
    ensureEffect,
    get,
    have,
} from "libram";
import { propertyManager, resources } from ".";
import Macro, { withMacro } from "./combat";
import {
    ensureInnerElf,
    ensureMpTonic,
    ensureNpcEffect,
    ensurePotionEffect,
    juneCleave,
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
        if (globalOptions.halloween) {
            resources.deck("magician");
            resources.wish($effect`New and Improved`);
            resources.wish($effect`Thou Shant Not Sing`);
            resources.wish($effect`HGH-charged`);
        }

        if (!get("_preventScurvy")) useSkill($skill`Prevent Scurvy and Sobriety`);
        if (get("reagentSummons") === 0) useSkill($skill`Advanced Saucecrafting`);
        ensurePotionEffect($effect`Mystically Oiled`, $item`ointment of the occult`);
    }

    if (!have($item`meteorite necklace`)) resources.pull($item`meteorite necklace`, 0);

    ensureEffect($effect`You Learned Something Maybe!`);

    uniform();

    if (availableAmount($item`li'l ninja costume`) === 0) {
        equip($slot`off-hand`, $item`none`);
        equip($slot`acc3`, $item`Lil' Doctor™ bag`);
        useDefaultFamiliar();
        ensureMpTonic(50);
        resources.mapMacro(
            $location`The Haiku Dungeon`,
            $monster`amateur ninja`,
            Macro.skill($skill`Chest X-Ray`)
        );
        runCombat();
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
    /*
    if (
        availableAmount($item`Crimbo candied pecan`) > 1 &&
        availableAmount($item`Crimbo peppermint bark`) === 0 &&
        haveEffect($effect`Synthesis: Learning`) === 0
    ) {
        resources.tome($skill`Summon Sugar Sheets`);
        cliExecute("create 1 sugar shotgun");
        sweetSynthesis($item`sugar shotgun`, $item`Crimbo candied pecan`);
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

    if (round(numericModifier("mysticality experience percent")) < 100) {
        throw "Insufficient +stat%.";
    }
*/
    // synthesis: smart

    /*
    if (haveEffect($effect`Synthesis: Smart`) === 0) {
        sweetSynthesis($item`bag of many confections`, $item`Chubby and Plump bar`);
    }
    */
    cliExecute("briefcase enchantment spell hot");
    equip($slot`offhand`, $item`familiar scrapbook`);

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

    while (have($item`MayDay™ supply package`)) use($item`MayDay™ supply package`);

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
    ensureEffect($effect`Do I Know You From Somewhere?`);
    ensureEffect($effect`Lack of Body-Building`);
    ensureEffect($effect`Puzzle Champ`);
    ensureEffect($effect`Billiards Belligerence`);
    ensureEffect($effect`Carol of the Thrills`);
    ensureEffect($effect`Carol of the Bulls`);
    ensureEffect($effect`Drescher's Annoying Noise`);
    ensureEffect($effect`Pride of the Puffin`);
    ensureEffect($effect`Empathy`);
    ensureEffect($effect`Song of Bravado`);
    ensureEffect($effect`Blood Bond`);
    ensureEffect($effect`Blood Bubble`);
    ensureEffect($effect`Carol of the Hells`);
    ensureEffect($effect`Big`);
    ensureEffect($effect`Leash of Linguini`);
    ensureEffect($effect`Rage of the Reindeer`);
    ensureEffect($effect`Singer's Faithful Ocelot`);
    ensureEffect($effect`Stevedave's Shanty of Superiority`);
    ensureEffect($effect`Ur-Kel's Aria of Annoyance`);
    // tryEnsureEffect($effect`Party Soundtrack`);

    if (myPrimestat() === $stat`Mysticality`) ensureEffect($effect`Inscrutable Gaze`);

    // initialize snojo, picking myst for ice rice
    setChoice(1310, 3);
    visitUrl("place.php?whichplace=snojo&action=snojo_controller");
    uniform();
    while (get("_snojoFreeFights") < 10) {
        useDefaultFamiliar();
        adventureMacroAuto($location`The X-32-F Combat Training Snowman`, Macro.attack().repeat());
    }

    // get rid of snojo debuffs
    cliExecute("hottub");

    // should have second cleaver adventure primed now
    juneCleave();

    // back to saber now that we're done cleavering
    uniform();

    SourceTerminal.educate($skill`Portscan`);

    if (!have($item`green mana`) && !have($effect`Giant Growth`)) resources.deck("Forest");

    while (get("_speakeasyFreeFights") < 3) {
        if (have($item`government cheese`) && !have($effect`Nanobrainy`)) {
            useFamiliar($familiar`Nanorhino`);
            adventureMacroAuto(
                $location`An Unusually Quiet Barroom Brawl`,
                Macro.trySkill($skill`Entangling Noodles`)
                    .trySkill($skill`Giant Growth`)
                    .attack()
                    .repeat()
            );
        } else {
            useDefaultFamiliar();
            adventureMacroAuto(
                $location`An Unusually Quiet Barroom Brawl`,
                Macro.externalIf(
                    !have($item`government cheese`),
                    Macro.if_(`!monstername "government agent"`, Macro.trySkill($skill`Portscan`))
                )
                    .if_(`monstername "Government agent"`, Macro.skill($skill`Feel Envy`))
                    .attack()
                    .repeat()
            );
        }
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

    while (oysterAvailable()) {
        useDefaultFamiliar();
        uniform();
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

    uniform();

    tryEnsureEffect($effect`Wisdom of Others`);

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

    libramBurn();

    // TODO: get rid of withmacro, use CFF
    if (get("_godLobsterFights") < 3) {
        equip($item`LOV Epaulettes`);
        useFamiliar($familiar`God Lobster`);
        setChoice(1310, 3);
        while (get("_godLobsterFights") < 3) {
            visitUrl("main.php?fightgodlobster=1");
            withMacro(Macro.kill(), () => runCombat());
            visitUrl("choice.php");
            if (handlingChoice()) runChoice(1);
        }
    }

    libramBurn();

    cliExecute("fold makeshift garbage shirt");
    uniform($item`makeshift garbage shirt`);

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
        while (get("_witchessFights") === 3) {
            useDefaultFamiliar();
            equip($item`unbreakable umbrella`);
            Macro.kill().setAutoAttack();
            Witchess.fightPiece($monster`Witchess Bishop`);
            setAutoAttack(0);
        }
    }
    /*
    // Professor 10x free witchess knight if on halloween
    if (get("_witchessFights") === 3 && globalOptions.halloween) {
        cliExecute("umbrella ml");
        useFamiliar($familiar`Pocket Professor`);
        equip($item`LOV Epaulettes`);
        tryEquip($item`Pocket Professor memory chip`);
        equip($slot`weapon`, $item`Fourth of May Cosplay Saber`);
        equip($item`unbreakable umbrella`);
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
*/

    libramBurn();

    if (
        storageAmount($item`magical sausage casing`) < 200 ||
        globalOptions.levelAggressively ||
        globalOptions.halloween
    ) {
        if (sausageFightGuaranteed()) {
            equip($item`Kramco Sausage-o-Matic™`);
            useFamiliar($familiar`Pocket Professor`);
            equip($item`LOV Epaulettes`);
            tryEquip($item`Pocket Professor memory chip`);
            equip($slot`weapon`, $item`Fourth of May Cosplay Saber`);
            equip($slot`acc1`, $item`hewn moon-rune spoon`);
            equip($slot`acc2`, $item`Brutal brogues`);
            equip($slot`acc3`, $item`Beach Comb`);
            equip($item`Daylight Shavings Helmet`);
            if (have($item`repaid diaper`)) equip($item`repaid diaper`);
            else tryEquip($item`Great Wolf's beastly trousers`);

            adventureMacroAuto(
                $location`Noob Cave`,
                Macro.if_("!monstername sausage goblin", Macro.abort())
                    .trySkill($skill`lecture on relativity`)
                    .kill(),
                Macro.if_("!monstername sausage goblin", Macro.abort())
                    .trySkill($skill`lecture on relativity`)
                    .kill()
            );
            while (inMultiFight()) runCombat();
            setAutoAttack(0);
        } else print("You didn't have a guaranteed sausage gobbo, weird.", "red");
    }
    tryEnsureEffect($effect`Wisdom of Others`);
    libramBurn();

    cliExecute("fold makeshift garbage shirt");
    uniform($item`makeshift garbage shirt`);

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

    libramBurn();

    tryEnsureEffect($effect`Wisdom of Others`);
    // 10 normal free NEP fights
    while (get("_neverendingPartyFreeTurns") < 10) {
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

        // TODO: once mafia isn't buggy, only cincho 9(?) times
        if (have($effect`Inner Elf`) && get("_cinchUsed", 0) < 45) {
            equip($item`Cincho de Mayo`, $slot`acc2`);
        }

        // NEP noncombat. Fight.
        else propertyManager.setChoices({ [1324]: 5 });
        if (sausageFightGuaranteed()) equip($item`Kramco Sausage-o-Matic™`);
        else equip($item`unbreakable umbrella`);
        adventureMacroAuto(
            $location`The Neverending Party`,
            Macro.externalIf(
                get("_cosmicBowlingSkillsUsed") < 3,
                Macro.trySkill($skill`Bowl Sideways`)
            )
                .if_(
                    $effect`Inner Elf`,
                    Macro.trySkill($skill`Feel Pride`).externalIf(
                        get("_cinchUsed", 0) < 45,
                        Macro.trySkill($skill`Cincho: Confetti Extravaganza`)
                    )
                )
                .kill()
        );
    }

    libramBurn();

    // now do the mob hit fight
    if (!get("_gingerbreadMobHitUsed")) {
        useDefaultFamiliar();
        adventureMacroAuto(
            $location`The Neverending Party`,
            Macro.trySkill($skill`Gingerbread Mob Hit`).abort()
        );
    }

    // now let's do the shattering punch fights
    while (get("_shatteringPunchUsed") < 3) {
        useDefaultFamiliar();
        adventureMacroAuto(
            $location`The Neverending Party`,
            Macro.trySkill($skill`Shattering Punch`).abort()
        );
    }

    // and finally let's do the remaining chest x-ray fight, saving one for gingerbread city
    if (get("_chestXRayUsed") < 2) {
        useDefaultFamiliar();
        equip($slot`acc2`, $item`Lil' Doctor™ bag`);
        adventureMacroAuto(
            $location`The Neverending Party`,
            Macro.trySkill($skill`Chest X-Ray`).abort()
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

    if (!have($item`anticheese`)) {
        if (!canAdventure($location`South of the Border`)) cliExecute(`create bitchin' meatcar`);
        if (!have($item`bitchin' meatcar`)) {
            throw "You failed to make a meatcar, and can't access the desert";
        } else visitUrl("place.php?whichplace=desertbeach&action=db_nukehouse");
    }

    if (globalOptions.debug)
        print(`DEBUG: Your mainstat at the end of levelling is ${myBasestat(myPrimestat())}`);

    // Reset location so maximizer doesn't get confused.
    setLocation($location`none`);

    if (myLevel() >= 13) {
        tryUse(1, $item`astral six-pack`);
        resources.consumeTo(3, $item`astral pilsner`);
    } else throw "You're not level 13 at the end of leveling and that is bad";
}
