import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSearch, BiCalendarAlt, BiSortAlt2 } from 'react-icons/bi';
import { formatDateAndTimeArabic } from '../utilies/modate';

// Loader component
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

interface Problem {
  id: number;
  text: string;
  is_solved: boolean;
  date_solved: string | null;
  date_created: Date | string;
  degree_of_problem: string;
  task: number;
  solved_by: string | null;
  task_: string | null;
  client: string | null;
}

// EmployeeProblemPreview Component
const EmployeeProblemPreview: React.FC = () => {
  const [employeeProblems, setEmployeeProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc'>('date_desc');
  
  useEffect(() => {
    const fetchEmployeeProblems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://hrsupport.pythonanywhere.com/api/task-problems/', {
          params: {
            startDate,
            endDate,
          },
        });
        setEmployeeProblems(response.data);
        setFilteredProblems(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching employee problems:', error);
        setIsLoading(false);
      }
    };
  
    fetchEmployeeProblems();
  }, [startDate, endDate]);
  
  useEffect(() => {
    handleFilter();
  }, [searchTerm, sortBy, employeeProblems, startDate, endDate]);
  
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };
  
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };
  
  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as 'date_asc' | 'date_desc');
  };
  function sort_by<T>(list_to_sort: T[], key_function: (item: T) => number): T[] {
    return list_to_sort.slice().sort((a, b) => {
      const valueA = key_function(a);
      const valueB = key_function(b);
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  }
  const handleFilter = () => {
    let filteredData = employeeProblems.slice();
  
    // Perform search filtering
    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter((problem) =>
        problem.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (problem.client && problem.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (problem.task_ && problem.task_.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  
    // Perform date range filtering
    if (startDate && endDate) {
      filteredData = filteredData.filter((problem) => {
        const problemDate = problem.date_created ? new Date(problem.date_created) : null;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
  
        if (problemDate && start && end) {
          return problemDate >= start && problemDate <= end;
        } else {
          return true; // Include if any date is null
        }
      });
    }
  
    // Perform sorting
    filteredData.sort((a, b) => {
      const dateA = a.date_created ? new Date(a.date_created).getTime() : 0;
      const dateB = b.date_created ? new Date(b.date_created).getTime() : 0;
  
      if (sortBy === 'date_asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA; // Default to descending sort
      }
    });
  
    setFilteredProblems(filteredData);
  };

  return (
    <div className="container max-w-[97vw]">
      <div className="bg-gray-100 p-4 my-2 mx-2 rounded-lg max-w-[90vw]">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <BiSearch className="mr-2 " />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="w-full sm:w-auto bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center max-sm:flex-col">
            <div className="flex items-center mb-2 sm:mb-0 mr-4">
              <BiCalendarAlt className="mr-2 " />
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full sm:w-auto bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="mx-2 ">-</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full sm:w-auto bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <BiSortAlt2 className="mr-2 " />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full sm:w-auto bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date_asc">Sort by Date (Ascending)</option>
                <option value="date_desc">Sort by Date (Descending)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-right max-w-[90vw] mx-2">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => (
              <div
                key={index}
                className={`${!problem.is_solved ? 'bg-red-900 text-white' : 'bg-green-900 text-white'} is_solved shadow-md rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 text-right`}
              >
                <div className="flex gap-2 justify-end">
                  <p className="">{problem.client}</p>
                  <p className="">:العميل</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <p className="">{problem.task_}</p>
                  <p className="">:الباند</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <p className="">{problem.text}</p>
                  <p className="">:المشكلة</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <p className=""> { problem.date_created && formatDateAndTimeArabic(problem.date_created)}</p>
                  <p className="">:ناريخ المشكلة</p>
                </div>
                {
                 problem.date_solved  &&  
                <div className="flex gap-2 justify-end">
                  <p className=""> { problem.date_solved && formatDateAndTimeArabic(problem.date_solved)}</p>
                  <p className="">:ناريخ حل المشكلة</p>
                </div>
                }
                {
                 problem.solved_by !== 'None'  &&  
                <div className="flex gap-2 justify-end">
                  <p className=""> { problem.solved_by && problem.solved_by }</p>
                  <p className="">:القائم بالحل</p>
                </div>
                }
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8 text-right">
              <p>لا توجد مشاكل موظفين للعرض حاليًا.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeProblemPreview;
