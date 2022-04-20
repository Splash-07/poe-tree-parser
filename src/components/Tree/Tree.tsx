import { useEffect } from "react";
import { Container, Sprite } from "@inlet/react-pixi";
import { MemoisedTreeMasteryNode } from "./TreeMasteryNode";
import { MemoisedTreeNode } from "./TreeNode";
import { MemoisedTreeConnector } from "./TreeConnection";

import { InternalAtlasTree } from "../../lib/services/AtlasTreeParser/AtlasTree.interface";
import {
  isMasteryNode,
  isRootNode,
} from "../../lib/services/AtlasTreeParser/AtlasTree.typeguards";
import { useAppDispatch, useAppSelector } from "../../lib/hooks/storeHooks";
import {
  triggerTreeUpdateOnHover,
  updateTreeOnClick,
  updateTreeOnHover,
} from "../../lib/store/slices/atlasTree.slice";
// import { updateTreeState } from "../../lib/store/slices/atlasTree.slice";

const Tree = () => {
  const {
    nodeMap,
    connectionMap,
    constants,
    treeUpdateOnHover,
    treeUpdateOnClick,
  } = useAppSelector((state) => state.atlasTree);
  const dispatch = useAppDispatch();

  const shouldRenderNode = (node: InternalAtlasTree.Node) => {
    if (!node.x || !node.y) {
      return false;
    }

    return true;
  };

  const shouldRenderConnection = ({
    fromNode,
    toNode,
  }: InternalAtlasTree.Connection) => {
    if (!shouldRenderNode(fromNode) || !shouldRenderNode(toNode)) {
      return false;
    }

    if (fromNode.orbit === undefined || toNode.orbit === undefined) {
      return false;
    }

    return true;
  };
  useEffect(() => {
    if (treeUpdateOnHover === true) {
      dispatch(updateTreeOnHover());
    }
  }, [treeUpdateOnHover, dispatch]);

  useEffect(() => {
    if (treeUpdateOnClick === true) {
      dispatch(updateTreeOnClick());
    }
  }, [treeUpdateOnClick, dispatch]);

  return (
    <Container sortableChildren={true}>
      {/* Mastery nodes rendering */}
      {Object.values(nodeMap).map(
        (node, index) =>
          node.nodeId !== "root" &&
          isMasteryNode(node) && (
            <MemoisedTreeMasteryNode key={index} node={node} />
          )
      )}
      {/* Connections rendering */}
      {Object.values(connectionMap).map((connectionList, indexOne) => {
        return connectionList.map((connection, indexTwo) => (
          <MemoisedTreeConnector
            key={10000 + indexOne + indexTwo}
            connection={connection}
            orbitRadii={constants.orbitRadii}
          />
        ));
      })}
      {/* Tree root node and normal + notable nodes rendering */}
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
