import {
    choiceFollowsFight,
    getAutoAttack,
    inMultiFight,
    runCombat,
    setAutoAttack,
    visitUrl,
} from "kolmafia";
import { $skill, StrictMacro } from "libram";

export default class Macro extends StrictMacro {
    kill(): Macro {
        return this.trySkill($skill`Curse of Weaksauce`).trySkillRepeat($skill`Saucegeyser`);
    }

    static kill(): Macro {
        return new Macro().kill();
    }
}

export function withMacro<T>(macro: Macro, action: () => T): T {
    if (getAutoAttack() !== 0) setAutoAttack(0);
    macro.save();
    try {
        return action();
    } finally {
        while (inMultiFight()) runCombat();
        if (choiceFollowsFight()) visitUrl("choice.php");
        Macro.clearSaved();
    }
}
