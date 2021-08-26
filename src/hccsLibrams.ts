import { availableAmount, print, useSkill } from "kolmafia";
import { $item, $skill } from "libram";
import { testDone } from "./hccs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function castBestLibram() {
  if (availableAmount($item`green candy heart`) < 1 && !testDone(5)) {
    useSkill($skill`Summon Candy Heart`);
  } else if (availableAmount($item`love song of icy revenge`) < 2 && !testDone(5)) {
    useSkill($skill`Summon Love Song`);
  } else if (availableAmount($item`lavender candy heart`) < 1 && !testDone(9)) {
    useSkill($skill`Summon Candy Heart`);
  } else if (availableAmount($item`love song of icy revenge`) < 3 && !testDone(5)) {
    useSkill($skill`Summon Love Song`);
  } else {
    useSkill($skill`Summon Party Favor`);
  }
}
export function libramCast() {
  /*while (myMp() / myMaxmp() > 0.2 && nextLibramCost() <= myMp()) {
    castBestLibram();
  } */
  print("nevermind");
}
