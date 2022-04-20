import { GGGAtlasTree, InternalAtlasTree } from "./AtlasTree.interface";

export const isSkillNode = (
  node: GGGAtlasTree.Node | GGGAtlasTree.SkillNode
): node is GGGAtlasTree.SkillNode => {
  return (node as GGGAtlasTree.SkillNode).skill !== undefined;
};
export const isRootNode = (
  node: InternalAtlasTree.Node | InternalAtlasTree.RootNode
): boolean => {
  return (node as InternalAtlasTree.RootNode).nodeId === "29045";
};

export const isTreeRoot = (
  node: InternalAtlasTree.Node | InternalAtlasTree.MasteryNode
): boolean => {
  return (node as InternalAtlasTree.Node).nodeId === "root";
};
