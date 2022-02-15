import { print } from "kolmafia";
import { CommunityService } from "libram";
import { PropertiesManager } from "libram/dist/property";
import { globalOptions } from "./options";
import { ResourceTracker } from "./resources";
import { hpPrep, moxPrep, musPrep, mysPrep } from "./tests";

export const resources = new ResourceTracker();
export const propertyManager = new PropertiesManager();

const assertTest = (action: boolean, test: string) => {
  if (!action) throw `${test} failed to complete.`;
};
try {
  assertTest(CommunityService.Moxie.run(moxPrep, globalOptions.debug), "Moxie");
  assertTest(CommunityService.Muscle.run(musPrep, globalOptions.debug), "Muscle");
  assertTest(CommunityService.HP.run(hpPrep, globalOptions.debug), "HP");
  assertTest(CommunityService.Mysticality.run(mysPrep, globalOptions.debug), "Mysticality");
} finally {
  print("tests done or whatever.");
}
