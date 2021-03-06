import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import registerServiceWorker from './registerServiceWorker';
import MealPlannerApp from './components/MealPlannerApp';

const store = configureStore();

render(
    <Provider store={store}>
        <MealPlannerApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
