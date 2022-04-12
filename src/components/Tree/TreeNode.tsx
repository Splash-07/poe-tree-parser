import { Container, Sprite, TilingSprite } from "@inlet/react-pixi";
import React, { FC } from "react";
import { useAppDispatch } from "../../lib/hooks/store.hooks";
import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";
import { selectNode } from "../../lib/store/slices/atlasTree.slice";

interface TreeNodeProps {
  node: InternalAtlasTree.Node | InternalAtlasTree.NotableNode | InternalAtlasTree.MasteryNode;
  connectionMap: Record<string, InternalAtlasTree.Connection[]>;
}
const TreeNode: FC<TreeNodeProps> = ({ node, connectionMap }) => {
  // const dispatch = useAppDispatch();
  return (
    <Container sortableChildren={true} x={node.x} y={node.y}>
      <TilingSprite
        image={`/${node.nodeIcon?.inactive.filename}`}
        interactive={true}
        // click={(event) => dispatch(selectNode(node.nodeId))}
        anchor={0.5}
        scale={2.6}
        width={node.nodeIcon.inactive.cords.w}
        height={node.nodeIcon.inactive.cords.h}
        tilePosition={{
          x: -node.nodeIcon.inactive.cords.x,
          y: -node.nodeIcon.inactive.cords.y,
        }}
      />
      {node.outlineIcon && <Sprite image={`/${node.outlineIcon.inactive}`} anchor={0.5} scale={2.7} />}
    </Container>
  );
};

export default TreeNode;
