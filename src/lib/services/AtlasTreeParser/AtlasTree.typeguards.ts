import { GGGAtlasTree, InternalAtlasTree } from "./AtlasTree.interface";

export const isSkillNode = (node: GGGAtlasTree.Node | GGGAtlasTree.SkillNode): node is GGGAtlasTree.SkillNode => {
  return (node as GGGAtlasTree.SkillNode).skill !== undefined;
};
export const isRootNode = (node: InternalAtlasTree.Node | InternalAtlasTree.RootNode): boolean => {
  return (node as InternalAtlasTree.RootNode).nodeId === "29045";
};

export const isNotableNode = (
  node: InternalAtlasTree.Node | InternalAtlasTree.NotableNode
): node is InternalAtlasTree.NotableNode => {
  return (node as InternalAtlasTree.NotableNode).isNotable;
};
export const isMasteryNode = (
  node: InternalAtlasTree.Node | InternalAtlasTree.MasteryNode
): node is InternalAtlasTree.MasteryNode => {
  return !!(node as InternalAtlasTree.MasteryNode).isMastery;
};
