import { AtlasTree } from "./services/AtlasTree/AtlasTree.class";
import { default as passiveTreeData } from "./data/SkillTree.json";

export function parseTreeData() {
  const service = new AtlasTree(passiveTreeData);

  return service.getData();
}
