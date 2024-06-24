import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Store from './store';
import Home from './components/Home';
import Services from './components/Services';
import Login from './components/Login';
import { RootState } from './store/reducers';
import { ToastContainer } from 'react-toastify';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import Task from './components/Task';
import Project from './components/Project';
import AttendanceComponent from './components/Attendance';
import EmployeeProblemPreview from './components/EmployeeProblemPreview';

export default function App() {
  const loggedIn = useSelector((state: RootState) => state.company.loggedIn);
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();

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

  return (
    <Provider store={Store}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={loggedIn ? <Home /> : <Login />} />
          <Route path="/services" element={loggedIn ? <Services /> : <Login />} />
          <Route path="/attendance" element={loggedIn ? <AttendanceComponent /> : <Login />} />
          <Route path="/problems" element={loggedIn ? <EmployeeProblemPreview /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/task/:id" element={loggedIn ? <Task /> : <Login />} />
          <Route path="/project/:id" element={loggedIn ? <Project /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}