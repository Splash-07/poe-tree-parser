import { default as passiveTreeData } from "./data/SkillTree.json";
import { AtlasTreeParser } from "./services/AtlasTreeParser/AtlasTreeParser.class";

export function parseTreeData() {
  const service = new AtlasTreeParser(passiveTreeData);

  return service.getData();
}
