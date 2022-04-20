import { createSlice, current } from "@reduxjs/toolkit";
import { parseTreeData } from "../../parseTreeData";
import { InternalAtlasTree } from "../../services/AtlasTreeParser/AtlasTree.interface";
import { getShortestPathMap } from "../../services/AtlasTreeParser/atlasTree.utilities";

export interface AtlasTreeState {
  rootNodeId: string;
  nodeMap: Record<string, InternalAtlasTree.Node>;
  connectionMap: Record<string, InternalAtlasTree.Connection[]>;
  constants: InternalAtlasTree.Constants;
  treeUpdateOnClick: boolean;
  treeUpdateOnHover: boolean;
  allocatedNodes: Record<string, (string | undefined)[]>;
  nodesToBeAllocated: {
    list: string[];
    map: Record<string, number>;
  };
  nodesToBeDeallocated: {
    list: string[];
    target?: string;
    map: Record<string, number>;
  };
}
const { nodeMap, constants, connectionMap } = parseTreeData();
const initialState: AtlasTreeState = {
  rootNodeId: "29045",
  nodeMap,
  connectionMap,
  constants,
  treeUpdateOnClick: false,
  treeUpdateOnHover: false,
  allocatedNodes: { "29045": [] },
  nodesToBeAllocated: {
    list: [],
    map: {},
  },
  nodesToBeDeallocated: {
    list: [],
    target: undefined,
    map: {},
  },
};

export const atlasTreeSlice = createSlice({
  name: "atlasTree",
  initialState,
  reducers: {
    triggerTreeUpdateOnHover: (state) => {
      state.treeUpdateOnHover = true;
    },

    updateTreeOnHover: (state) => {
      const nodesToBeAllocatedList = state.nodesToBeAllocated.list;
      const nodesToBeAllocatedMap = state.nodesToBeAllocated.map;

      const nodesToBeDeallocated = state.nodesToBeDeallocated.list;
      const nodesToBeDeallocatedMap = state.nodesToBeDeallocated.map;

      // highlight nodes, that can be deallocated
      if (nodesToBeDeallocated.length > 0) {
        nodesToBeDeallocated.forEach((nodeId) => {
          const node = state.nodeMap[nodeId];

          if (node) {
            const connections = state.connectionMap[nodeId];
            connections?.forEach((connection) => {
              if (nodesToBeDeallocatedMap[connection.toNode.nodeId]) {
                connection.canBeUnallocated = true;
              }
            });
          }
        });
        state.treeUpdateOnHover = false;
      }

      // highlight unAllocated nodes
      if (nodesToBeAllocatedList.length > 0) {
        nodesToBeAllocatedList.forEach((nodeId) => {
          const node = state.nodeMap[nodeId];

          if (node) {
            const connections = state.connectionMap[nodeId];
            connections?.forEach((connection) => {
              if (nodesToBeAllocatedMap[connection.toNode.nodeId]) {
                connection.canBeAllocated = true;
              }
            });
          }
        });
        state.treeUpdateOnHover = false;
      }
    },

    removeHighLight: (state) => {
      const nodesToBeAllocatedList = state.nodesToBeAllocated.list;
      const nodesToBeDeallocated = state.nodesToBeDeallocated.list;

      if (nodesToBeDeallocated.length > 0) {
        nodesToBeDeallocated.forEach((nodeId) => {
          const connections = state.connectionMap[nodeId];
          connections?.forEach((connection) => {
            connection.canBeUnallocated = false;
          });
        });
      }

      if (nodesToBeAllocatedList.length > 0) {
        nodesToBeAllocatedList.forEach((nodeId) => {
          const connections = state.connectionMap[nodeId];
          connections?.forEach((connection) => {
            connection.canBeAllocated = false;
          });
        });
      }

      state.nodesToBeAllocated = {
        list: [],
        map: {},
      };
      state.nodesToBeDeallocated = {
        target: undefined,
        list: [],
        map: {},
      };
    },

    getNodesToAllocate: (state, { payload }: { payload: string }) => {
      const selectedNodes = state.allocatedNodes;
      const targetNodeId = payload;

      const queue: string[] = [targetNodeId];
      const visited: { [id: string]: number } = { [targetNodeId]: 1 };
      const distance: { [id: string]: number } = { [targetNodeId]: 0 };
      const previous: { [id: string]: string | null } = {
        [targetNodeId]: null,
      };

      while (queue.length) {
        let currentNodeId: string = queue.shift()!;
        if (selectedNodes[currentNodeId]) break;

        const neighborsList = [
          ...state.nodeMap[currentNodeId].in,
          ...state.nodeMap[currentNodeId].out,
        ];
        neighborsList.forEach((node) => {
          if (!visited[node]) {
            visited[node] = 1;
            queue.push(node);
            previous[node] = currentNodeId;
            distance[node] = distance[currentNodeId] + 1;
          }
        });
      }

      state.nodesToBeAllocated = getShortestPathMap(
        selectedNodes,
        distance,
        previous
      );
    },

    getNodesToDeallocate: (state, { payload }: { payload: string }) => {
      const selectedNodes = state.allocatedNodes;
      const target = payload;
      const queue: string[] = [target];
      const deallocateList: string[] = [];
      while (queue.length) {
        let currentNodeId: string = queue.shift()!;
        deallocateList.push(currentNodeId);

        const nextNodes: (string | undefined)[] = selectedNodes[currentNodeId];
        nextNodes.forEach((connection) => {
          if (connection !== undefined) {
            queue.push(connection);
          }
        });
      }
      const deallocateMap = deallocateList.reduce((acc, cur) => {
        return { ...acc, [cur]: 1 };
      }, {});
      state.nodesToBeDeallocated = {
        target,
        list: deallocateList,
        map: deallocateMap,
      };
    },

    triggerTreeUpdateOnClick: (state) => {
      state.treeUpdateOnClick = true;
    },

    updateTreeOnClick: (state) => {
      const targetNodeToBeDeallocated = state.nodesToBeDeallocated.target;
      const nodesToBeDeallocatedList = state.nodesToBeDeallocated.list;
      const allocatedNodesList = Object.keys(state.allocatedNodes);
      const allocatedNodesState = state.allocatedNodes;
      // deallocate nodes
      if (nodesToBeDeallocatedList.length > 0) {
        nodesToBeDeallocatedList.forEach((nodeId) => {
          const node = state.nodeMap[nodeId];
          if (node) {
            node.isSelected = false;
          }
        });
        // remove all connection from allocated nodes
        allocatedNodesList.forEach((nodeId) => {
          // set new edge node

          if (allocatedNodesState[nodeId][0] === targetNodeToBeDeallocated) {
            allocatedNodesState[nodeId] = [undefined];
          }

          const connections = state.connectionMap[nodeId];
          connections?.forEach((connection) => {
            connection.isSelected = false;
          });
        });

        // filter out deallocated nodes from allocated nodes state
        nodesToBeDeallocatedList.forEach((nodeId) => {
          delete state.allocatedNodes[nodeId];
        });
        const filteredAllocatedNodesState = Object.keys(state.allocatedNodes);

        // connect all nodes after filtering out deallocated nodes
        filteredAllocatedNodesState.forEach((nodeId) => {
          const node = state.nodeMap[nodeId];
          if (node) {
            const connections = state.connectionMap[nodeId];
            connections?.forEach((connection) => {
              if (state.allocatedNodes[connection.toNode.nodeId]) {
                connection.isSelected = true;
              }
            });
          }
        });

        state.nodesToBeDeallocated = {
          target: undefined,
          list: [],
          map: {},
        };
        state.treeUpdateOnClick = false;
        return;
      }
      // allocate nodes
      if (Object.keys(allocatedNodesState).length > 0) {
        Object.keys(allocatedNodesState).forEach((nodeId) => {
          const node = state.nodeMap[nodeId];
          if (node) {
            node.isSelected = true;
            const connections = state.connectionMap[nodeId];
            connections?.forEach((connection) => {
              if (state.allocatedNodes[connection.toNode.nodeId]) {
                connection.isSelected = true;
              }
            });
          }
        });
      }

      state.treeUpdateOnClick = false;
    },

    allocateNodes: (state) => {
      const nodesToBeAllocatedList = state.nodesToBeAllocated.list;
      if (nodesToBeAllocatedList.length > 0) {
        const selectedNodes = state.allocatedNodes;

        // add new nodes to already allocated nodes
        nodesToBeAllocatedList.forEach((nodeId, index) => {
          if (selectedNodes[nodeId]) {
            const filteredOutEdges = selectedNodes[nodeId].filter(
              (nodeId) => nodeId !== undefined
            );
            selectedNodes[nodeId] = [
              ...filteredOutEdges,
              nodesToBeAllocatedList[index + 1],
            ];
          } else {
            selectedNodes[nodeId] = [nodesToBeAllocatedList[index + 1]];
          }
        });
      }
    },
  },
});

export const {
  triggerTreeUpdateOnClick,
  triggerTreeUpdateOnHover,
  allocateNodes,
  getNodesToDeallocate,
  getNodesToAllocate,
  removeHighLight,
  updateTreeOnHover,
  updateTreeOnClick,
} = atlasTreeSlice.actions;

export default atlasTreeSlice.reducer;
