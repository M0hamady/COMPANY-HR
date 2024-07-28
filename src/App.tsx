import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Store from './store';
import Home from './components/Home';
import Services from './components/Services';
import Login from './components/Login';
import WelcomePage from './components/Welcome';
import { RootState } from './store/reducers';
import { ToastContainer } from 'react-toastify';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import Task from './components/Task';
import Project from './components/Project';
import AttendanceComponent from './components/Attendance';
import EmployeeProblemPreview from './components/EmployeeProblemPreview';
import DynamicForm from './utilies/DynamicForm';
import EngineerRequests from './components/Engineering_requests';
import { useEffect } from 'react';
import Tickets from './components/Tickets';

export default function App() {
  const loggedIn = useSelector((state: RootState) => state.company.loggedIn);
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();
//   useEffect(() => {
//     if (Notification.permission !== 'granted') {
//         Notification.requestPermission();
//     }
// }, []);
  const cachedResponse = localStorage.getItem('loginResponse');
  if (cachedResponse) {
    const data = JSON.parse(cachedResponse);
    dispatch({
      type: 'LOGIN',
      payload: {
        token: data.token,
        loggedIn: true,
        name: data.username,
        is_client: data.is_client,
        userType: data.userType,
      },
    });
  }
  const fields = [
    { name: 'Name', type: 'text' },
    { name: 'Birth Date', type: 'date' },
    { name: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
    { name: 'Residence', type: 'text' },
    { name: 'Secondary Residence', type: 'text' },
    { name: 'Phone Number', type: 'tel' },
    { name: 'Secondary Phone', type: 'tel' },
    { name: 'Contact Email', type: 'email' },
    { name: 'Military Status', type: 'select', options: ['Exempted', 'Postponed', 'Serving'] },
    { name: 'Graduation Year', type: 'number' },
    { name: 'Specialization', type: 'text' },
    { name: 'University/Institute', type: 'text' },
    { name: 'Has Driving License', type: 'select', options: ['Yes', 'No'] },
    { name: 'Owns a Car', type: 'select', options: ['Yes', 'No'] },
    { name: 'Employment Status', type: 'text' },
    { name: 'Workplace (if any)', type: 'text' },
    { name: 'Available Start in Days', type: 'number' },
    { name: 'Last Salary', type: 'number' },
    { name: 'Expected Salary', type: 'number' },
    { name: 'Years of Interior Finishing Experience', type: 'number' },
  ];
  
  const sections = [
    { name: 'Personal Information', fields: fields.slice(0, 7) },
    { name: 'Contact Information', fields: fields.slice(7, 10) },
    { name: 'Education & Employment', fields: fields.slice(10) },
  ];
  const apiUrl = 'http://127.0.0.1:8000/api/form-data/';

  return (
    <Provider store={Store}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={loggedIn ? <Home /> : <Login />} />
          <Route path="/tickets" element={loggedIn ? <Tickets /> : <Login />} />
          <Route path="/services" element={loggedIn ? <Services /> : <Login />} />
          <Route path="/attendance" element={loggedIn ? <AttendanceComponent /> : <Login />} />
          <Route path="/problems" element={loggedIn ? <EmployeeProblemPreview /> : <Login />} />
          <Route path="/task/:id" element={<Task /> } />
          <Route path="/project/:id" element={<Project /> } />
          <Route path="/apply" element={<DynamicForm sections={sections}  apiUrl={apiUrl}/>} />
          <Route path="/engineering-requests" element={<EngineerRequests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={loggedIn ? <WelcomePage /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}