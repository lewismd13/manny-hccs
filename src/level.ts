import {
  autosell,
  availableAmount,
  cliExecute,
  containsText,
  create,
  equip,
  handlingChoice,
  itemAmount,
  mpCost,
  myBasestat,
  myPrimestat,
  print,
  retrieveItem,
  runChoice,
  runCombat,
  setAutoAttack,
  setLocation,
  totalFreeRests,
  toUrl,
  use,
  useFamiliar,
  useSkill,
  visitUrl,
} from "kolmafia";
import {
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
  Macro,
  Mood,
  TunnelOfLove,
  Witchess,
} from "libram";
import { resources } from ".";
import { withMacro } from "./hccs";
import {
  ensureMpTonic,
  ensureNpcEffect,
  ensurePotionEffect,
  mapMonster,
  sausageFightGuaranteed,
  setChoice,
  tryEquip,
  tryUse,
  useDefaultFamiliar,
} from "./lib";
import { globalOptions } from "./options";

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

  if (!have($item`dromedary drinking helmet`) && get("tomeSummons") < 3) {
    resources.clipArt($item`box of Familiar Jacks`);
    useFamiliar($familiar`Melodramedary`);
    use($item`box of Familiar Jacks`);
  }

  ensureOutfit("CS Leveling");

  if (availableAmount($item`li'l ninja costume`) === 0) {
    if (
      !have($item`tomato`) &&
      !have($item`tomato juice of powerful power`) &&
      !have($effect`Tomato Power`) &&
      get("lastCopyableMonster") !== $monster`possessed can of tomatoes`
    ) {
      equip($slot`off-hand`, $item`none`);
      equip($slot`acc3`, $item`Lil' Doctor™ bag`);
      withMacro(Macro.skill($skill`Reflex Hammer`), () => {
        useDefaultFamiliar();
        mapMonster($location`The Haunted Pantry`, $monster`possessed can of tomatoes`);
        runCombat();
      });
    }

    withMacro(Macro.skill($skill`Feel Nostalgic`).skill("Chest X-Ray"), () => {
      ensureMpTonic(50);
      useDefaultFamiliar();
      mapMonster($location`The Haiku Dungeon`, $monster`amateur ninja`);
      runCombat();
    });
    ensurePotionEffect($effect`Tomato Power`, $item`tomato juice of powerful power`);
  }

  if (get("_candySummons") === 0) {
    useSkill(1, $skill`Summon Crimbo Candy`);
    if (itemAmount($item`Crimbo candied pecan`) === 3) {
      resources.tome($item`sugar sheet`);
      useFamiliar($familiar`Baby Bugged Bugbear`);
      visitUrl("arena.php");
      useDefaultFamiliar();
    }
  }

  useSkill(1, $skill`Chubby and Plump`);

  while (itemAmount($item`BRICKO eye brick`) < 1 || itemAmount($item`BRICKO brick`) < 8) {
    ensureMpTonic(mpCost($skill`Summon BRICKOs`));
    useSkill($skill`Summon BRICKOs`);
  }

  while (get("libramSummons") < 6) {
    ensureMpTonic(mpCost($skill`Summon Candy Heart`));
    useSkill($skill`Summon Candy Heart`);
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

  this.context.synthesisPlanner.synthesize(
    myPrimestat() === $stat`Muscle` ? $effect`Synthesis: Movement` : $effect`Synthesis: Learning`
  );
  this.context.synthesisPlanner.synthesize(
    myPrimestat() === $stat`Muscle` ? $effect`Synthesis: Strong` : $effect`Synthesis: Smart`
  );

  cliExecute("briefcase enchantment spell hot -combat");

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

  // Chateau rest
  while (get("timesRested") < totalFreeRests()) {
    visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
    libramBurn();
  }

  if (oysterAvailable()) {
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
      .if_("monstername LOV Equivocator", Macro.pickpocket().kill())
      .setAutoAttack();

    TunnelOfLove.fightAll("LOV Epaulettes", "Open Heart Surgery", "LOV Extraterrestrial Chocolate");

    if (handlingChoice()) throw "Did not get all the way through LOV.";

    if (itemAmount($item`LOV Extraterrestrial Chocolate`) > 0) {
      use($item`LOV Extraterrestrial Chocolate`);
    }
  }

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
  // Witchess fights, saving queen until just before NEP
  useDefaultFamiliar();
  if (availableAmount($item`dented scepter`) === 0 && get("_witchessFights") < 5) {
    setAutoAttack(0);
    equip($item`Fourth of May Cosplay Saber`);
    withMacro(Macro.skill($skill`Saucegeyser`).repeat(), () =>
      Witchess.fightPiece($monster`Witchess King`)
    );
  }
  if (availableAmount($item`battle broom`) === 0 && get("_witchessFights") < 5) {
    setAutoAttack(0);
    equip($item`Fourth of May Cosplay Saber`);
    withMacro(Macro.attack().repeat(), () => Witchess.fightPiece($monster`Witchess Witch`));
  }
  if (get("_witchessFights") < 4) {
    Macro.kill().setAutoAttack();
    Witchess.fightPiece($monster`Witchess Bishop`);
    setAutoAttack(0);
  }

  while (get("_machineTunnelsAdv") < 5) {
    // DMT noncombat. Run.
    this.context.propertyManager.setChoices({ [1119]: 5 });

    useFamiliar($familiar`Machine Elf`);
    if (globalOptions.debug)
      print(
        `mannydebug my base mainstat is ${myBasestat(
          $stat`mysticality`
        )} and this is DMT fight ${get("_machineTunnelsAdv")}`
      );

    equip($item`LOV Epaulettes`);
    equip($slot`acc3`, $item`battle broom`);

    adventureMacroAuto(
      $location`The Deep Machine Tunnels`,
      Macro.externalIf(
        get("_machineTunnelsAdv") === 0 && get("_cosmicBowlingSkillsUsed") === 0,
        Macro.trySkill($skill`Bowl Sideways`)
      ).kill()
    );
  }

  // Professor 10x free sausage fight @ noob cave
  if (sausageFightGuaranteed() && globalOptions.levelAggressively) {
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

    adventureMacroAuto(
      $location`Noob Cave`,
      Macro.if_("!monstername sausage goblin", Macro.abort())
        .trySkill($skill`lecture on relativity`)
        .trySkill("Feel Pride")
        .kill()
    );
  }

  ensureOutfit("CS Leveling");

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

  // 14 free NEP fights
  while (
    get("_neverendingPartyFreeTurns") < 10 ||
    get("_shatteringPunchUsed") < 2 ||
    !get("_gingerbreadMobHitUsed")
  ) {
    equip($item`LOV Epaulettes`);
    equip($slot`acc3`, $item`battle broom`);

    useDefaultFamiliar();
    if (globalOptions.debug)
      print(
        `mannydebug my base mainstat is ${myBasestat(
          $stat`mysticality`
        )} and this is NEP fight ${get("_neverendingPartyFreeTurns")}`
      );

    this.ensureInnerElf();

    if (get("_questPartyFair") === "unstarted") {
      visitUrl(toUrl($location`The Neverending Party`));
      if (["food", "booze"].includes(get("_questPartyFairQuest"))) {
        print("Gerald/ine quest!", "blue");
        runChoice(1); // Accept quest
      } else {
        runChoice(2); // Decline quest
      }
    }

    useDefaultFamiliar();
    // NEP noncombat. Fight.
    this.context.propertyManager.setChoices({ [1324]: 5 });

    adventureMacroAuto(
      $location`The Neverending Party`,
      Macro.externalIf(get("_cosmicBowlingSkillsUsed") < 3, Macro.trySkill($skill`Bowl Sideways`))
        .if_($effect`Inner Elf`, Macro.trySkill($skill`Feel Pride`))
        .externalIf(
          get("_neverendingPartyFreeTurns") === 10,
          Macro.trySkill("Shattering Punch", "Gingerbread Mob Hit").abort()
        )

        .kill()
    );
  }

  if (availableAmount($item`very pointy crown`) === 0 && get("_witchessFights") < 5) {
    setAutoAttack(0);
    equip($item`Fourth of May Cosplay Saber`);
    withMacro(
      Macro.tryItem([$item`jam band bootleg`, $item`gas can`])
        .attack()
        .repeat(),
      () => Witchess.fightPiece($monster`Witchess Queen`)
    );
  }

  // Reset location so maximizer doesn't get confused.
  setLocation($location`none`);
}
