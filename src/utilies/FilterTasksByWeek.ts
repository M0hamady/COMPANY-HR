interface Project {
    id: number;
    current_week: number;
    owner: string;
    title: string;
    current_step: string;
    is_created_with_tasks: boolean;
    site_technical_employee: string | null;
    office_technical_employee: string | null;
    office_technical_manager: string | null;
    company_consultant: string | null;
    manager_employee: string | null;
    date_finished: string;
    date_created: string;
    date_updated: string;
    all_tasks: Task[];
  }
  
  interface Task {
    id: number;
    user: string;
    project_owner: string;
    project_createdBy: string | null;
    project_owner_technical: string | null;
    project_officeEng: string | null;
    title: string;
    week: string;
    description: string | null;
    is_finished: boolean;
    date_finished: string;
    date_created: string;
    date_updated: string;
    employee: string | null;
  }
  
  
  


export function filterTasksByWeek(project: Project , currentWeek: number ) {
    const tasks = project.all_tasks;
    const currentWeekTasks = tasks.filter(task => task.week === currentWeek.toString());
    
    const finishedTasks = tasks.filter(task => task.is_finished);
    const currentWeekFinishedTasks = currentWeekTasks.filter(task => task.is_finished);
    const currentWeekUnfinishedTasks = currentWeekTasks.filter(task => !task.is_finished);
    
    return {
      currentWeekFinishedTasks,
      finishedTasks: finishedTasks,
      finishedTasksCount: finishedTasks.length,
      currentWeekFinishedTasksCount: currentWeekFinishedTasks.length,
      currentWeekUnfinishedTasksCount: currentWeekUnfinishedTasks.length
    };
  }