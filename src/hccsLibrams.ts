import { availableAmount, mpCost, myMaxmp, myMp, print, useSkill } from "kolmafia";
import { $item, $skill, get } from "libram";
import { testDone } from "./hccs";



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
export function libramCast() {
  /*while (myMp() / myMaxmp() > 0.2 && nextLibramCost() <= myMp()) {
    castBestLibram();
  } */
  print("nevermind");
}
