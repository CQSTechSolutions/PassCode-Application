import {
  getClientsFromDB,
  addClientToDB,
  updateClientInDB,
  deleteClientFromDB
} from './databaseService';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  joinedDate: string;
}

// Mock data for clients
const mockClients: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@abccorp.com',
    phone: '+1-555-123-4567',
    company: 'ABC Corporation',
    address: '123 Business Ave, New York, NY 10001',
    joinedDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@xyzindustries.com',
    phone: '+1-555-987-6543',
    company: 'XYZ Industries',
    address: '456 Corporate Blvd, Chicago, IL 60601',
    joinedDate: '2023-03-22'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@localbusiness.com',
    phone: '+1-555-456-7890',
    company: 'Local Business',
    address: '789 Main St, Boston, MA 02108',
    joinedDate: '2023-05-10'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@techstart.io',
    phone: '+1-555-789-0123',
    company: 'Tech Start',
    address: '321 Innovation Way, San Francisco, CA 94107',
    joinedDate: '2023-07-08'
  }
];

export const getClients = (): Promise<Client[]> => {
  return getClientsFromDB();
};

export const addClient = (client: Omit<Client, 'id'>): Promise<number> => {
  return addClientToDB(client);
};

export const updateClient = (id: number, client: Omit<Client, 'id'>): Promise<void> => {
  return updateClientInDB(id, client);
};

export const deleteClient = (id: number): Promise<void> => {
  return deleteClientFromDB(id);
}; 