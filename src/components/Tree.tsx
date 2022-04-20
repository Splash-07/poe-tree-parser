import { useEffect } from "react";
import { Container, Sprite } from "@inlet/react-pixi";

import { MemoisedTreeMasteryNode } from "./TreeMasteryNode";
import { MemoisedTreeNode } from "./TreeNode";
import { MemoisedTreeConnector } from "./TreeConnection";

import { useAppDispatch, useAppSelector } from "../lib/hooks/storeHooks";
import {
  updateTreeOnClick,
  updateTreeOnHover,
} from "../lib/store/slices/atlasTree.slice";
import { isRootNode } from "../lib/services/AtlasTree.typeguards";

const Tree = () => {
  const {
    nodeMap,
    masteryNodeMap,
    connectionMap,
    constants,
    treeUpdateOnHover,
    treeUpdateOnClick,
  } = useAppSelector((state) => state.atlasTree);
  const dispatch = useAppDispatch();

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
      {Object.values(masteryNodeMap).map((node, index) => (
        <MemoisedTreeMasteryNode key={index} node={node} />
      ))}
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
      {Object.values(nodeMap).map((node, index) =>
        isRootNode(node) ? (
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
        )
      )}
    </Container>
  );
};

export default Tree;
