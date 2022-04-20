import { AtlasTreeParser } from "./AtlasTreeParser.class";
import { default as passiveTreeData } from "../../data/SkillTree.json";

export function parseTreeData() {
  const service = new AtlasTreeParser(passiveTreeData);

  return service.getData();
}
