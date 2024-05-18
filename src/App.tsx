import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux'; // Import the Provider component
import Store from './store';
import Home from './components/Home';
import Services from './components/Services';
import Login from './components/Login';
import { RootState } from './store/reducers';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const loggedIn = useSelector((state: RootState) => state.company.loggedIn);
  console.log(loggedIn);
  
  return (
    <Provider store={Store}> {/* Wrap your application with the Provider component */}
        <ToastContainer />

      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={ loggedIn ? <Home /> : <Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} /> {/* Add a route for the login component */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
