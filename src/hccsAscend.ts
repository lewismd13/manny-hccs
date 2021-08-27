/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  containsText,
  equippedItem,
  getWorkshed,
  myGardenType,
  print,
  takeStash,
  use,
  userConfirm,
  visitUrl,
  wait,
} from "kolmafia";
import {
  $class,
  $item,
  $monster,
  $slot,
  ascend,
  get,
  Lifestyle,
  Paths,
  prepareAscension,
} from "libram";
/*
const prep = true;

if (prep === true) {
  if (getWorkshed() !== $item`little geneticist DNA-splicing lab`) {
    takeStash($item`little geneticist DNA-splicing lab`, 1);
    use($item`little geneticist DNA-splicing lab`);
  }

  if (myGardenType() !== "peppermint") {
    use($item`peppermint pip packet`);
  }
}

if (getWorkshed() !== $item`little geneticist DNA-splicing lab`) {
  throw "You have the wrong workshed item";
}
if (myGardenType() != "peppermint") {
  throw "You have the wrong garden";
}
*/
if (get("chateauMonster") !== $monster`Black Crayon Crimbo Elf`) {
  throw "You have the wrong mob painted in the chateau";
}

if (equippedItem($slot`bootskin`) !== $item`frontwinder skin`) {
  throw "Your cowboy boots have the wrong skin";
}

if (equippedItem($slot`bootspur`) !== $item`thicksilver spurs`) {
  throw "Your cowboy boots have the wrong spurs";
}

print("you're about to ascend! wait, is that good?", "green");

wait(15);

// add in check for boots
/*
if (!containsText(visitUrl("charpane.php"), "Astral Spirit"))
  visitUrl("ascend.php?action=ascend&confirm=on&confirm2=on");
if (!containsText(visitUrl("charpane.php"), "Astral Spirit")) throw "Failed to ascend.";
visitUrl("afterlife.php?action=pearlygates");
visitUrl("afterlife.php?action=buydeli&whichitem=5046");
visitUrl("afterlife.php?action=buyarmory&whichitem=5037");
userConfirm("Are you sure you want to ascend? No skills to perm?", 60000, true);
visitUrl(
  "afterlife.php?action=ascend&confirmascend=1&whichsign=2&gender=1&whichclass=4&whichpath=25&asctype=3&noskillsok=1&pwd",
  true
);
*/

prepareAscension(
  {
    workshed: $item`Little Geneticist DNA-Splicing Lab`,
    garden: $item`Peppermint Pip Packet`,
    eudora: $item`Our Daily Candles™ order form`,
  },
  {
    desk: $item`Swiss piggy bank`,
    nightstand: $item`foreign language tapes`,
    ceiling: $item`ceiling fan`,
  }
);

ascend(
  Paths.CommunityService,
  $class`Sauceror`,
  Lifestyle.hardcore,
  "wallaby",
  $item`astral six-pack`,
  $item`astral statuette`
);
