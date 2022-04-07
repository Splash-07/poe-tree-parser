import { AtlasPassiveTreeService } from "./services/AtlasPassiveTree/atlas-passive-tree.services";
import { default as passiveTreeData } from "./data/SkillTree.json";

export function parseTreeData() {
  const service = new AtlasPassiveTreeService(passiveTreeData);

  return service.getData();
}
