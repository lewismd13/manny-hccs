import {
  availableAmount,
  cliExecute,
  fullnessLimit,
  getWorkshed,
  inebrietyLimit,
  myAdventures,
  myFullness,
  myGardenType,
  myInebriety,
  print,
  putShop,
  pvpAttacksLeft,
  takeStash,
  use,
} from "kolmafia";
import { $item, Clan } from "libram";
import { mannyCleanup } from "./lib";

Clan.join("Alliance from Hell");

if (pvpAttacksLeft() > 0) {
  cliExecute("uberpvpoptimizer");
  cliExecute("swagger");
}

mannyCleanup();

if (myInebriety() >= inebrietyLimit() && myFullness() === fullnessLimit()) {
  print("You're all set.");
} else {
  throw "are you sure you want to ascend? you have some open organ space";
}

while (myAdventures() > 4) {
  cliExecute("dungeonfist");
}

putShop(0, 0, availableAmount($item`Game Grid ticket`), $item`Game Grid ticket`);

if (getWorkshed() !== $item`Little Geneticist DNA-Splicing Lab`) {
  takeStash($item`Little Geneticist DNA-Splicing Lab`, 1);
  use($item`Little Geneticist DNA-Splicing Lab`);
}

// TODO: pick garden if has growth

if (myGardenType() !== "peppermint") {
  cliExecute("garden pick");
  use($item`Peppermint Pip Packet`);
}
