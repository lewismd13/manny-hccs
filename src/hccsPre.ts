import {
  availableAmount,
  cliExecute,
  create,
  drinksilent,
  fullnessLimit,
  getWorkshed,
  inebrietyLimit,
  myAdventures,
  myFamiliar,
  myFullness,
  myGardenType,
  myInebriety,
  print,
  putShop,
  putStash,
  pvpAttacksLeft,
  takeStash,
  use,
  useFamiliar,
  useSkill,
} from "kolmafia";
import { $familiar, $item, $skill, Clan } from "libram";
import { mannyCleanup } from "./lib";

Clan.join("Alliance from Hell");

if (pvpAttacksLeft() > 0) {
  cliExecute("uberpvpoptimizer");
  cliExecute("swagger");
}

mannyCleanup();

if (myInebriety() === inebrietyLimit() && myFullness() === fullnessLimit()) {
  if (myFamiliar() !== $familiar`Stooper`) {
    useFamiliar($familiar`Stooper`);
    useSkill($skill`The Ode to Booze`, 1);
    drinksilent($item`elemental caipiroska`);
  }
  useSkill($skill`The Ode to Booze`, 1);
  takeStash($item`tiny plastic sword`, 1);
  create($item`grogtini`);
  drinksilent($item`grogtini`);
  putStash($item`tiny plastic sword`, 1);
} else if (myInebriety() >= inebrietyLimit() && myFullness() === fullnessLimit()) {
  print("You're all set on drinking");
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
