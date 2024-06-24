import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Attendance,
  TodayAttendance,
  getAttendance,
  getTodayAttendance,
  postAttendance,
} from "../store/companyActions";
import { LoginResponse } from "../utilies/Problems";
import Layout from "../utilies/Layout";

const AttendanceComponent: React.FC = () => {
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [attendanceStatus, setAttendanceStatus] = useState<
    "checked-in" | "checked-out" | null
  >(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]); // State to hold attendance data
  const [lastAttendanceData, setLastAttendanceData] =
    useState<Attendance | null>(null); // State to hold last attendance data
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance[]>([]);
  const cachedResponseJson = localStorage.getItem("loginResponse");

  let cachedResponse: LoginResponse | null = null;

  if (cachedResponseJson) {
    cachedResponse = JSON.parse(cachedResponseJson);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setError("");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setCurrentDateTime(formattedDateTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAttendanceData = () => {
    dispatch(getAttendance()).then((response: any) => {
      if (!response.error) {
        setAttendanceData(response.payload);
        setLastAttendanceData(response.payload[response.payload.length - 1]);
        if (response.payload.length > 0) {
          if (!response.payload[response.payload.length - 1]?.check_out) {
            setAttendanceStatus("checked-in");
          } else {
            setAttendanceStatus("checked-out");
          }
        }
      } else {
        // Handle error case, such as unauthorized access or other errors
        setError("error while handling attendance date");
        console.error(response.error.message);
      }
    });
  };
  const handleAttendanceDataEmployee = () => {
    dispatch(getTodayAttendance()).then((response: any) => {
      if (!response.error) {
        // console.log(response.payload, "atendance");
        setTodayAttendance(response.payload);
      } else {
        // Handle error case, such as unauthorized access or other errors
        console.error("err");
      }
    });
  };
  useEffect(() => {
    handleAttendanceData();
    handleAttendanceDataEmployee();
  }, [attendanceStatus]);
  useEffect(() => {
    const interval = setInterval(() => {
      handleAttendanceData();
      handleAttendanceDataEmployee();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              reject(new Error("We were unable to access your location. Please allow location access for this feature to work"));
            } else {
              // Handle other errors (e.g., geolocation failure)
              // Optionally, provide alternative methods here (e.g., IP geolocation or manual entry)
              reject(error);
            }
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };
  

  const handleCheckIn = async () => {
    try {
      const location = await getLocation();
      const currentDateTime = new Date();

      await dispatch(
        postAttendance({
          latitude: location.latitude,
          longitude: location.longitude,
          id: 0,
          check_in: null,
          check_out: null,
          duration: null,
          user: null,
        })
      );
      setAttendanceStatus("checked-in");
    } catch (err) {
      setError(
        `هذا الجهاز لا يدعم خاصية تحديد الموقع يرجي تسجيل الحضور من جهاز ${err}`
      );
      console.error("Error checking in:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const location = await getLocation();
      const currentDateTime = new Date();

      await dispatch(
        postAttendance({
          latitude: location.latitude,
          longitude: location.longitude,
          id: 0,
          check_in: null,
          check_out: null,
          duration: null,
          user: null,
        })
      );
      setAttendanceStatus("checked-out");
    } catch (error) {
      setError("error while handling check out ");
      console.error("Error checking out:", error);
    }
  };

  const getGoogleMapsLink = () => {
    if (location.latitude && location.longitude) {
      return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    }
    return "";
  };

  return (
    <Layout>
      {error && (
        <div className="w-full md:w-1/3 mx-auto">
          <div className="flex p-5 rounded-lg shadow bg-white">
            <div>
              <svg
                className="w-6 h-6 fill-current text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
              </svg>
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-800">
                Warning Alert Title
              </h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-gradient-to-br gap-3 from-purple-800 to-indigo-800 p-8 rounded shadow-lg mt-8 flex ">
        <div
          className={`${
            cachedResponse?.userType === "manager" ||
            cachedResponse?.userType === "admin" 
              ? "border-r-2 border-green-300 px-2"
              : "w-full"
          } text-right`}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            الحضور والانصراف
          </h2>

          <div className="mb-4">
            {!attendanceStatus || attendanceStatus === "checked-out" ? (
              <button
                onClick={handleCheckIn}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                تسجيل الدخول
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                تسجيل الخروج
              </button>
            )}
          </div>

          {location.latitude && location.longitude && (
            <div className="mb-4">
              <a
                href={getGoogleMapsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                عرض الموقع على خرائط جوجل
              </a>
            </div>
          )}

          <div className="mt-4">
            <p className="text-sm text-gray-200">التاريخ والوقت الحالي:</p>
            <p className="text-lg font-bold text-white">{currentDateTime}</p>
          </div>

          <div>
            {lastAttendanceData ? (
              <div>
                <p className="text-sm text-gray-200">تاريخ آخر حضور:</p>
                <p className="text-lg font-bold text-white">
                  {lastAttendanceData.check_in &&
                    `${new Date(lastAttendanceData.check_in).toLocaleString(
                      "ar-EG",
                      {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        weekday: "long",
                      }
                    )}`}
                </p>
                {!lastAttendanceData.check_out && (
                  <p className="text-lg text-red-500 font-bold">
                    انت لم تغادر بعد
                  </p>
                )}
              </div>
            ) : (
              <p className="text-lg font-bold text-white">
                {" "}
                لم يتم تسجيل حضورك بعد{" "}
              </p>
            )}

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-white">
                المواعيد السابقة
              </h3>
              <ul className="divide-y divide-gray-200 flex flex-col-reverse">
                {attendanceData.map((attendance, index) => (
                  <li key={index} className="py-2">
                    <p className="text-lg font-bold text-white">
                      {`${
                        attendance.check_in &&
                        new Date(attendance.check_in).toLocaleString("ar-EG", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          weekday: "long",
                        })
                      }`}
                      {attendance.check_out ? (
                        <span className="ml-2 text-green-500"> تم الخروج </span>
                      ) : (
                        <span className="ml-2 text-red-500">
                          {" "}
                          لم يتم الخروج بعد{" "}
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {cachedResponse?.userType === "manager" ||
        cachedResponse?.userType === "admin"  ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white w-full text-right">
              حضور اليوم
            </h2>
            <div className="max-h-[90vh] overflow-auto scrollbar-hide ">
              {todayAttendance?.map((item) => (
                <div
                  key={`${item.userName}-${item.check_in}`}
                  className={`bg-${
                    item.check_in && item.check_out ? "green-500" : "gray-200"
                  } p-4 mb-4 rounded-lg shadow-md`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {item.userName}
                      </h3>
                      <p className="text-gray-600">Duration:</p>
                      <p className="text-gray-600">{item.totalDuration}</p>
                      <p className="text-gray-600">
                        {item.checkInLocation.googleMapsLink && (
                          <a
                            href={item.checkInLocation.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View on Map
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </Layout>
  );
};

export default AttendanceComponent;
