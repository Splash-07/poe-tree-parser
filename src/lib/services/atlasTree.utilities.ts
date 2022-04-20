import { WritableDraft } from "immer/dist/internal";

export function getShortestPathMap(
  selectedNodes: WritableDraft<Record<string, (string | undefined)[]>>,
  distance: { [id: string]: number },
  previous: { [id: string]: string | null }
) {
  const possiblePaths: { [id: string]: number } = {};
  Object.keys(selectedNodes).forEach((nodeId) => {
    if (distance[nodeId]) possiblePaths[nodeId] = distance[nodeId];
  });
  const shortestPathLength: string = Object.keys(possiblePaths).reduce(
    (nodeId, distance) =>
      possiblePaths[distance] < possiblePaths[nodeId] ? distance : nodeId
  );

  const list: string[] = [];
  let nodeId = shortestPathLength;
  list.push(nodeId);
  while (true) {
    const nextNode = previous[nodeId];
    if (nextNode === null) break;

    list.push(nextNode);
    nodeId = nextNode!;
  }
  return {
    list,
    map: list.reduce((acc, cur) => {
      return { ...acc, [cur]: 1 };
    }, {}),
  };
}

export function getLineColor(
  isSelected: boolean,
  canBeAllocated: boolean,
  canBeUnallocated: boolean
) {
  return canBeAllocated
    ? 0x38a169
    : canBeUnallocated
    ? 0xe53e3e
    : isSelected
    ? 0x63b3ed
    : 0x8f6c29;
}
export function getLineAlpha(
  isSelected: boolean,
  canBeAllocated: boolean,
  canBeUnallocated: boolean
) {
  return canBeAllocated ? 1 : canBeUnallocated ? 1 : isSelected ? 1 : 0.4;
}
