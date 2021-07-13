import {
  availableAmount,
  cliExecute,
  create,
  drinksilent,
  fullnessLimit,
  getClanId,
  getWorkshed,
  inebrietyLimit,
  mpCost,
  myAdventures,
  myFamiliar,
  myFullness,
  myGardenType,
  myInebriety,
  myMaxmp,
  myMp,
  print,
  putStash,
  takeStash,
  use,
  useFamiliar,
  useSkill,
} from "kolmafia";
import { $item, $skill, get, $familiar } from "libram";

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
} else {
  throw "are you sure you want to ascend? you have some open organ space";
}

while (myAdventures() > 4) {
  cliExecute("dungeonfist");
}

if (getWorkshed() !== $item`little geneticist DNA-splicing lab`) {
  takeStash($item`little geneticist DNA-splicing lab`, 1);
  use($item`little geneticist DNA-splicing lab`);
}

if (myGardenType() !== "peppermint") {
  use($item`peppermint pip packet`);
}
