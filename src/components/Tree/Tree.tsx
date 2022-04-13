import { useEffect } from "react";
import { Container, Sprite } from "@inlet/react-pixi";
import { MemoisedTreeMasteryNode } from "./TreeMasteryNode";
import { MemoisedTreeNode } from "./TreeNode";
import { MemoisedTreeConnector } from "./TreeConnection";

import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";
import { isMasteryNode, isRootNode } from "../../lib/services/AtlasTree/AtlasTree.typeguards";
import { useAppDispatch, useAppSelector } from "../../lib/hooks/store.hooks";
import { updateTreeState } from "../../lib/store/slices/atlasTree.slice";

const Tree = () => {
  const { nodeMap, connectionMap, constants, selectedNodeList } = useAppSelector((state) => state.atlasTree);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    dispatch(updateTreeState());
  }, [selectedNodeList, dispatch]);

  return (
    <Container sortableChildren={true}>
      {Object.values(nodeMap).map(
        (node, index) =>
          node.nodeId !== "root" && isMasteryNode(node) && <MemoisedTreeMasteryNode key={index} node={node} />
      )}
      {Object.values(connectionMap).map((connectionList, indexOne) => {
        return connectionList.map(
          (connection, indexTwo) =>
            shouldRenderConnection(connection) && (
              <MemoisedTreeConnector
                key={10000 + indexOne + indexTwo}
                connection={connection}
                orbitRadii={constants.orbitRadii}
              />
            )
        );
      })}
      {Object.values(nodeMap).map(
        (node, index) =>
          shouldRenderNode(node) &&
          !isMasteryNode(node) &&
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
            <MemoisedTreeNode key={index} node={node} />
          ))
      )}
    </Container>
  );
};

export default Tree;
