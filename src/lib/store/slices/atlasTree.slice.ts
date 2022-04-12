import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseTreeData } from "../../parseTreeData";
import { InternalAtlasTree } from "../../services/AtlasTree/AtlasTree.interface";

export interface AtlasTreeState {
  nodeMap: Record<string, InternalAtlasTree.Node>;
  connectionMap: Record<string, InternalAtlasTree.Connection[]>;
  constants: InternalAtlasTree.Constants;
  activeNodesList: InternalAtlasTree.Node["nodeId"][];
  shortestPathNodeList: InternalAtlasTree.Node["nodeId"][];
}
const { nodeMap, constants, connectionMap } = parseTreeData();
const initialState: AtlasTreeState = {
  nodeMap,
  connectionMap,
  constants,
  activeNodesList: [],
  shortestPathNodeList: [],
};

export const atlasTreeSlice = createSlice({
  name: "atlasTree",
  initialState,
  reducers: {
    selectNode: (state, { payload }) => {
      state.nodeMap[payload.nodeId].isSelected = true;
    },
    removeNodeSelection: (state, { payload }) => {
      state.nodeMap[payload.nodeId].isSelected = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectNode, removeNodeSelection } = atlasTreeSlice.actions;

export default atlasTreeSlice.reducer;
