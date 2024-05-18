export const LOGIN_REQUEST = 'LOGIN_REQUEST' as const;
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS' as const;
export const LOGIN_FAILURE = 'LOGIN_FAILURE' as const;

// Add more action types if needed
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST' as const;
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS' as const;
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE' as const;

export type CompanyActionTypes =
  | typeof LOGIN_REQUEST
  | typeof LOGIN_SUCCESS
  | typeof LOGIN_FAILURE
  | typeof FETCH_DATA_REQUEST
  | typeof FETCH_DATA_SUCCESS
  | typeof FETCH_DATA_FAILURE;