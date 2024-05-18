export enum CompanyActionTypes {
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST',
    FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS',
  }
  
  export interface LoginRequestAction {
    type: CompanyActionTypes.LOGIN_REQUEST;
  }
  
  export interface LoginSuccessAction {
    type: CompanyActionTypes.LOGIN_SUCCESS;
    payload: any; // Adjust the payload type according to your API response
  }
  
  export interface FetchDataRequestAction {
    type: CompanyActionTypes.FETCH_DATA_REQUEST;
  }
  
  export interface FetchDataSuccessAction {
    type: CompanyActionTypes.FETCH_DATA_SUCCESS;
    payload: any; // Adjust the payload type according to your API response
  }
  
  export type CompanyAction =
    | LoginRequestAction
    | LoginSuccessAction
    | FetchDataRequestAction
    | FetchDataSuccessAction;