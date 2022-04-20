import { Container, Sprite, TilingSprite } from "@inlet/react-pixi";
import React, { FC, memo } from "react";
import { InternalAtlasTree } from "../lib/services/AtlasTree.interface";
interface TreeMasteryNodeProps {
  node: InternalAtlasTree.MasteryNode;
}
const TreeMasteryNode: FC<TreeMasteryNodeProps> = ({ node }) => {
  const iconSrc = `/${node.nodeIcon?.inactive.filename}`;
  return (
    <Container x={node.x} y={node.y} anchor={0.5}>
      <Sprite image={`/${node.groupBackground}`} anchor={0.5} scale={2.6} />
      <TilingSprite
        image={iconSrc}
        anchor={0.5}
        scale={2.7}
        width={node.nodeIcon.inactive.cords.w}
        height={node.nodeIcon.inactive.cords.h}
        tilePosition={{
          x: -node.nodeIcon.inactive.cords.x,
          y: -node.nodeIcon.inactive.cords.y,
        }}
      />
    </Container>
  );
};

export const MemoisedTreeMasteryNode = memo(TreeMasteryNode);
