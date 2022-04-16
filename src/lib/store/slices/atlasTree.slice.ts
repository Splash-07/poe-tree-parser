import { createSlice, current } from "@reduxjs/toolkit";
import { parseTreeData } from "../../parseTreeData";
import { InternalAtlasTree } from "../../services/AtlasTree/AtlasTree.interface";

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
      if (nodesToBeDeallocatedList.length > 0) {
        nodesToBeDeallocatedList.forEach((nodeId) => {
          const node = state.nodeMap[nodeId];
          if (node) {
            node.isSelected = false;
          }
        });

        // remove all connection from allocated nodes
        nodesToBeAllocatedList.forEach((nodeId) => {
          const connections = state.connectionMap[nodeId];
          connections?.forEach((connection) => {
            connection.isSelected = false;
          });
        });

        // filter out deallocated nodes from allocated nodes state
        nodesToBeDeallocatedList.forEach((nodeId) => {
          delete state.nodesToBeAllocated[nodeId];
        });
        const filteredAllocatedNodesList = Object.keys(state.nodesToBeAllocated);

        // connect all nodes after filtering out deallocated nodes
        filteredAllocatedNodesList.forEach((nodeId) => {
          const node = state.nodeMap[nodeId];
          if (node) {
            const connections = state.connectionMap[nodeId];
            connections?.forEach((connection) => {
              if (state.nodesToBeAllocated[connection.toNode.nodeId]) {
                connection.isSelected = true;
              }
            });
          }
        });

        state.nodesToBeDeallocated = {};
        state.treeUpdate = false;
        return;
      }
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
    allocateNodes: (state, { payload }: { payload: string[] }) => {
      payload.forEach((nodeId) => (state.nodesToBeAllocated[nodeId] = 1));
    },
    deallocateNodes: (state, { payload }: { payload: string[] }) => {
      payload.forEach((nodeId) => (state.nodesToBeDeallocated[nodeId] = 1));
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTreeState, allocateNodes, deallocateNodes, triggerTreeUpdate } = atlasTreeSlice.actions;

export default atlasTreeSlice.reducer;
