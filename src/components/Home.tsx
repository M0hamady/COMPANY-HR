import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/reducers";
import { ProjectCard } from "../utilies/ProjectCard";
import { getExactProject, getProjects } from "../store/companyActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useDispatch } from "react-redux";
import Layout from "../utilies/Layout";
import Loading from "../utilies/LoadingComponent";
import { Card } from "../utilies/TaskCard";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [countUpdates, setCountUpdates] = useState<number | null>(0);
  const [selectedProjectNum, setSelectedProjectNum] = useState<number | null>(
    null
  );
  const [selectedProjectTasks, setSelectedProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const handleProjects = async () => {
    try {
      const data_projects: any = await dispatch(getProjects());
      setProjects(data_projects.payload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    handleProjects();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: any = await dispatch(getExactProject(selectedProjectNum));
        setSelectedProjectTasks(data.payload.all_tasks);
        setLoading(false);
      } catch (error: unknown) {
        setLoading(false);
        if (error instanceof Error) {
          console.error("Error fetching project:", error.message);
        }
      }
    };

    if (selectedProjectNum !== null) {
      fetchData();
    }
  }, [selectedProjectNum, countUpdates]);

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 bg-[#071e34] max-w-[100vw] lg:h-[100vh]">
          <div className="p-4 flex flex-col gap-2 h-[25vh] max-sm:h-[25vh]  sm:w-2/7 max-400:h-[42vh]">
            <div className="row-span-3  ">
              <section className="mx-auto bg-[#20354b] rounded-2xl px-2 py-2 shadow-lg  ">
                <div className="mt-8">
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
                <div className="mt-3 text-white text-sm grid-cols-1 text-right">
                  <span className="text-gray-400 font-semibold col-span-1 text-right">
                    اعمال اليوم : %40{" "}
                  </span>
                </div>
              </section>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2 h-[100vh] sm:w-5/7 sm:h-[40vh] max-w-[84vw] max-sm:max-w-[99vw] max-400:h-[140vh] max-400:relative lg:h-[100vh] ">
            <div className="row-span-2 text-white flex flex-row gap-2 overflow-auto w-full lg:h-[100vh] max-400:h-[40vh]  ">
              {projects ? (
                projects.map((item, index) => (
                  <ProjectCard
                    key={index}
                    item={item}
                    index={index}
                    setSelectedProjectNum={setSelectedProjectNum}
                  />
                ))
              )
              : (
                <Link to={"/login"}>اضغط هنا</Link>
              )}
            </div>
            <div className="row-span-7 text-white flex flex-row justify-around flex-wrap gap-2 overflow-auto   h-[700px] max-sm:h-[740px]  max-400:h-[90vh] max-400:bottom-0  ">
              {selectedProjectTasks.map((item, index) => (
                <Card
                  key={index}
                  item={item}
                  index={index}
                  setCountUpdates={setCountUpdates}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
