import {
  availableAmount,
  cliExecute,
  create,
  drinksilent,
  fullnessLimit,
  getClanId,
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
  takeStash,
  use,
  useFamiliar,
  useSkill,
} from "kolmafia";
import { $item, $skill, $familiar } from "libram";

if (getClanId() !== 40382) {
  cliExecute("/whitelist alliance from hell");
}

if (myInebriety() === inebrietyLimit() && myFullness() === fullnessLimit()) {
  if (myFamiliar() !== $familiar`stooper`) {
    useFamiliar($familiar`stooper`);
    useSkill($skill`the ode to booze`, 1);
    drinksilent($item`elemental caipiroska`);
  }
  useSkill($skill`the ode to booze`, 1);
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

putShop(0, 0, availableAmount($item`game grid ticket`), $item`game grid ticket`);

if (getWorkshed() !== $item`little geneticist DNA-splicing lab`) {
  takeStash($item`little geneticist DNA-splicing lab`, 1);
  use($item`little geneticist DNA-splicing lab`);
}

if (myGardenType() !== "peppermint") {
  use($item`peppermint pip packet`);
}
