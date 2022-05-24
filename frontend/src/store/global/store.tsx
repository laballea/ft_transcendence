import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './reducer'
import { combineReducers } from 'redux';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'
const persistConfig = {
    key: 'global',
    storage:storageSession,
};

const reducers = combineReducers({ global: globalReducer });
const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

