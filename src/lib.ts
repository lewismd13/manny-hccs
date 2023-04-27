import {
    Effect,
    Item,
    Monster,
    Skill,
    Slot,
    Stat,
    abort,
    adv1,
    availableAmount,
    buy,
    buyUsingStorage,
    chatPrivate,
    choiceFollowsFight,
    cliExecute,
    create,
    eat,
    equip,
    equippedAmount,
    equippedItem,
    familiarWeight,
    getClanName,
    getFuel,
    getProperty,
    haveEffect,
    inMultiFight,
    mpCost,
    myClass,
    myFamiliar,
    myLevel,
    myMaxmp,
    myMp,
    myPrimestat,
    print,
    pullsRemaining,
    retrieveItem,
    runChoice,
    setProperty,
    shopAmount,
    storageAmount,
    takeShop,
    toEffect,
    toString as toStringAsh,
    totalTurnsPlayed,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
    wait,
    weightAdjustment,
} from "kolmafia";
import {
    $class,
    $effect,
    $effects,
    $familiar,
    $item,
    $location,
    $skill,
    $slot,
    $stat,
    Clan,
    CommunityService,
    adventureMacro,
    ensureEffect,
    get,
    getModifier,
    have,
    property,
    set,
} from "libram";
import { NumericProperty } from "libram/dist/propertyTypes";
import { propertyManager } from ".";
import Macro from "./combat";

export function setChoice(adv: number, choice: number) {
    setProperty(`choiceAdventure${adv}`, `${choice}`);
}

export function multiFightAutoAttack(): void {
    while (choiceFollowsFight() || inMultiFight()) {
        visitUrl("choice.php");
    }
}

export function myFamiliarWeight() {
    return familiarWeight(myFamiliar()) + weightAdjustment();
}

export function ensureItem(quantity: number, it: Item) {
    if (availableAmount(it) < quantity) {
        buy(quantity - availableAmount(it), it);
    }
    if (availableAmount(it) < quantity) {
        throw `Could not buy ${quantity} of item ${it.name}: only ${availableAmount(it)}.`;
    }
}

export function ensureCreateItem(quantity: number, it: Item) {
    if (availableAmount(it) < quantity) {
        create(quantity - availableAmount(it), it);
    }
    if (availableAmount(it) < quantity) {
        throw "Could not create item.";
    }
}

export function ensureSewerItem(quantity: number, it: Item) {
    while (availableAmount(it) < quantity) {
        ensureItem(1, $item`chewing gum on a string`);
        use(1, $item`chewing gum on a string`);
    }
}

export function ensureHermitItem(quantity: number, it: Item) {
    if (availableAmount(it) >= quantity) {
        return;
    }
    const count = quantity - availableAmount(it);
    while (
        availableAmount($item`worthless trinket`) +
            availableAmount($item`worthless gewgaw`) +
            availableAmount($item`worthless knick-knack`) <
        count
    ) {
        ensureItem(1, $item`chewing gum on a string`);
        use(1, $item`chewing gum on a string`);
    }
    ensureItem(1, $item`hermit permit`);
    retrieveItem(count, it);
}

export function ensureNpcEffect(ef: Effect, quantity: number, potion: Item) {
    if (haveEffect(ef) === 0) {
        ensureItem(quantity, potion);
        if (!cliExecute(ef.default) || haveEffect(ef) === 0) {
            throw `Failed to get effect ${ef.name}`;
        }
    } else {
        print(`Already have effect ${ef.name}.`);
    }
}

export function ensurePotionEffect(ef: Effect, potion: Item) {
    if (haveEffect(ef) === 0) {
        if (availableAmount(potion) === 0) {
            create(1, potion);
        }
        if (!cliExecute(ef.default) || haveEffect(ef) === 0) {
            throw 'Failed to get effect " + ef.name + ".';
        }
    } else {
        print(`Already have effect ${ef.name}.`);
    }
}

export function tryEnsureEffect(ef: Effect, turns = 1): void {
    if (haveEffect(ef) < turns) {
        if (!cliExecute(ef.default) || haveEffect(ef) === 0) {
            print(`Failed to get effect ${ef.name}.`);
        }
    } else {
        print(`Already have effect ${ef.name}.`);
    }
}

export function ensureMpTonic(mp: number) {
    while (myMp() < mp) {
        ensureItem(1, $item`Doc Galaktik's Invigorating Tonic`);
        use(1, $item`Doc Galaktik's Invigorating Tonic`);
    }
}

export function ensureMpSausage(mp: number) {
    while (myMp() < Math.min(mp, myMaxmp())) {
        ensureCreateItem(1, $item`magical sausage`);
        eat(1, $item`magical sausage`);
    }
}

export function sausageFightGuaranteed() {
    const goblinsFought = get("_sausageFights");
    const nextGuaranteed =
        get("_lastSausageMonsterTurn") +
        4 +
        goblinsFought * 3 +
        Math.max(0, goblinsFought - 5) ** 3;
    return goblinsFought === 0 || totalTurnsPlayed() >= nextGuaranteed;
}

export function itemPriority(...items: Item[]) {
    return items.find((item: Item) => availableAmount(item) > 0) ?? items[items.length - 1];
}

export function setClan(target: string) {
    if (getClanName() !== target) {
        const clanCache = JSON.parse(getProperty("hccs_clanCache") || "{}");
        if (clanCache.target === undefined) {
            const recruiter = visitUrl("clan_signup.php");
            const clanRe = /<option value=([0-9]+)>([^<]+)<\/option>/g;
            let match;
            while ((match = clanRe.exec(recruiter)) !== null) {
                clanCache[match[2]] = match[1];
            }
        }
        setProperty("hccs_clanCache", JSON.stringify(clanCache));

        visitUrl(`showclan.php?whichclan=${clanCache[target]}&action=joinclan&confirm=on&pwd`);
        if (getClanName() !== target) {
            throw `failed to switch clans to ${target}. Did you spell it correctly? Are you whitelisted?`;
        }
    }
    return true;
}

export function ensureDough(goal: number) {
    while (availableAmount($item`wad of dough`) < goal) {
        buy(1, $item`all-purpose flower`);
        use(1, $item`all-purpose flower`);
    }
}

export function fuelAsdon(goal: number) {
    const startingFuel = getFuel();
    if (startingFuel > goal) return startingFuel;

    print(`Fueling asdon. Currently ${startingFuel} litres.`);
    const estimated = Math.floor((goal - startingFuel) / 5);
    const bread = availableAmount($item`loaf of soda bread`);
    ensureDough(estimated - bread);
    ensureItem(estimated - bread, $item`soda water`);
    ensureCreateItem(estimated, $item`loaf of soda bread`);
    cliExecute(`asdonmartin fuel ${estimated} loaf of soda bread`);
    while (getFuel() < goal) {
        ensureDough(1);
        ensureItem(1, $item`soda water`);
        ensureCreateItem(1, $item`loaf of soda bread`);
        cliExecute("asdonmartin fuel 1 loaf of soda bread");
    }
    const endingFuel = getFuel();
    print(`Done fueling. Now ${endingFuel} litres.`);
    return endingFuel;
}

export function ensureAsdonEffect(ef: Effect) {
    if (haveEffect(ef) === 0) {
        fuelAsdon(37);
    }
    ensureEffect(ef);
}

export function tryUse(quantity: number, it: Item) {
    if (availableAmount(it) > 0) {
        return use(quantity, it);
    } else {
        return false;
    }
}

export function tryEquip(it: Item) {
    if (availableAmount(it) > 0) {
        return equip(it);
    } else {
        return false;
    }
}

export function wishEffect(ef: Effect) {
    if (haveEffect(ef) === 0) {
        cliExecute(`genie effect ${ef.name}`);
    } else {
        print(`Already have effect ${ef.name}.`);
    }
}

export function pullIfPossible(quantity: number, it: Item, maxPrice: number) {
    if (pullsRemaining() > 0) {
        const quantityPull = Math.max(0, quantity - availableAmount(it));
        if (shopAmount(it) > 0) {
            takeShop(Math.min(shopAmount(it), quantityPull), it);
        }
        if (storageAmount(it) < quantityPull) {
            buyUsingStorage(quantityPull - storageAmount(it), it, maxPrice);
        }
        cliExecute(`pull ${quantityPull} ${it.name}`);
        return true;
    } else return false;
}

export function ensurePullEffect(ef: Effect, it: Item) {
    if (haveEffect(ef) === 0) {
        if (availableAmount(it) > 0 || pullIfPossible(1, it, 50000)) ensureEffect(ef);
    }
}

export function shrug(ef: Effect) {
    if (haveEffect(ef) > 0) {
        cliExecute(`shrug ${ef.name}`);
    }
}

// We have Stevedave's, Ur-Kel's on at all times during leveling (managed via mood); third and fourth slots are variable.
const songSlots = [
    $effects`Stevedave's Shanty of Superiority`,
    $effects`Ur-Kel's Aria of Annoyance`,
    $effects`Power Ballad of the Arrowsmith, The Magical Mojomuscular Melody, The Moxious Madrigal, Ode to Booze, Jackasses' Symphony of Destruction`,
    $effects`Carlweather's Cantata of Confrontation, The Sonata of Sneakiness, Fat Leon's Phat Loot Lyric, Polka of Plenty`,
];
const allKnownSongs = ([] as Effect[]).concat(...songSlots);
const allSongs = Skill.all()
    .filter(
        (skill) => toStringAsh(skill.class as unknown as string) === "Accordion Thief" && skill.buff
    )
    .map((skill) => toEffect(skill));
export function openSongSlot(song: Effect) {
    for (const songSlot of songSlots) {
        if (songSlot.includes(song)) {
            for (const shruggable of songSlot) {
                shrug(shruggable);
            }
        }
    }
    for (const badSong of allSongs) {
        if (!allKnownSongs.includes(badSong)) {
            shrug(badSong);
        }
    }
}

export function ensureSong(ef: Effect) {
    if (haveEffect(ef) === 0) {
        openSongSlot(ef);
        if (!cliExecute(ef.default) || haveEffect(ef) === 0) {
            throw `Failed to get effect ${ef.name}`;
        }
    } else {
        print(`Already have effect ${ef.name}.`);
    }
}

export function ensureOde(turns: number) {
    while (haveEffect($effect`Ode to Booze`) < turns) {
        ensureMpTonic(50);
        openSongSlot($effect`Ode to Booze`);
        useSkill(1, $skill`The Ode to Booze`);
    }
}

export function kill() {
    return Macro.trySkill($skill`Curse of Weaksauce`)
        .trySkill($skill`Micrometeorite`)
        .trySkill($skill`Sing Along`)
        .trySkill($skill`Stuffed Mortar Shell`)
        .trySkill($skill`Saucestorm`)
        .trySkillRepeat($skill`Saucegeyser`)
        .attack();
}

function checkFax(monster: Monster): boolean {
    cliExecute("fax receive");
    if (property.getString("photocopyMonster").toLowerCase() === monster.name.toLowerCase())
        return true;
    cliExecute("fax send");
    return false;
}

export function fax(monster: Monster): void {
    if (!get("_photocopyUsed")) {
        if (checkFax(monster)) return;
        chatPrivate("cheesefax", monster.name);
        for (let i = 0; i < 3; i++) {
            wait(5 + i);
            if (checkFax(monster)) return;
        }
        abort(`Failed to acquire photocopied ${monster.name}.`);
    }
}

// shamelessly stolen from phccs
export function horse(horse: string): void {
    if (!horse.includes("horse")) horse = `${horse} horse`;
    if (get("_horsery") !== horse) cliExecute(`horsery ${horse}`);
}

export function useDefaultFamiliar(): void {
    if (
        availableAmount($item`short stack of pancakes`) === 0 &&
        haveEffect($effect`Shortly Stacked`) === 0 &&
        !CommunityService.FamiliarWeight.isDone()
    ) {
        useFamiliar($familiar`Shorter-Order Cook`);
        equip($item`tiny stillsuit`);
    } else if (
        availableAmount($item`rope`) < 1 &&
        availableAmount($item`burning newspaper`) + availableAmount($item`burning paper crane`) <
            1 &&
        !CommunityService.FamiliarWeight.isDone()
    ) {
        useFamiliar($familiar`Garbage Fire`);
        equip($item`tiny stillsuit`);
    } else {
        useFamiliar($familiar`Machine Elf`);
        equip($item`tiny stillsuit`);
    }
}

export function equalizeStat(targetStat: Stat): void {
    if (targetStat === myPrimestat()) return;
    if (myClass() === $class`Pastamancer`) {
        if (targetStat === $stat`Muscle`) {
            useSkill($skill`Bind Undead Elbow Macaroni`);
        } else if (targetStat === $stat`Moxie`) {
            useSkill($skill`Bind Penne Dreadful`);
        }
    } else {
        const potion =
            myPrimestat() === $stat`Muscle`
                ? $item`oil of stability`
                : myPrimestat() === $stat`Mysticality`
                ? $item`oil of expertise`
                : $item`oil of slipperiness`;
        const effect = getModifier("Effect", potion);
        if (have(effect)) return;

        if (potion === $item`oil of stability`) useSkill($skill`Prevent Scurvy and Sobriety`);
        else if (potion === $item`oil of expertise`) {
            throw "No support for getting a cherry... yet.";
        }
        if (!retrieveItem(potion)) {
            throw `Couldn't make potion ${potion.name}.`;
        }
        use(potion);
    }
}

export function ensureInnerElf(): void {
    if (
        haveEffect($effect`Inner Elf`) === 0 &&
        myLevel() >= 13 &&
        get("_kgbTranquilizerDartUses") + get("_snokebombUsed") < 6
    ) {
        Clan.join("Beldungeon");
        try {
            useFamiliar($familiar`Machine Elf`);
            equip($slot`acc3`, $item`Kremlin's Greatest Briefcase`);
            propertyManager.setChoices({ [326]: 1 });
            ensureEffect($effect`Blood Bubble`);
            adventureMacro(
                $location`The Slime Tube`,
                Macro.trySkill($skill`KGB tranquilizer dart`).trySkill($skill`Snokebomb`)
            );
        } finally {
            Clan.join("Alliance From Hell");
            useDefaultFamiliar();
        }
    }
}

function castBestLibram() {
    if (availableAmount($item`BRICKO eye brick`) + get("_brickoFights") < 2 && myLevel() < 14) {
        useSkill($skill`Summon BRICKOs`);
    } else if (
        availableAmount($item`green candy heart`) < 1 &&
        !get("csServicesPerformed").includes("Breed More Collies")
    ) {
        useSkill($skill`Summon Candy Heart`);
    } else if (
        availableAmount($item`lavender candy heart`) < 1 &&
        !get("csServicesPerformed").includes("Make Margaritas")
    ) {
        useSkill($skill`Summon Candy Heart`);
    } else if (
        availableAmount($item`love song of icy revenge`) < 2 &&
        !get("csServicesPerformed").includes("Breed More Collies")
    ) {
        useSkill($skill`Summon Love Song`);
    } else {
        useSkill($skill`Summon Taffy`);
    }
}

export function libramBurn(): void {
    while (myMp() / myMaxmp() > 0.4 && mpCost($skill`Summon BRICKOs`) <= myMp() - 40) {
        castBestLibram();
    }
}

export function oysterAvailable(): boolean {
    if (availableAmount($item`BRICKO eye brick`) >= 1 && availableAmount($item`BRICKO brick`) >= 8)
        return true;
    else return false;
}

export function incrementProperty(name: NumericProperty): void {
    set(name, get(name) + 1);
}

export function juneCleave(): void {
    if (get("_juneCleaverFightsLeft") > 0) return;
    equip($item`June cleaver`);
    adv1($location`Noob Cave`, -1, "");
    if (get("lastEncounter") === "Poetic Justice") useSkill($skill`Tongue of the Walrus`);
}

export function unequip(item: Item): void {
    while (equippedAmount(item) > 0) {
        const slot = Slot.all().find((equipmentSlot) => equippedItem(equipmentSlot) === item);
        if (!slot) return;
        equip(slot, $item`none`);
    }
}

export function pawWish(ef: Effect): boolean {
    // TODO: check pref for wishes left once it exists
    // eslint-disable-next-line libram/verify-constants
    if (!have($item`cursed monkey's paw`)) {
        print(`You don't have a monkey's paw`, "red");
        return false;
    }
    if (get("_monkeyPawWishesUsed") > 4) {
        print(`You don't have any monkey's paw wishes remaining`, "red");
        return false;
    }
    if (have(ef)) {
        print(`You already have ${ef.name}`, `yellow`);
        return true;
    } else {
        visitUrl(`main.php?action=cmonk&pwd`);
        runChoice(1, `wish=${ef.name}`);
        visitUrl("main.php");
        if (have(ef)) return true;
        else {
            print(`failed to wish for ${ef.name}`, `red`);
            return false;
        }
    }
}
