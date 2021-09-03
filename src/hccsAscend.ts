import { equippedItem, print, wait } from "kolmafia";
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
