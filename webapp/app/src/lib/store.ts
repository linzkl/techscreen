import { configureStore } from "@reduxjs/toolkit";
import { loadState, localStorageMiddleware } from "./localStorage";
import metaReducer from "./features/metaSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      metadata: metaReducer,
    },
    preloadedState: loadState() as {
      metadata: Metadata;
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
