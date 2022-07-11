import {
    autosell,
    availableAmount,
    buy,
    cliExecute,
    cliExecuteOutput,
    containsText,
    create,
    eat,
    equip,
    getProperty,
    handlingChoice,
    haveEffect,
    inHardcore,
    logprint,
    maximize,
    mpCost,
    myBasestat,
    myBuffedstat,
    myClass,
    myGardenType,
    myHp,
    myLevel,
    myMaxhp,
    myMp,
    mySpleenUse,
    numericModifier,
    print,
    retrieveItem,
    runChoice,
    setAutoAttack,
    setProperty,
    sweetSynthesis,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $class,
    $classes,
    $coinmaster,
    $effect,
    $familiar,
    $item,
    $items,
    $location,
    $monster,
    $skill,
    $slot,
    $stat,
    adventureMacro,
    adventureMacroAuto,
    AsdonMartin,
    CombatLoversLocket,
    CommunityService,
    ensureEffect,
    get,
    have,
    set,
    SongBoom,
} from "libram";
import { propertyManager, resources } from ".";
import Macro from "./combat";
import {
    ensureCreateItem,
    ensureInnerElf,
    ensureItem,
    ensureMpSausage,
    ensureMpTonic,
    ensureNpcEffect,
    ensurePotionEffect,
    ensureSewerItem,
    ensureSong,
    equalizeStat,
    incrementProperty,
    setChoice,
    tryEnsureEffect,
    tryUse,
    useDefaultFamiliar,
} from "./lib";
import { globalOptions } from "./options";
import uniform, {
    famweightOutfit,
    hotresOutfit,
    hpOutfit,
    itemOutfit,
    moxieOutfit,
    muscleOutfit,
    mysticalityOutfit,
    noncombatOutfit,
    spellOutfit,
    weaponOutfit,
    wireOutfit,
} from "./outfits";

export function coilPrep() {
    if (myLevel() === 1 && mySpleenUse() === 0) {
        while (get("_universeCalculated") < get("skillLevel144")) {
            cliExecute("numberology 69");
        }
    }

    if (get("_deckCardsDrawn") < 5) resources.deck("1952");
    autosell(1, $item`1952 Mickey Mantle card`);

    // Buy toy accordion
    ensureItem(1, $item`toy accordion`);

    if (!get("_chateauDeskHarvested")) {
        // Chateau piggy bank
        visitUrl("place.php?whichplace=chateau&action=chateau_desk1");
    }

    // Upgrade saber for fam wt
    if (get("_saberMod") === 0) {
        visitUrl("main.php?action=may4");
        runChoice(4);
    }

    // Vote.
    if (get("_voteModifier") === "") {
        visitUrl("place.php?whichplace=town_right&action=townright_vote");
        visitUrl("choice.php?option=1&whichchoice=1331&g=2&local%5B%5D=1&local%5B%5D=2");
        // Make sure initiative-tracking works.
        visitUrl("place.php?whichplace=town_right&action=townright_vote");
    }

    // pick garden for synth.
    if (myGardenType() === "peppermint") {
        cliExecute("garden pick");
    } else {
        print(
            "WARNING: This script is built for peppermint garden. Switch gardens or find other candy.",
            "red"
        );
    }

    // Initialize bird calendar
    use(1, $item`Bird-a-Day calendar`);

    // get cowboy boots
    visitUrl("place.php?whichplace=town_right&action=townright_ltt");

    // Sell pork gems + tent
    visitUrl("tutorial.php?action=toot");
    tryUse(1, $item`letter from King Ralph XI`);
    tryUse(1, $item`pork elf goodies sack`);
    autosell(5, $item`baconstone`);
    autosell(5, $item`hamethyst`);

    // get things to cast buffs
    ensureSewerItem(1, $item`turtle totem`);
    ensureSewerItem(1, $item`saucepan`);

    // Detective Agency for NC test
    // requires Ezandora's script
    // shouldn't need this if we have the PM bird, but we still want detective badge
    if (get("_detectiveCasesCompleted") < 3 && myClass() !== $class`Pastamancer`)
        cliExecute("detective solver");
    else visitUrl("place.php?whichplace=town_wrong&action=townwrong_precinct");

    // Set doc bag choice
    setChoice(1340, 3);

    if (!get("_borrowedTimeUsed")) {
        if (!have($item`borrowed time`)) resources.clipArt($item`borrowed time`);
        use($item`borrowed time`);
    }

    if (!have($item`dromedary drinking helmet`) && get("tomeSummons") < 3) {
        resources.clipArt($item`box of Familiar Jacks`);
        useFamiliar($familiar`Melodramedary`);
        use($item`box of Familiar Jacks`);
    }

    // fight a ghost and kramco before coiling
    function firstFights() {
        uniform(
            ...$items`protonic accelerator pack, Daylight Shavings Helmet, Kramco Sausage-o-Matic™`
        );
        useDefaultFamiliar();
        adventureMacroAuto(
            $location`Noob Cave`,
            Macro.skill($skill`Micrometeorite`)
                .item($item`Time-Spinner`)
                .attack()
                .repeat()
        );

        if (have($item`magical sausage casing`)) {
            create(1, $item`magical sausage`);
        }
        if (have($item`magical sausage`)) {
            eat(1, $item`magical sausage`);
        }

        const ghostLocation = get("ghostLocation");
        if (ghostLocation) {
            uniform(...$items`latte lovers member's mug, protonic accelerator pack`);
            useDefaultFamiliar();
            adventureMacro(
                ghostLocation,
                Macro.skill($skill`Micrometeorite`)
                    .item($item`Time-Spinner`)
                    .skill($skill`Curse of Weaksauce`)
                    .trySkill($skill`Shoot Ghost`)
                    .trySkill($skill`Shoot Ghost`)
                    .trySkill($skill`Shoot Ghost`)
                    .trySkill($skill`Trap Ghost`)
            );
        }
    }

    firstFights();

    visitUrl("council.php");
    wireOutfit();
}

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

export function mysPrep() {
    ensureEffect($effect`Song of Bravado`);
    ensureSong($effect`Stevedave's Shanty of Superiority`);
    ensureEffect($effect`Quiet Judgement`);
    ensureNpcEffect($effect`Glittering Eyelashes`, 5, $item`glittery mascara`);

    mysticalityOutfit();
    if (globalOptions.debug) {
        logprint(cliExecuteOutput("modtrace mys"));
    }
}

export function nonCombatPrep() {
    if (getProperty("_horsery") !== "dark horse") cliExecute("horsery dark");

    if (myHp() < 30) useSkill(1, $skill`Cannelloni Cocoon`);
    ensureEffect($effect`Blood Bond`);
    ensureEffect($effect`Leash of Linguini`);
    ensureEffect($effect`Empathy`);

    equip($slot`acc2`, $item`Powerful Glove`);

    ensureEffect($effect`The Sonata of Sneakiness`);
    ensureEffect($effect`Smooth Movements`);
    ensureEffect($effect`Invisible Avatar`);
    ensureEffect($effect`Silent Running`);
    ensureEffect($effect`Feeling Lonely`);

    useFamiliar($familiar`Disgeist`);

    if (globalOptions.workshed === "Asdon") AsdonMartin.drive($effect`Driving Stealthily`, 1);

    // Without the PM bird, we need shoe gum
    if (myClass() !== $class`Pastamancer`)
        ensurePotionEffect($effect`Gummed Shoes`, $item`shoe gum`);

    // Pastamancer d1 is -combat.
    if (myClass() === $class`Pastamancer`) ensureEffect($effect`Blessing of the Bird`);

    cliExecute("umbrella nc");

    noncombatOutfit();

    // Rewards
    ensureEffect($effect`Throwing Some Shade`);
    if (globalOptions.debug) {
        logprint(cliExecuteOutput("modtrace combat rate"));
    }
}

export function hotResPrep() {
    ensureMpTonic(500);

    useFamiliar($familiar`Exotic Parrot`);

    // These should have fallen through all the way from leveling.
    ensureEffect($effect`Fidoxene`);
    ensureEffect($effect`Do I Know You From Somewhere?`);
    ensureEffect($effect`Puzzle Champ`);
    ensureEffect($effect`Billiards Belligerence`);
    ensureEffect($effect`Astral Shell`);
    ensureEffect($effect`Elemental Saucesphere`);
    cliExecute(`smash ${availableAmount($item`ratty knitted cap`)} ratty knitted cap`);

    while (
        have($skill`Deep Dark Visions`) &&
        haveEffect($effect`Visions of the Deep Dark Deeps`) < 50
    ) {
        if (myMp() < 20) {
            ensureCreateItem(1, $item`magical sausage`);
            eat(1, $item`magical sausage`);
        }
        while (myHp() < myMaxhp()) {
            useSkill(1, $skill`Cannelloni Cocoon`);
        }
        if (myMp() < 100) {
            ensureCreateItem(1, $item`magical sausage`);
            eat(1, $item`magical sausage`);
        }
        if (Math.round(numericModifier("spooky resistance")) < 10) {
            ensureEffect($effect`Does It Have a Skull In There??`);
            if (Math.round(numericModifier("spooky resistance")) < 10) {
                throw "Not enough spooky res for Deep Dark Visions.";
            }
        }
        useSkill(1, $skill`Deep Dark Visions`);
    }

    if (!have($effect`Fireproof Foam Suit`)) {
        equip($slot`weapon`, $item`industrial fire extinguisher`);
        equip($slot`off-hand`, $item`Fourth of May Cosplay Saber`);
        equip($item`vampyric cloake`);
        propertyManager.setChoices({ [1387]: 3 });
        adventureMacro(
            $location`The Dire Warren`,
            Macro.skill($skill`Become a Cloud of Mist`)
                .skill($skill`Fire Extinguisher: Foam Yourself`)
                .skill($skill`Use the Force`)
        );
        resources.saberForces.push($effect`Fireproof Foam Suit`);
        if (have($effect`Fireproof Foam Suit`))
            set("_fireExtinguisherCharge", get("_fireExtinguisherCharge") - 10);
    }

    if (
        availableAmount($item`sleaze powder`) > 0 ||
        availableAmount($item`lotion of sleaziness`) > 0
    ) {
        ensurePotionEffect($effect`Sleazy Hands`, $item`lotion of sleaziness`);
    }

    ensureEffect($effect`Feeling Peaceful`);

    useFamiliar($familiar`Exotic Parrot`);

    // Mafia sometimes can't figure out that multiple +weight things would get us to next tier.
    hotresOutfit();
    if (globalOptions.debug) {
        logprint(cliExecuteOutput("modtrace hot res"));
    }
}

export function famWtPrep() {
    if (myHp() < 30) useSkill(1, $skill`Cannelloni Cocoon`);
    ensureEffect($effect`Blood Bond`);
    ensureEffect($effect`Leash of Linguini`);
    ensureEffect($effect`Empathy`);

    // These should have fallen through all the way from leveling.
    ensureEffect($effect`Fidoxene`);
    ensureEffect($effect`Do I Know You From Somewhere?`);
    ensureEffect($effect`Puzzle Champ`);
    ensureEffect($effect`Billiards Belligerence`);
    tryEnsureEffect($effect`Shortly Stacked`);

    // NC reward
    ensureEffect($effect`Robot Friends`);
    if (inHardcore()) {
        useFamiliar($familiar`Baby Bugged Bugbear`);
        visitUrl("arena.php");
    }

    // use freeruns at gingerbread city to get gingerbread spice latte
    if (
        haveEffect($effect`Whole Latte Love`) === 0 &&
        availableAmount($item`gingerbread spice latte`) === 0
    ) {
        useFamiliar($familiar`Chocolate Lab`);
        // TODO: get rid of this maximize call
        maximize("sprinkle drop", false);
        if (!get("_gingerbreadClockAdvanced")) {
            visitUrl("adventure.php?snarfblat=477");
            runChoice(1);
        }
        if (availableAmount($item`sprinkles`) < 50) {
            equip($slot`acc1`, $item`Lil' Doctor™ bag`);
            adventureMacroAuto(
                $location`Gingerbread Upscale Retail District`,
                Macro.if_(
                    "monstername gingerbread gentrifier",
                    Macro.skill($skill`Macrometeorite`)
                ).skill($skill`Chest X-Ray`)
            );
            setAutoAttack(0);
        }
        if (availableAmount($item`sprinkles`) >= 50) {
            useFamiliar($familiar`Frumious Bandersnatch`);
            ensureEffect($effect`Ode to Booze`);
            setChoice(1208, 3);
            while (
                availableAmount($item`gingerbread spice latte`) === 0 &&
                haveEffect($effect`Whole Latte Love`) === 0
            ) {
                adventureMacro($location`Gingerbread Upscale Retail District`, Macro.runaway());
            }
        } else {
            throw "Something went wrong getting sprinkles";
        }
        use($item`gingerbread spice latte`);
        useDefaultFamiliar();
    }

    if (haveEffect($effect`Meteor Showered`) === 0) {
        equip($item`Fourth of May Cosplay Saber`);
        useFamiliar($familiar`none`);
        adventureMacro(
            $location`The Dire Warren`,
            Macro.skill($skill`Meteor Shower`).skill($skill`Use the Force`)
        );
        if (haveEffect($effect`Meteor Showered`) > 0) incrementProperty("_meteorShowerUses");
        resources.saberForces.push($effect`Meteor Showered`);
    }

    // make a crane if we have one
    if (
        availableAmount($item`burning newspaper`) > 0 &&
        availableAmount($item`burning paper crane`) < 1
    ) {
        cliExecute("create 1 burning paper crane");
    }

    // try to get a green heart
    if (!have($item`green candy heart`) && !have($effect`Heart of Green`)) {
        while (mpCost($skill`Summon Candy Heart`) <= myMp() && !have($item`green candy heart`)) {
            useSkill($skill`Summon Candy Heart`);
        }

        if (myMp() < mpCost($skill`Summon Candy Heart`) && !have($item`green candy heart`)) {
            ensureMpSausage(1);

            while (
                mpCost($skill`Summon Candy Heart`) <= myMp() &&
                !have($item`green candy heart`)
            ) {
                useSkill($skill`Summon Candy Heart`);
            }
        }
    }

    tryEnsureEffect($effect`Heart of Green`);

    famweightOutfit();
    if (globalOptions.debug) {
        print(
            `debug: your short order cook charges were at ${get(
                "_shortOrderCookCharge"
            )} charges and your trash fire is at ${get("garbageFireProgress")}`
        );
        logprint(cliExecuteOutput("modtrace familiar weight"));
    }
}

export function WeaponPrep() {
    if (haveEffect($effect`Do You Crush What I Crush?`) === 0) {
        useFamiliar($familiar`Ghost of Crimbo Carols`);
        adventureMacro($location`The Dire Warren`, Macro.skill($skill`Feel Hatred`));
    }

    if (
        $classes`Seal Clubber, Pastamancer`.includes(myClass()) &&
        haveEffect($effect`Saucefingers`) + haveEffect($effect`Elbow Sauce`) === 0
    ) {
        useFamiliar($familiar`Mini-Adventurer`);
        equip($item`latte lovers member's mug`);
        setChoice(768, 4); // Make mini-adv a Sauceror.
        if (get("miniAdvClass") !== 4) {
            if (get("_latteBanishUsed")) throw "Latte banish used!";
            adventureMacro(
                $location`The Dire Warren`,
                Macro.skill($skill`Throw Latte on Opponent`)
            );
        }
        if (get("_latteBanishUsed")) throw "Latte banish used!";
        adventureMacro($location`The Dire Warren`, Macro.skill($skill`Throw Latte on Opponent`));
    }

    ensureEffect($effect`Carol of the Bulls`);
    ensureEffect($effect`Song of the North`);
    ensureEffect($effect`Rage of the Reindeer`);
    ensureEffect($effect`Frenzied, Bloody`);
    ensureEffect($effect`Scowl of the Auk`);
    if (myClass() !== $class`Turtle Tamer`) ensureEffect($effect`Disdain of the War Snapper`);
    ensureEffect($effect`Tenacity of the Snapper`);
    ensureSong($effect`Jackasses' Symphony of Destruction`);

    ensureEffect($effect`Billiards Belligerence`);

    // Beach Comb
    if (!containsText(getProperty("_beachHeadsUsed"), "6")) {
        ensureEffect($effect`Lack of Body-Building`);
    }

    if (availableAmount($item`LOV Elixir #3`) > 0) ensureEffect($effect`The Power of LOV`);

    // Pastamancer d1 is weapon damage.
    ensureEffect($effect`Blessing of the Bird`);
    tryEnsureEffect($effect`Blessing of your favorite Bird`);

    if (myClass() === $class`Seal Clubber`) {
        cliExecute("barrelprayer buff");
    }

    ensureInnerElf();

    // free run from fluffy bunny for crimbo ghost buff
    if (!have($effect`Do You Crush What I Crush?`)) {
        useFamiliar($familiar`Ghost of Crimbo Carols`);
        equip($slot`acc3`, $item`Lil' Doctor™ bag`);
        adventureMacroAuto($location`The Dire Warren`, Macro.skill($skill`Reflex Hammer`));
    }

    // fax ungulith (Saber YR)
    if (!have($item`corrupted marrow`) && !have($effect`Cowrruption`)) {
        useFamiliar($familiar`Melodramedary`);
        equip($item`Fourth of May Cosplay Saber`, $slot`weapon`);
        setChoice(1387, 3);
        Macro.skill($skill`Meteor Shower`)
            .skill($skill`%fn\, spit on me!`)
            .skill($skill`Use the Force`)
            .setAutoAttack();
        if (CombatLoversLocket.availableLocketMonsters().includes($monster`ungulith`)) {
            CombatLoversLocket.reminisce($monster`ungulith`);
        } else {
            throw "You don't have ungulith in your locket, and you don't have corrupted marrow, so that's bad.";
        }
        if (handlingChoice()) runChoice(-1);
        if (have($item`corrupted marrow`)) {
            set("_locketMonstersFought", `1932,${get("_locketMonstersFought")}`);
            resources.lockets.push($monster`ungulith`);
            resources.saberForces.push($effect`Meteor Showered`);
        }
        if (have($effect`Spit Upon`) && get("camelSpit") === 100) setProperty("camelSpit", "0");
        if (have($effect`Meteor Showered`)) set("_meteorShowerUses", 1 + get("_meteorShowerUses"));
        setAutoAttack(0);
        useDefaultFamiliar();
    }

    // Corrupted marrow
    ensureEffect($effect`Cowrruption`);

    SongBoom.setSong("These Fists Were Made for Punchin'");

    ensureEffect($effect`Bow-Legged Swagger`);

    weaponOutfit();
    if (globalOptions.debug) {
        logprint(cliExecuteOutput("modtrace weapon damage"));
    }
}

export function spellPrep() {
    ensureEffect($effect`Simmering`);
    ensureEffect($effect`Song of Sauce`);
    ensureEffect($effect`Carol of the Hells`);
    tryEnsureEffect($effect`Arched Eyebrow of the Archmage`);
    ensureSong($effect`Jackasses' Symphony of Destruction`);

    if (!get("grimoire3Summons") && have($skill`Summon Alice's Army Cards`)) {
        useSkill(1, $skill`Summon Alice's Army Cards`);
        buy($coinmaster`Game Shoppe Snacks`, 1, $item`tobiko marble soda`);
    }

    ensureEffect($effect`Pisces in the Skyces`);

    // Pool buff
    if (get("_poolGames") < 3) ensureEffect($effect`Mental A-cue-ity`);

    // Beach Comb
    ensureEffect($effect`We're All Made of Starfish`);

    // Tea party
    // TODO: Is this the hatter buff we want?
    if (!get("_madTeaParty")) {
        visitUrl("clan_viplounge.php?action=lookingglass&whichfloor=2");
        retrieveItem($item`mariachi hat`);
        ensureEffect($effect`Full Bottle in front of Me`);
    }

    useSkill(1, $skill`Spirit of Cayenne`);

    if (availableAmount($item`flask of baconstone juice`) > 0) {
        ensureEffect($effect`Baconstoned`);
    }

    if (myClass() === $class`Sauceror`) {
        cliExecute("barrelprayer buff");
    }

    ensureInnerElf();

    if (haveEffect($effect`Meteor Showered`) === 0 && get("_meteorShowerUses") < 5) {
        useFamiliar($familiar`Machine Elf`);
        equip($item`Fourth of May Cosplay Saber`);
        adventureMacroAuto(
            $location`The Dire Warren`,
            Macro.skill($skill`Meteor Shower`).skill($skill`Use the Force`)
        );
        if (haveEffect($effect`Meteor Showered`) > 0) incrementProperty("_meteorShowerUses");
        resources.saberForces.push($effect`Meteor Showered`);
    }

    // Sigils of Yeg = 200% SD
    if (!get("_cargoPocketEmptied") && !have($effect`Sigils of Yeg`)) {
        if (!have($item`Yeg's Motel hand soap`)) cliExecute("cargo 177");
        ensureEffect($effect`Sigils of Yeg`);
    }

    if (availableAmount($item`LOV Elixir #6`) > 0) ensureEffect($effect`The Magic of LOV`);

    // Get flimsy hardwood scraps.
    visitUrl("shop.php?whichshop=lathe");
    if (availableAmount($item`flimsy hardwood scraps`) > 0) {
        retrieveItem(1, $item`weeping willow wand`);
    }

    useFamiliar($familiar`Left-Hand Man`);

    spellOutfit();
    if (globalOptions.debug) {
        logprint(cliExecuteOutput("modtrace spell damage"));
    }
}

export function itemPrep() {
    ensureMpSausage(500);

    useFamiliar($familiar`Trick-or-Treating Tot`);
    while (haveEffect($effect`Bat-Adjacent Form`) === 0) {
        propertyManager.setChoices({ [1324]: 5 });
        if (have($effect`Feeling Lost`)) throw "You have teleportitis, this will go badly for you";
        if (get("_reflexHammerUsed") >= 3) throw "Out of reflex hammers!";
        equip($item`vampyric cloake`);
        equip($slot`acc3`, $item`Lil' Doctor™ bag`);
        adventureMacro(
            $location`The Neverending Party`,
            Macro.skill($skill`Become a Bat`)
                .trySkill($skill`Bowl Straight Up`)
                .skill($skill`Reflex Hammer`)
        );
    }

    ensureEffect($effect`Fat Leon's Phat Loot Lyric`);
    ensureEffect($effect`Singer's Faithful Ocelot`);
    ensureEffect($effect`The Spirit of Taking`);
    tryEnsureEffect($effect`Heart of Lavender`);

    if (haveEffect($effect`Synthesis: Collection`) === 0) {
        use(1, $item`peppermint sprout`);
        sweetSynthesis($item`peppermint sprout`, $item`peppermint twist`);
    }

    if (globalOptions.workshed === "Asdon") AsdonMartin.drive($effect`Driving Observantly`, 1);

    if (myClass() === $class`Pastamancer`) {
        cliExecute("barrelprayer buff");
    }

    cliExecute("umbrella item");

    ensureEffect($effect`Steely-Eyed Squint`);

    // only get Feeling Lost if this is the last test of the run
    // TODO: figure out a final check here to make it not get the buff unless it will get the test to 1 turn
    if (get("csServicesPerformed").split(",").length === 10) ensureEffect($effect`Feeling Lost`);

    itemOutfit();
    if (globalOptions.debug) {
        logprint(cliExecuteOutput("modtrace item"));
        logprint(cliExecuteOutput("modtrace booze"));
    }
}
