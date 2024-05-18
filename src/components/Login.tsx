// Login.tsx
import React, { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { loginUser } from '../store/companyActions';

interface LoginProps {
  // Add any props you need
}

const Login: React.FC<LoginProps> = () => {
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data:any = await dispatch(loginUser({ username: email, password }));
      console.log(data.payload);
      dispatch({
        type: 'LOGIN',
        payload: {
          token: data.payload.token,
          name: data.payload.username
        },
      });
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <section className="h-screen">
      <div className="h-full flex justify-center items-center">
        <form onSubmit={handleLogin} className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">Sign In</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-success bg-green-200 text-white py-2 px-4 rounded-md hover:bg-primary-dark"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;