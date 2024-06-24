import React, { useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { logout } from "../store/companyActions";
import { useDispatch } from "react-redux";
import { FaSchoolCircleCheck } from "react-icons/fa6";
import { LoginResponse } from "./Problems";
const cachedResponseJson = localStorage.getItem("loginResponse");

let cachedResponse: LoginResponse | null = null;

if (cachedResponseJson) {
  cachedResponse = JSON.parse(cachedResponseJson);
}

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLogout = () => {
    dispatch(logout() as any);
    // Dispatch the logout action
    window.location.reload();
  };

  return (
    <div className="flex flex-row bg-blue-950 h-[100% !important]  text-white">
      <div
        className={
          "hover:w-[100px] w-[50px] flex flex-col transition-all duration-300 shadow-2xl shadow-slate-500 drop-shadow-lg  py-4  justify-between align-middle min-h-[96vh] "
        }
      >
        <div className="flex flex-col gap-4 justify-center items-center h-50 w-100 ">
          {cachedResponse?.userType === "manager" ||
          cachedResponse?.userType === "admin" ? (
            <Link
              to={"/problems"}
              className="hover:bg-[#090b1a] p-2 w-full my-class hover:translate-x-1 flex justify-center duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                />
              </svg>
            </Link>
          ) : (
            ""
          )}

          <Link
            to={"/"}
            className="hover:bg-[#090b1a] hover:shadow-lg hover:translate-x-1 p-2 w-full my-class flex justify-center duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
          <Link
            to={"/attendance"}
            className="hover:bg-[#090b1a] hover:shadow-lg hover:translate-x-1 p-2 w-full my-class flex justify-center duration-300"
          >
            <FaSchoolCircleCheck />
          </Link>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center h-50">
          <button onClick={handleLogout}>
            {/* make this button while click logoout using last function logout */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4   w-full bg-[#090b1a] h-full">{children}</div>
    </div>
  );
};

export default Layout;
