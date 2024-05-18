import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/reducers";
import { Card } from "../utilies/TaskCard";


const Home: React.FC = () => {
  const name = useSelector((state: RootState) => state.company.name);
  const loggedIn = useSelector((state: RootState) => state.company.loggedIn);
  console.log("from home is he logged in? ", loggedIn, name);
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="grid grid-cols-7 gap-2 bg-[#071e34]">
      <div className=" p-4 col-span-2 grid grid-rows-9 gap-2 h-[100vh]">
        <div className=" row-span-2">
          <section className="mx-auto bg-[#20354b] rounded-2xl px-2 py-2 shadow-lg">
            <div className="mt-8 ">
              <h2 className="text-white font-bold text-2xl tracking-wide">
                {name}
              </h2>
            </div>
            <p className="text-emerald-400 font-semibold mt-2.5">
              {loggedIn && "Active"}
            </p>

            <div className="h-1 w-full bg-black mt-8 rounded-full">
              <div className="h-1 rounded-full w-2/5 bg-yellow-500 "></div>
            </div>
            <div className="mt-3 text-white text-sm grid-cols-1 text-right ">
              <span className="text-gray-400 font-semibold col-span-1 text-right  ">
                اعمال اليوم : %40{" "}
              </span>
            </div>
          </section>
        </div>
        <div className=" row-span-7 text-white  flex flex-col gap-2 overflow-auto ">
          {items.map((item, index) => (
            <Card key={index} item={item} index={index} />
          ))}
        </div>
      </div>
      <div className=" p-4 col-span-5">
        <p>
          Please{" "}
          <Link to="/services" className="text-blue-500 underline">
            click here
          </Link>{" "}
          to choose a service.
        </p>
      </div>
    </div>
  );
};

export default Home;