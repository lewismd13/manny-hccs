import { print } from "kolmafia";
import { CommunityService } from "libram";
import { PropertiesManager } from "libram/dist/property";
import { ResourceTracker } from "./resources";
import { hpPrep, moxPrep } from "./tests";

export const resources = new ResourceTracker();
export const propertyManager = new PropertiesManager();

const assertTest = (action: boolean, test: string) => {
  if (!action) throw `${test} failed to complete.`;
};
try {
  assertTest(CommunityService.Moxie.run(moxPrep, true), "Moxie");
  assertTest(CommunityService.HP.run(hpPrep, true), "HP");
} finally {
  print("tests done or whatever.");
}
