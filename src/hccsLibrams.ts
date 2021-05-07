import { availableAmount, mpCost, myMaxmp, myMp, useSkill } from "kolmafia";
import { $item, $skill, get } from "libram";
import { testDone } from "./hccs";

function nextLibramCost() {
  return mpCost($skill`Summon BRICKOs`);
}

function castBestLibram() {
  if (availableAmount($item`green candy heart`) < 1 && !testDone(5)) {
    useSkill($skill`summon candy heart`);
  } else if (availableAmount($item`love song of icy revenge`) < 2 && !testDone(5)) {
    useSkill($skill`summon love song`);
  } else if (availableAmount($item`lavendar candy heart`) < 1 && !testDone(9)) {
    useSkill($skill`summon candy heart`);
  } else if (availableAmount($item`love song of icy revenge`) < 3 && !testDone(5)) {
    useSkill($skill`summon love song`);
  } else {
    useSkill($skill`summon divine favor`);
  }
}

while (myMp() / myMaxmp() > 0.2 && nextLibramCost() <= myMp()) {
  castBestLibram();
}
