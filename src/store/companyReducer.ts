import { AnyAction } from 'redux';

interface CompanyState {
  name: string | null;
  loggedIn: boolean;
  token: string | null;
}

const initialState: CompanyState = {
  name: null,
  loggedIn: true,
  token: null,
};

const companyReducer = (state: CompanyState = initialState, action: AnyAction): CompanyState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedIn: true,
        name: action.payload.name,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
        token: null,
      };
    default:
      return state;
  }
};

export default companyReducer;