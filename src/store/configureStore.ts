import { Action, applyMiddleware, createStore, Middleware, Reducer } from "redux";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import { PersistPartial } from "redux-persist/lib/persistReducer";
import thunk from "redux-thunk";

import { NODE_ENV } from "../lib/react/environmentVariables";
import { persistConfig } from "./persistConfig";
import { rootReducer } from "./rootReducer";

const middlewares: Middleware[] = [
    thunk,
];

// Log Redux actions (only in development)
if (NODE_ENV === "development") {
    // middlewares.push(createLogger({ collapsed: true }));
}

// Workaround createStore not liking type of persistReducer
const typedPersistReducer = <S, A extends Action>(config: PersistConfig<S>, reducer: Reducer<S, A>):
    Reducer<S & PersistPartial, A> => {
    return persistReducer<S, A>(
        config,
        reducer
    );
};

const persistedReducer = typedPersistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer,
    applyMiddleware(...middlewares),
);
export const persistor = persistStore(store);
