import { combineReducers, createStore  } from "redux";
import accountPrefReducer from './ducks/accountPref';
import blogAuthReducer from './ducks/blogAuth';



const reducer = combineReducers({
    auth: blogAuthReducer,
    accountPrefs: accountPrefReducer,
});

const store = createStore(reducer);

export default store;