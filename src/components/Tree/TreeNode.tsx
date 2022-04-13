import { Container, Sprite, TilingSprite } from "@inlet/react-pixi";
import { FC, memo } from "react";
import { useDispatch } from "react-redux";
import { InternalAtlasTree } from "../../lib/services/AtlasTree/AtlasTree.interface";
import { removeNodeSelection, selectNode } from "../../lib/store/slices/atlasTree.slice";

interface TreeNodeProps {
  node: InternalAtlasTree.Node | InternalAtlasTree.NotableNode | InternalAtlasTree.MasteryNode;
}
const TreeNode: FC<TreeNodeProps> = ({ node }) => {
  const dispatch = useDispatch();
  const iconSrc = node.isSelected ? `/${node.nodeIcon?.active.filename}` : `/${node.nodeIcon?.inactive.filename}`;
  const outlineIconSrc = node.isSelected ? `/${node.outlineIcon?.active}` : `/${node.outlineIcon?.inactive}`;
  function handleClickOnNode() {
    if (node.isSelected) {
      dispatch(removeNodeSelection(node.nodeId));
    } else {
      dispatch(selectNode(node.nodeId));
    }
  }
  return (
    <Container sortableChildren={true} x={node.x} y={node.y}>
      <TilingSprite
        image={iconSrc}
        interactive={true}
        click={() => {
          handleClickOnNode();
        }}
        cursor="pointer"
        anchor={0.5}
        scale={3}
        width={node.nodeIcon.inactive.cords.w}
        height={node.nodeIcon.inactive.cords.h}
        tilePosition={{
          x: -node.nodeIcon.inactive.cords.x,
          y: -node.nodeIcon.inactive.cords.y,
        }}
      />
      {node.outlineIcon && <Sprite image={outlineIconSrc} anchor={0.5} scale={2.7} />}
    </Container>
  );
};

export const MemoisedTreeNode = memo(TreeNode);
