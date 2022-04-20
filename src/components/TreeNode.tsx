import { Container, Sprite, TilingSprite } from "@inlet/react-pixi";
import { FC, memo } from "react";
import {
  allocateNodes,
  getNodesToAllocate,
  getNodesToDeallocate,
  removeHighLight,
  triggerTreeUpdateOnClick,
  triggerTreeUpdateOnHover,
} from "../lib/store/slices/atlasTree.slice";
import debounce from "lodash.debounce";
import { InternalAtlasTree } from "../lib/services/AtlasTree.interface";
import { useAppDispatch } from "../lib/hooks/storeHooks";

interface TreeNodeProps {
  node: InternalAtlasTree.Node;
}
const TreeNode: FC<TreeNodeProps> = ({ node }) => {
  const dispatch = useAppDispatch();
  const iconSrc = node.isSelected
    ? `/${node.nodeIcon?.active.filename}`
    : `/${node.nodeIcon?.inactive.filename}`;
  const outlineIconSrc = node.isSelected
    ? `/${node.outlineIcon?.active}`
    : `/${node.outlineIcon?.inactive}`;

  const debouncedHandleMouseOverNode = debounce(
    (node: InternalAtlasTree.Node) => handleMouseOverNode(node),
    100
  );

  function handleClickOnNode(node: InternalAtlasTree.Node) {
    if (!node.isSelected) {
      dispatch(allocateNodes());
    }
    dispatch(triggerTreeUpdateOnClick());
  }

  function handleMouseOverNode(node: InternalAtlasTree.Node) {
    node.isSelected
      ? dispatch(getNodesToDeallocate(node.nodeId))
      : dispatch(getNodesToAllocate(node.nodeId));

    dispatch(triggerTreeUpdateOnHover());
  }

  function handleMouseOutNode() {
    dispatch(removeHighLight());
    debouncedHandleMouseOverNode.cancel();
  }
  return (
    <Container sortableChildren={true} x={node.x} y={node.y}>
      <TilingSprite
        image={iconSrc}
        interactive={true}
        click={() => {
          handleClickOnNode(node);
        }}
        mouseover={() => {
          debouncedHandleMouseOverNode(node);
        }}
        mouseout={() => handleMouseOutNode()}
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
      {node.outlineIcon && (
        <Sprite image={outlineIconSrc} anchor={0.5} scale={2.7} />
      )}
    </Container>
  );
};

export const MemoisedTreeNode = memo(TreeNode);
