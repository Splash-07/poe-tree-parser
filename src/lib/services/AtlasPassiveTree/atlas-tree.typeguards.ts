import { GGGAtlasPassiveTree } from "./atlas-tree-ggg.interface";
import { InternalPassiveTree } from "./atlas-tree-internal.interface";

export const isSkillNode = (
  node: GGGAtlasPassiveTree.Node | GGGAtlasPassiveTree.SkillNode
): node is GGGAtlasPassiveTree.SkillNode => {
  return (node as GGGAtlasPassiveTree.SkillNode).skill !== undefined;
};
export const isRootNode = (node: InternalPassiveTree.Node | InternalPassiveTree.RootNode): boolean => {
  return (node as InternalPassiveTree.RootNode).nodeId === "29045";
};

export const isNotableNode = (
  node: InternalPassiveTree.Node | InternalPassiveTree.NotableNode
): node is InternalPassiveTree.NotableNode => {
  return (node as InternalPassiveTree.NotableNode).isNotable;
};
export const isMasteryNode = (
  node: InternalPassiveTree.Node | InternalPassiveTree.MasteryNode
): node is InternalPassiveTree.MasteryNode => {
  return !!(node as InternalPassiveTree.MasteryNode).isMastery;
};
