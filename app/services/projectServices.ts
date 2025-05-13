import {
  getProjectsFromDB,
  addProjectToDB,
  updateProjectInDB,
  deleteProjectFromDB
} from './databaseService';

export interface Project {
  id: number;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  budget: number;
  description: string;
}

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    client: 'ABC Corporation',
    startDate: '2023-09-01',
    endDate: '2023-12-31',
    status: 'in-progress',
    budget: 75000,
    description: 'Complete redesign of corporate website'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    client: 'XYZ Industries',
    startDate: '2023-10-15',
    endDate: '2024-03-31',
    status: 'planning',
    budget: 120000,
    description: 'Development of iOS and Android mobile applications'
  },
  {
    id: 3,
    name: 'SEO Optimization',
    client: 'Local Business',
    startDate: '2023-08-15',
    endDate: '2023-11-15',
    status: 'completed',
    budget: 25000,
    description: 'Search engine optimization campaign'
  }
];

export const getProjects = (): Promise<Project[]> => {
  return getProjectsFromDB();
};

export const addProject = (project: Omit<Project, 'id'>): Promise<number> => {
  return addProjectToDB(project);
};

export const updateProject = (id: number, project: Omit<Project, 'id'>): Promise<void> => {
  return updateProjectInDB(id, project);
};

export const deleteProject = (id: number): Promise<void> => {
  return deleteProjectFromDB(id);
}; 