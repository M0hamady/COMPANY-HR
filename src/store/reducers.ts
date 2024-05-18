// reducers.ts

import { combineReducers } from 'redux';
import companyReducer from './companyReducer';

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  company: companyReducer,
  // Add other reducers here if needed
});

export default rootReducer;