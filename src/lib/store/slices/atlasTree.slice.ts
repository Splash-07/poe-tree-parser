import { createSlice, current } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { parseTreeData } from "../../parseTreeData";
import { InternalAtlasTree } from "../../services/AtlasTreeParser/AtlasTree.interface";

export interface AtlasTreeState {
  rootNodeId: string;
  nodeMap: Record<string, InternalAtlasTree.Node>;
  connectionMap: Record<string, InternalAtlasTree.Connection[]>;
  constants: InternalAtlasTree.Constants;
  treeUpdate: boolean;
  nodesToBeAllocated: Record<string, number>;
  nodesToBeDeallocated: Record<string, number>;
  shortPathNodeList: string[];
}
const { nodeMap, constants, connectionMap } = parseTreeData();
const initialState: AtlasTreeState = {
  rootNodeId: "29045",
  nodeMap,
  connectionMap,
  constants,

  treeUpdate: false,
  // nodesToBeAllocated: { "29045": 1, "55117": 1, "2156": 1, "29666": 1, "24403": 1, "15263": 1, "17321": 1 },
  nodesToBeAllocated: { "29045": 1 },
  nodesToBeDeallocated: {},
  shortPathNodeList: [],
};

export const atlasTreeSlice = createSlice({
  name: "atlasTree",
  initialState,
  reducers: {
    triggerTreeUpdate: (state) => {
      state.treeUpdate = true;
    },

    updateTreeState: (state) => {
      const nodesToBeDeallocatedList = Object.keys(state.nodesToBeDeallocated);
      const nodesToBeAllocatedList = Object.keys(state.nodesToBeAllocated);

      // deallocate nodes
      // if (nodesToBeDeallocatedList.length > 0) {
      //   nodesToBeDeallocatedList.forEach((nodeId) => {
      //     const node = state.nodeMap[nodeId];
      //     if (node) {
      //       node.isSelected = false;
      //     }
      //   });

      //   // remove all connection from allocated nodes
      //   nodesToBeAllocatedList.forEach((nodeId) => {
      //     const connections = state.connectionMap[nodeId];
      //     connections?.forEach((connection) => {
      //       connection.isSelected = false;
      //     });
      //   });

      //   // filter out deallocated nodes from allocated nodes state
      //   nodesToBeDeallocatedList.forEach((nodeId) => {
      //     delete state.nodesToBeAllocated[nodeId];
      //   });
      //   const filteredAllocatedNodesList = Object.keys(state.nodesToBeAllocated);

      //   // connect all nodes after filtering out deallocated nodes
      //   filteredAllocatedNodesList.forEach((nodeId) => {
      //     const node = state.nodeMap[nodeId];
      //     if (node) {
      //       const connections = state.connectionMap[nodeId];
      //       connections?.forEach((connection) => {
      //         if (state.nodesToBeAllocated[connection.toNode.nodeId]) {
      //           connection.isSelected = true;
      //         }
      //       });
      //     }
      //   });

      //   state.nodesToBeDeallocated = {};
      //   state.treeUpdate = false;
      //   return;
      // }
      // allocate nodes
      if (nodesToBeAllocatedList.length > 0) {
        nodesToBeAllocatedList.forEach((nodeId) => {
          const node = state.nodeMap[nodeId];
          if (node) {
            node.isSelected = true;
            const connections = state.connectionMap[nodeId];
            connections?.forEach((connection) => {
              if (state.nodesToBeAllocated[connection.toNode.nodeId]) {
                connection.isSelected = true;
              }
            });
          }
        });
      }

      state.treeUpdate = false;
    },

    getShortestPathToNode: (state, { payload }: { payload: { toNodeId: string; action: string } }) => {
      const alreadySelectedNode = state.nodesToBeAllocated;
      const toNodeId = payload.toNodeId;

      const queue: string[] = [toNodeId];
      const visited: { [id: string]: number } = { [toNodeId]: 1 };
      const distance: { [id: string]: number } = { [toNodeId]: 0 };
      const previous: { [id: string]: string | null } = { [toNodeId]: null };

      while (queue.length) {
        let currentNodeId: string = queue.shift()!;
        if (alreadySelectedNode[currentNodeId]) break;
        handleVertex(currentNodeId);
      }

      state.shortPathNodeList = findShortestPathToNode(alreadySelectedNode, distance, previous);

      if (payload.action === "ALLOCATE") {
        state.shortPathNodeList.forEach((nodeId) => {
          state.nodesToBeAllocated[nodeId] = 1;
        });
      } else {
        state.shortPathNodeList.forEach((nodeId) => {
          state.nodesToBeDeallocated[nodeId] = 1;
        });
      }

      function handleVertex(nodeId: string) {
        const neighborsList = [...state.nodeMap[nodeId].in, ...state.nodeMap[nodeId].out];
        neighborsList.forEach((node) => {
          if (!visited[node]) {
            visited[node] = 1;
            queue.push(node);
            previous[node] = nodeId;
            distance[node] = distance[nodeId] + 1;
          }
        });
      }

      function findShortestPathToNode(
        alreadySelectedNode: WritableDraft<Record<string, number>>,
        distance: { [id: string]: number },
        previous: { [id: string]: string | null }
      ) {
        const possiblePaths: { [id: string]: number } = {};
        Object.keys(alreadySelectedNode).forEach((nodeId) => {
          if (distance[nodeId]) possiblePaths[nodeId] = distance[nodeId];
        });

        const shortestPath: string = Object.keys(possiblePaths).reduce((nodeId, distance) =>
          possiblePaths[distance] < possiblePaths[nodeId] ? distance : nodeId
        );

        const list: string[] = [];
        let nodeIdToPush = shortestPath;
        while (true) {
          const nextNode = previous[nodeIdToPush];
          if (nextNode === null) break;

          list.push(nextNode);
          nodeIdToPush = nextNode!;
        }

        return list;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTreeState, triggerTreeUpdate, getShortestPathToNode } = atlasTreeSlice.actions;

export default atlasTreeSlice.reducer;
