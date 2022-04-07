import { Sprite } from "@inlet/react-pixi";
import React, { FC } from "react";
import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";
interface TreeLineProps {
  isSelected: boolean;
  fromNode: InternalAtlasTree.Node;
  toNode: InternalAtlasTree.Node;
}

const TreeLine: FC<TreeLineProps> = ({ isSelected, fromNode, toNode }) => {
  return <Sprite image="LineConnectorNormal.png" />;
};

export default TreeLine;
