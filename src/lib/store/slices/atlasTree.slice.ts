import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseTreeData } from "../../parseTreeData";
import { InternalAtlasTree } from "../../services/AtlasTree/AtlasTree.interface";

export interface AtlasTreeState {
  rootNodeId: string;
  nodeMap: Record<string, InternalAtlasTree.Node>;
  connectionMap: Record<string, InternalAtlasTree.Connection[]>;
  constants: InternalAtlasTree.Constants;
  //   nodeList:
  // connectionList:
  selectedNodeList: string[];
  shortPathNodeList: string[];
}
const { nodeMap, constants, connectionMap } = parseTreeData();
const initialState: AtlasTreeState = {
  rootNodeId: "29045",
  nodeMap,
  connectionMap,
  constants,
  // nodeList:[],
  // connectionList:[],
  selectedNodeList: [],
  shortPathNodeList: [],
};

export const atlasTreeSlice = createSlice({
  name: "atlasTree",
  initialState,
  reducers: {
    updateTreeState: (state) => {
      state.selectedNodeList?.forEach((nodeId) => {
        const node = state.nodeMap[nodeId];
        if (node) {
          node.isSelected = true;

          const rootConnection = state.connectionMap[state.rootNodeId];
          rootConnection.forEach((rootConnection) => {
            if (rootConnection.toNode.nodeId === nodeId) {
              rootConnection.isSelected = true;
            }
          });

          const connections = state.connectionMap[nodeId];
          connections?.forEach((connection) => {
            if (state.selectedNodeList.includes(connection.toNode.nodeId)) {
              connection.isSelected = true;
            }
          });
        }
      });
    },

    selectNode: (state, { payload }) => {
      state.selectedNodeList.push(payload);
    },
    removeNodeSelection: (state, { payload }) => {
      state.selectedNodeList = state.selectedNodeList.filter((nodeId) => nodeId !== payload);
      const node = state.nodeMap[payload];
      if (node) {
        node.isSelected = false;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTreeState, selectNode, removeNodeSelection } = atlasTreeSlice.actions;

export default atlasTreeSlice.reducer;
