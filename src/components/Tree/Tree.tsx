import { Container, Sprite } from "@inlet/react-pixi";
import React, { FC } from "react";
import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";
import { isMasteryNode, isRootNode } from "../../lib/services/AtlasTree/AtlasTree.typeguards";
import TreeMastery from "./TreeMastery";
import TreeNode from "./TreeNode";
import TreeConnection from "./TreeConnection";

interface TreeProps {
  nodes: Record<string, InternalAtlasTree.Node | InternalAtlasTree.NotableNode | InternalAtlasTree.MasteryNode>;
  connectionMap: Record<string, InternalAtlasTree.Connection[]>;
  constants: InternalAtlasTree.Constants;
}

const Tree: FC<TreeProps> = ({ nodes, connectionMap, constants }) => {
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
      {Object.values(nodes).map(
        (node, index) => node.nodeId !== "root" && isMasteryNode(node) && <TreeMastery key={index} node={node} />
      )}
      {connectionsFiltered.map((connection, index) => (
        <TreeConnection key={10000 + index} connection={connection} orbitRadii={constants.orbitRadii} />
      ))}

      {/* TODO: parse masteryNodeMap */}
      {Object.values(nodes).map(
        (node, index) =>
          node.nodeId !== "root" &&
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
