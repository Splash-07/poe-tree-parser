import React, { FC } from "react";
import { Container, Sprite } from "@inlet/react-pixi";
import TreeMastery from "./TreeMasteryNode";
import TreeNode from "./TreeNode";
import TreeConnection from "./TreeConnection";

import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";
import { isMasteryNode, isRootNode } from "../../lib/services/AtlasTree/AtlasTree.typeguards";
import { AtlasTreeState } from "../../lib/store/slices/atlasTree.slice";

interface AtlasTreeProps extends Pick<AtlasTreeState, "nodeMap" | "connectionMap" | "constants"> {}

const Tree: FC<AtlasTreeProps> = ({ nodeMap, connectionMap, constants }) => {
  const shouldRenderNode = (node: InternalAtlasTree.Node) => {
    if (!node.x || !node.y) {
      return false;
    }

    return true;
  };

  const shouldRenderConnection = ({ fromNode, toNode }: InternalAtlasTree.Connection) => {
    if (!shouldRenderNode(fromNode) || !shouldRenderNode(toNode)) {
      return false;
    }

    if (fromNode.orbit === undefined || toNode.orbit === undefined) {
      return false;
    }

    return true;
  };

  const connectionsFiltered = Object.keys(connectionMap)
    .map((fromNodeId) => connectionMap[fromNodeId])
    .reduce((acc, cur) => cur.reduce((innerAcc, innerCur) => [...innerAcc, innerCur], acc), [])
    .filter(shouldRenderConnection);

  return (
    <Container sortableChildren={true}>
      {Object.values(nodeMap).map(
        (node, index) => node.nodeId !== "root" && isMasteryNode(node) && <TreeMastery key={index} node={node} />
      )}
      {connectionsFiltered.map((connection, index) => (
        <TreeConnection key={10000 + index} connection={connection} orbitRadii={constants.orbitRadii} />
      ))}

      {/* TODO: parse masteryNodeMap */}
      {Object.values(nodeMap).map(
        (node, index) =>
          shouldRenderNode(node) &&
          (isRootNode(node) ? (
            <Sprite
              key={index}
              image="/AtlasPassiveSkillScreenStart.png"
              scale={2.6}
              x={node.x}
              y={node.y}
              anchor={0.5}
            />
          ) : (
            <TreeNode key={index} node={node} connectionMap={connectionMap} />
          ))
      )}
    </Container>
  );
};

export default Tree;
