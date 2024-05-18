import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/reducers";
import { Card } from "../utilies/TaskCard";
import { ProjectCard } from "../utilies/ProjectCard";
import { getExactProject, getProjects, getTasks } from "../store/companyActions";
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useDispatch } from 'react-redux';

interface Project {
  id: number;
  title: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
}
const Home: React.FC = () => {
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();
  const name = useSelector((state: RootState) => state.company.name);
  const loggedIn = useSelector((state: RootState) => state.company.loggedIn);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectNum, setSelectedProjectNum] = useState<number | null>(null);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState<Task[]>([]);
  console.log("from home is he logged in? ", loggedIn, name);
  const items = [1, 2, 3, 4, 5, 6,7,8];
  const handleTasks = async () => {
    try {
      const data:any = await dispatch(getTasks());
      const data_projects:any = await dispatch(getProjects());
      setTasks(data.payload)
      setProjects(data_projects.payload)
      console.log(tasks);
    } catch (error) {
      // Handle login error
    }
  };
  useEffect(()=>{
    handleTasks()
    
  },[500])
  useEffect(() => {
    console.log("tr");
    const fetchData = async () => {
      try {
        const data:any = await dispatch(getExactProject(selectedProjectNum));
        // Do something with the data if needed
        setSelectedProjectTasks(data.payload.all_tasks);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Handle the error
          console.error('Error fetching project:', error.message);
        }
      }
    };
  
    if (selectedProjectNum !== null) {
      fetchData();
    }
  }, [selectedProjectNum]);
  return (
    <div className="grid grid-cols-7 gap-2 bg-[#071e34]">
      <div className=" p-4 col-span-2 grid grid-rows-11 gap-2 h-[100vh]">
        <div className=" row-span-3 ">
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
        <div className=" row-span-9 text-white  flex flex-col gap-2 overflow-auto ">
          {tasks.map((item, index) => (
            <Card key={index} item={item} index={index} />
          ))}
        </div>
      </div>
      <div className=" p-4 col-span-5 grid grid-rows-9 gap-2 h-[100vh]">
       <div className=" row-span-2 text-white  flex flex-row gap-2 overflow-x-auto">
       {projects.map((item, index) => (
        <ProjectCard key={index} item={item} index={index} setSelectedProjectNum={setSelectedProjectNum} />
          ))}
       </div>
       <div className="row-span-7 text-white  flex flex-row justify-around flex-wrap gap-2 overflow-auto">

       {selectedProjectTasks.map((item, index) => (
            <Card key={index} item={item} index={index} />
          ))}
       </div>
      </div>
    </div>
  );
};

export default Home;