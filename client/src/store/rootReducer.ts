import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import tabReducer from './slices/tabSlice';
import userReducer from './slices/userSlice';
import memoReducer from './slices/memoSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  tab: tabReducer,
  user: userReducer,
  memo: memoReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
