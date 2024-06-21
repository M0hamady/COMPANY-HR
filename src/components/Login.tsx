import React, { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { loginUser } from '../store/companyActions';
import { toast } from 'react-toastify'; // Make sure to import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
  // Add any props you need
}

const Login: React.FC<LoginProps> = () => {
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data:any = await dispatch(loginUser({ username: email, password }));
      dispatch({
        type: 'LOGIN',
        payload: {
          token: data.payload.token,
          name: data.payload.username
        },
      });
    } catch (error) {
      toast.error('اسم المستخدم او كلمة المرور غير صحيح', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen text-right">
      <div className="h-full flex justify-center items-center">
        <form onSubmit={handleLogin} className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">تسجيل الدخول</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              :اسم المستخدم
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
              كلمة المرور
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
            className="w-full btn btn-success bg-green-200 text-black font-bold py-2 px-4 rounded-md hover:bg-primary-dark"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'تسجيل اللدخول'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;