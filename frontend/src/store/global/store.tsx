import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './reducer'
import socketSlice from '../socketMiddleware/socketSlice';
import { combineReducers } from 'redux';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'
import socketMiddleware from '../socketMiddleware/socketMiddleware';
const persistConfig = {
    key: 'global',
    storage:storageSession,
};

const reducers = combineReducers({ global: globalReducer, socket: socketSlice.reducer});
const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat([socketMiddleware]),
	
});

