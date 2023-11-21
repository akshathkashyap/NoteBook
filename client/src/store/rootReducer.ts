import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import tabReducer from './slices/tabSlice';
import userReducer from './slices/userSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  tab: tabReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
