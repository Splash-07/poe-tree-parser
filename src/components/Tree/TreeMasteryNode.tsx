import { Sprite } from "@inlet/react-pixi";
import React, { FC } from "react";
import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";
interface TreeMasteryProps {
  node: InternalAtlasTree.MasteryNode;
}
// Cuz of zIndex layers it has to be separated component
const TreeMastery: FC<TreeMasteryProps> = ({ node }) => {
  return <Sprite image={`/${node.groupBackground}`} x={node.x} y={node.y} anchor={0.5} scale={2.6} />;
};

export default TreeMastery;
