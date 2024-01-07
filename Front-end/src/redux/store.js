import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/productSlide';
import userReducer from './slice/userSlide';
import checkProductProducer from './slice/checkProductSlide';
import cartReducer from './slice/cartSlide';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	blacklist: ['product', 'user'],
};

const rootReducer = combineReducers({
	product: productReducer,
	checkProduct: checkProductProducer,
	user: userReducer,
	cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});
export let persistor = persistStore(store);
