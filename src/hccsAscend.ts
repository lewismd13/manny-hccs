import {
  getWorkshed,
  myGardenType,
  visitUrl,
  containsText,
  print,
  userConfirm,
  takeStash,
  use,
} from "kolmafia";
import { $item, get, $monster } from "libram";

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

if (get("chateauMonster") !== $monster`black crayon crimbo elf`) {
  throw "You have the wrong mob painted in the chateau";
}

print("you're about to ascend! wait, is that good?", "green");

// add in checks for chateau and boots, chateau mob has a pref, dunno about the rest

// const pg = visitUrl("charpane.php");

if (!containsText(visitUrl("charpane.php"), "Astral Spirit"))
  visitUrl("ascend.php?action=ascend&confirm=on&confirm2=on");
if (!containsText(visitUrl("charpane.php"), "Astral Spirit")) throw "Failed to ascend.";
visitUrl("afterlife.php?action=pearlygates");
visitUrl("afterlife.php?action=buydeli&whichitem=5046");
visitUrl("afterlife.php?action=buyarmory&whichitem=5037");
userConfirm("Are you sure you want to ascend? No skills to perm?");
visitUrl(
  "afterlife.php?action=ascend&confirmascend=1&whichsign=2&gender=1&whichclass=4&whichpath=25&asctype=3&noskillsok=1&pwd",
  true
);
