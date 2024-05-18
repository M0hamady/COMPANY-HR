// companyReducer.ts

import { AnyAction } from 'redux';

interface CompanyState {
  name: string;
  loggedIn: boolean;
}

const initialState: CompanyState = {
  name: 'hr',
  loggedIn: false,
};

const companyReducer = (state: CompanyState = initialState, action: AnyAction): CompanyState => {
  switch (action.type) {
    // Add an action to handle login status update
    case 'LOGIN':
      return {
        ...state,
        loggedIn: true,
      };
    // Add an action to handle logout status update
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
      };
    default:
      return state;
  }
};

export default companyReducer;