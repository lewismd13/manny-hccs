import { $skill, StrictMacro } from "libram";

export default class Macro extends StrictMacro {
  kill(): Macro {
    return this.trySkill($skill`Curse of Weaksauce`).trySkillRepeat($skill`Saucegeyser`);
  }

  static kill(): Macro {
    return new Macro().kill();
  }
}
