import { AnyAction } from 'redux';


interface CompanyState {
  name: string | null;
  loggedIn: boolean;
  token: string | null;
  projects: any[]; // Placeholder for project data
  projectData: any; // Placeholder for specific project data
  tasks: any[]; // Placeholder for tasks
  is_client: boolean;
  userType: string;
}

const initialState: CompanyState | any = () => {
  const cachedResponse = localStorage.getItem('loginResponse'); 
  // console.log('cachedResponse',cachedResponse);
  if (cachedResponse) {
    try {
      const data = JSON.parse(cachedResponse);
      return data;
    } catch (error) {
      console.error('Error parsing cached login response:', error);
      // Fall back to the initial state
      return {
        name: null,
        loggedIn: false,
        token: null,
        projects: [],
        projectData: null,
        tasks: [],
        is_client: false,
        userType: 'site_technical',
      };
    }
  }
  return {
    name: null,
    loggedIn: false,
    token: null,
    projects: [],
    projectData: null,
    tasks: [],
    is_client: false,
    userType: 'site_technical',
  };
};



const companyReducer = (state: CompanyState = initialState, action: AnyAction): CompanyState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedIn: true,
        name: action.payload.name,
        token: action.payload.token,
        is_client: action.payload.is_client,
        userType: action.payload.userType,
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
        token: null,
      };
    case 'FETCH_PROJECTS_REQUEST':
      return {
        ...state,
        // Potentially set a loading flag or other state changes
      };
    case 'FETCH_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: action.payload.projects,
      };
    case 'FETCH_PROJECT_DATA_REQUEST':
      return {
        ...state,
        // Potentially set a loading flag or other state changes
      };
    case 'FETCH_PROJECT_DATA_SUCCESS':
      return {
        ...state,
        projectData: action.payload.projectData,
      };
    case 'FETCH_TASKS_REQUEST':
      return {
        ...state,
        // Potentially set a loading flag or other state changes
      };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        tasks: action.payload.tasks,
      };
    default:
      return state;
  }
};

export default companyReducer;