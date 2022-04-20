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
