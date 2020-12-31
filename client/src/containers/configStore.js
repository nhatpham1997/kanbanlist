import {createStore, applyMiddleware} from 'redux';
import {createBrowserHistory} from 'history'
import {routerMiddleware} from 'connected-react-router';
import createRootReducer from './reducer';
import thunkMiddle from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

const history = createBrowserHistory();

const resetEnhanser = rootReducer => (state, action)=>{
    if(action.type !== "RESET") return rootReducer(state, action)
    const newState = rootReducer(undefined, {});
    newState.router = state.router;
    return newState
}

let store;
export function configStore(preloadState){
    const middleware = [thunkMiddle, routerMiddleware(history)].filter(Boolean);
    store = createStore(
        resetEnhanser(createRootReducer(history)),
        preloadState,
        composeWithDevTools(applyMiddleware(...middleware))
    )
    return store;
}

export function getHistory(){
    return history
}
export default function getStore(){
    return store
};
