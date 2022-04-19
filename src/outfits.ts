import {
    abort,
    buy,
    canEquip,
    cliExecute,
    equip,
    equippedAmount,
    equippedItem,
    Familiar,
    inHardcore,
    Item,
    myFamiliar,
    Slot,
    storageAmount,
    toSlot,
    useFamiliar,
} from "kolmafia";
import { $familiar, $item, $items, $slot, $slots, have } from "libram";
import { resources } from ".";

// shamelessly stolen wholesale from https://github.com/horrible-little-slime/phccs.git

const outfitSlots = [
    "weapon",
    "offhand",
    "hat",
    "back",
    "shirt",
    "pants",
    "acc1",
    "acc2",
    "acc3",
    "familiar",
] as const;

type OutfitSlots = typeof outfitSlots[number];

type OutfitParts = Partial<{ [slot in OutfitSlots]: Item }>;
type OutfitAttempt = Partial<{ [slot in OutfitSlots]: Item | Item[] }>;

export class Outfit {
    equips: OutfitParts;
    familiar?: Familiar;

    /**
     * Construct an outfit object, for rapid equipping
     * @param equips Map of what to equip and where
     * @param familiar Optional familiar to use with outfit
     */
    constructor(equips: OutfitParts, familiar?: Familiar) {
        this.equips = equips;
        this.familiar = familiar;
    }

    dress(): void {
        if (this.familiar) useFamiliar(this.familiar);
        const targetEquipment = Object.values(this.equips);
        const accessorySlots = $slots`acc1, acc2, acc3`;
        const equipmentMap = new Map<Slot, Item>(
            Array.from(Object.entries(this.equips)).map(
                ([slotName, equipmentItem]) => [toSlot(slotName), equipmentItem] as [Slot, Item]
            )
        );
        for (const slot of $slots`weapon, offhand, hat, shirt, pants, familiar, buddy-bjorn, crown-of-thrones, back`) {
            if (
                targetEquipment.includes(equippedItem(slot)) &&
                equipmentMap.get(slot) !== equippedItem(slot)
            )
                equip(slot, $item`none`);
        }

        //Order is anchored here to prevent DFSS shenanigans
        for (const slot of $slots`weapon, offhand, hat, back, shirt, pants, familiar, buddy-bjorn, crown-of-thrones`) {
            const equipment = equipmentMap.get(slot);
            if (equipment) equip(slot, equipment);
        }

        //We don't care what order accessories are equipped in, just that they're equipped
        const accessoryEquips = accessorySlots
            .map((slot) => equipmentMap.get(slot))
            .filter((item) => item !== undefined) as Item[];
        for (const slot of accessorySlots) {
            const toEquip = accessoryEquips.find(
                (equip) =>
                    equippedAmount(equip) <
                    accessoryEquips.filter((accessory) => accessory === equip).length
            );
            if (!toEquip) break;
            const currentEquip = equippedItem(slot);
            //We never want an empty accessory slot
            if (
                currentEquip === $item`none` ||
                equippedAmount(currentEquip) >
                    accessoryEquips.filter((accessory) => accessory === currentEquip).length
            ) {
                equip(slot, toEquip);
            }
        }
    }

    /**
     * Identical to withOutfit; executes callback function with equipped outfit, and returns to original outfit
     * @param callback Function to execute
     */
    with<T>(callback: () => T): T {
        return withOutfit(this, callback);
    }

    /**
     * Makes the best outfit it can with what you've got
     * @param equips Map of what to equip and where; will use first item in array that it can, and willl not add things to outfit otherwise
     * @param familiar Optional familiar to use with outfit
     */
    static doYourBest(equips: OutfitAttempt, familiar?: Familiar): Outfit {
        const fit: OutfitParts = {};
        for (const slotName of outfitSlots) {
            const itemOrItems = equips[slotName];
            if (!itemOrItems) continue;

            const itemChoice = Array.isArray(itemOrItems)
                ? itemOrItems.find(
                      (item) =>
                          have(item) && (toSlot(slotName) === $slot`familiar` || canEquip(item))
                  )
                : itemOrItems;
            if (itemChoice) fit[slotName] = itemChoice;
        }
        return new Outfit(fit, familiar);
    }

    /**
     * Saves current outfit as an Outfit
     * @param withFamiliar Option to store current familiar as part of outfit
     */
    static current(withFamiliar = false): Outfit {
        const familiar = withFamiliar ? myFamiliar() : undefined;
        const fit: OutfitParts = {};
        for (const slotName of outfitSlots) {
            const slot = toSlot(slotName);
            const item = equippedItem(slot);
            if (item !== $item`none`) fit[slotName] = item;
        }
        return new Outfit(fit, familiar);
    }
}

/**
 * Execute callback while wearing given outfit
 * Then return to what you were previously wearing
 * @param outfit Outfit to use
 * @param callback Function to execute
 */
export function withOutfit<T>(outfit: Outfit, callback: () => T): T {
    const withFamiliar = outfit.familiar !== undefined;
    const cachedOutfit = Outfit.current(withFamiliar);
    outfit.dress();
    try {
        return callback();
    } finally {
        cachedOutfit.dress();
    }
}

export default function uniform(...changes: (Item | [Item, Slot])[]): void {
    const defaultUniform = {
        hat: $item`Iunion Crown`,
        shirt: $item`fresh coat of paint`,
        pants: $items`pantogram pants, Cargo Cultist Shorts, old sweatpants`,
        weapon: $item`Fourth of May Cosplay Saber`,
        offhand: $items`unbreakable umbrella, familiar scrapbook`,
        acc1: $items`meteorite necklace, your cowboy boots`,
        acc2: $items`Powerful Glove`,
        acc3: $items`battle broom, Retrospecs`,
        back: $items`LOV Epaulettes, vampyric cloake`,
        familiar: null,
    };

    const alterations = Object.fromEntries(
        changes.map((change) => {
            const slot = Array.isArray(change) ? change[1] : toSlot(change);
            const slotName =
                outfitSlots.find((element) => toSlot(element) === slot) ??
                abort("invalid slot for outfit");
            const equipment = Array.isArray(change) ? change[0] : change;
            return [slotName, equipment];
        })
    ) as OutfitAttempt;

    const chosenOutfit: OutfitAttempt = {};
    for (const slotName of outfitSlots) {
        const itemOrItems = alterations[slotName] ?? defaultUniform[slotName];
        if (itemOrItems) chosenOutfit[slotName] = itemOrItems;
    }
    Outfit.doYourBest(chosenOutfit).dress();
}

export function wireOutfit(): void {
    new Outfit({
        hat: $item`Iunion Crown`,
        shirt: $item`fresh coat of paint`,
        pants: $item`Cargo Cultist Shorts`,
        weapon: $item`Fourth of May Cosplay Saber`,
        offhand: $item`familiar scrapbook`,
        acc1: $item`Eight Days a Week Pill Keeper`,
        acc2: $item`Powerful Glove`,
        acc3: $item`Guzzlr tablet`,
    }).dress();
}

export function moxieOutfit(): void {
    cliExecute("retrocape robot");
    Outfit.doYourBest({
        hat: $item`very pointy crown`,
        shirt: $items`shoe ad T-shirt, fresh coat of paint`,
        back: $item`unwrapped knock-off retro superhero cape`,
        weapon: $item`Fourth of May Cosplay Saber`,
        pants: $item`Cargo Cultist Shorts`,
        acc1: $item`Beach Comb`,
        acc2: $item`"I Voted!" sticker`,
        acc3: $item`Retrospecs`,
        familiar: $item`miniature crystal ball`,
    }).dress();
}

export function hpOutfit(): void {
    cliExecute("retrocape vampire");
    if (!have($item`wad of used tape`)) cliExecute("fold wad of used tape");
    Outfit.doYourBest({
        hat: $item`wad of used tape`,
        weapon: $item`dented scepter`,
        offhand: $item`Fourth of May Cosplay Saber`,
        shirt: $items`shoe ad T-shirt, fresh coat of paint`,
        back: $item`unwrapped knock-off retro superhero cape`,
        pants: $item`Cargo Cultist Shorts`,
        acc1: $item`Brutal brogues`,
        acc2: $item`Retrospecs`,
        acc3: $item`Kremlin's Greatest Briefcase`,
        familiar: $item`miniature crystal ball`,
    }).dress();
}

export function muscleOutfit(): void {
    cliExecute("retrocape vampire");
    if (!have($item`wad of used tape`)) cliExecute("fold wad of used tape");
    Outfit.doYourBest(
        {
            hat: $item`wad of used tape`,
            weapon: $item`dented scepter`,
            offhand: have($familiar`Disembodied Hand`)
                ? $items`cosmetic football`
                : $item`Fourth of May Cosplay Saber`,
            shirt: $items`shoe ad T-shirt, fresh coat of paint`,
            back: $item`unwrapped knock-off retro superhero cape`,
            pants: $item`Cargo Cultist Shorts`,
            acc1: $item`Brutal brogues`,
            acc2: $item`Retrospecs`,
            acc3: $item`Kremlin's Greatest Briefcase`,
            familiar: have($familiar`Disembodied Hand`)
                ? $item`Fourth of May Cosplay Saber`
                : $item`miniature crystal ball`,
        },
        have($familiar`Disembodied Hand`) ? $familiar`Disembodied Hand` : undefined
    ).dress();
}

export function mysticalityOutfit(): void {
    cliExecute("retrocape heck");
    Outfit.doYourBest(
        {
            hat: $item`wad of used tape`,
            weapon: $item`Fourth of May Cosplay Saber`,
            offhand: $item`astral statuette`,
            back: $item`unwrapped knock-off retro superhero cape`,
            shirt: $items`denim jacket, shoe ad T-shirt, fresh coat of paint`,
            pants: $items`pantogram pants, Cargo Cultist Shorts`,
            acc1: $item`your cowboy boots`,
            acc2: $item`Retrospecs`,
            acc3: $item`battle broom`,
            familiar: $items`Abracandalabra`,
        },
        $familiar`Left-Hand Man`
    ).dress();
}

export function itemOutfit(): void {
    if (!have($item`wad of used tape`)) cliExecute("fold wad of used tape");
    Outfit.doYourBest(
        {
            hat: $item`wad of used tape`,
            weapon: $items`extra-large utility candle`,
            offhand: $item`unbreakable umbrella`,
            back: $item`protonic accelerator pack`,
            acc1: $item`Guzzlr tablet`,
            acc2: $item`gold detective badge`,
            acc3: $items`government-issued night-vision goggles`,
            familiar: $item`li'l ninja costume`,
        },
        $familiar`Trick-or-Treating Tot`
    ).dress();
}

export function hotresOutfit(): void {
    cliExecute("retrocape vampire hold");
    Outfit.doYourBest(
        {
            back: $item`unwrapped knock-off retro superhero cape`,
            weapon: $item`Fourth of May Cosplay Saber`,
            offhand: $item`industrial fire extinguisher`,
            pants: $items`pantogram pants, Cargo Cultist Shorts`,
            acc1: $item`your cowboy boots`,
            acc2: $item`Brutal brogues`,
            acc3: $item`Kremlin's Greatest Briefcase`,
        },
        $familiar`Exotic Parrot`
    ).dress();
}

export function noncombatOutfit(): void {
    Outfit.doYourBest(
        {
            hat: $item`very pointy crown`,
            back: $item`protonic accelerator pack`,
            weapon: $item`Fourth of May Cosplay Saber`,
            offhand: $items`unbreakable umbrella`,
            acc1: $item`Kremlin's Greatest Briefcase`,
            acc2: $items`hewn moon-rune spoon`,
            acc3: $item`Brutal brogues`,
        },
        $familiar`Disgeist`
    ).dress();
}

export function famweightOutfit(): void {
    if (!inHardcore()) {
        if (storageAmount($item`Snow Suit`)) resources.pull($item`Snow Suit`, 0);
        if (storageAmount($item`repaid diaper`)) resources.pull($item`repaid diaper`, 0);
        if (have($item`Snow Suit`) && storageAmount($item`moveable feast`)) {
            resources.pull($item`moveable feast`, 0);
            useFamiliar($familiar`Blood-Faced Volleyball`);
            equip($item`moveable feast`);
        }
    }

    const familiarAndEquip = have($item`Snow Suit`)
        ? { fam: $familiar`Blood-Faced Volleyball`, equip: $item`Snow Suit` }
        : have($item`cracker`)
        ? { fam: $familiar`Exotic Parrot`, equip: $item`cracker` }
        : have($familiar`Baby Bugged Bugbear`)
        ? { fam: $familiar`Baby Bugged Bugbear`, equip: $item`bugged beanie` }
        : {
              fam: $familiar`Blood-Faced Volleyball`,
              equip: $items`astral pet sweater`,
          };

    Outfit.doYourBest(
        {
            hat: $item`Daylight Shavings Helmet`,
            weapon: $item`Fourth of May Cosplay Saber`,
            offhand: $items`burning paper crane, familiar scrapbook`,
            pants: $items`repaid diaper, Great Wolf's beastly trousers, Cargo Cultist Shorts`,
            acc1: $item`Beach Comb`,
            acc2: $item`Brutal brogues`,
            acc3: $item`hewn moon-rune spoon`,
            familiar: familiarAndEquip.equip,
        },
        familiarAndEquip.fam
    ).dress();
}

export function weaponOutfit(): void {
    if (!have($item`broken champagne bottle`)) cliExecute("fold broken champagne bottle");

    if (!inHardcore()) resources.pull($item`Stick-Knife of Loathing`, 0);

    Outfit.doYourBest(
        {
            hat: $items`seal-skull helmet`,
            weapon: $item`broken champagne bottle`,
            offhand: $item`dented scepter`,
            acc1: $item`Brutal brogues`,
            acc2: $item`Kremlin's Greatest Briefcase`,
            acc3: $items`meteorite ring, Powerful Glove`,
            familiar: $items`Stick-Knife of Loathing`,
        },
        $familiar`Disembodied Hand`
    ).dress();
}

export function spellOutfit(): void {
    if (!have($item`Abracandalabra`) && !have($item`obsidian nutcracker`) && inHardcore()) {
        buy($item`obsidian nutcracker`);
    }

    if (!inHardcore()) resources.pull($item`Staff of the Roaring Hearth`, 0);

    const { familiar, famEquip } = {
        familiar: $familiar`Disembodied Hand`,
        famEquip: $items`Stick-Knife of Loathing`,
    };

    Outfit.doYourBest(
        {
            hat: $items`sugar chapeau, Hollandaise helmet`,
            weapon: $items`Staff of the Roaring Hearth, weeping willow wand`,
            offhand: [
                $item`Abracandalabra`,
                ...(inHardcore()
                    ? $items`weeping willow wand, astral statuette`
                    : $items`obsidian nutcracker`),
            ],
            familiar: famEquip,
            pants: $items`pantogram pants, Cargo Cultist Shorts`,
            acc1: $items`meteorite necklace, Kremlin's Greatest Briefcase`,
            acc2: $item`Powerful Glove`,
            acc3: $item`battle broom`,
        },
        familiar
    ).dress();
}
