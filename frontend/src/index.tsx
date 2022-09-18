import React from 'react';
import ReactDOM from 'react-dom/client';

// CSS
import './index.css';
import './assets/fonts/fonts.css';

// Components
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/global/store'

// Hooks
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

let persistor = persistStore(store);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
	<Provider store={store}>
			<PersistGate persistor={persistor}>
				<App />
			</PersistGate>
	</Provider>
);
reportWebVitals();
