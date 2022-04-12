import atlasTreeReducer from "./slices/atlasTree.slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    atlasTree: atlasTreeReducer,
  },
});

// Infer the `AppState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
