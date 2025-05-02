
import { Client, Motorcycle, Rental, Payment, User, UserRole, DashboardStats } from '@/types';

// Demo clients
const mockClients: Client[] = [
  {
    id: '1',
    fullName: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    birthDate: '1985-05-15',
    licenseNumber: '12345678901',
    licenseCategory: 'A',
    licenseValidity: '2025-05-15',
    observations: 'Cliente regular, sem ocorrências.',
    createdAt: '2023-01-10T10:30:00',
    updatedAt: '2023-01-10T10:30:00',
  },
  {
    id: '2',
    fullName: 'Maria Oliveira',
    cpf: '987.654.321-00',
    phone: '(11) 91234-5678',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    birthDate: '1992-08-20',
    licenseNumber: '98765432109',
    licenseCategory: 'A',
    licenseValidity: '2024-08-20',
    observations: 'Indicada por João Silva.',
    createdAt: '2023-02-15T14:20:00',
    updatedAt: '2023-02-15T14:20:00',
  },
  {
    id: '3',
    fullName: 'Pedro Santos',
    cpf: '456.789.123-00',
    phone: '(11) 97890-1234',
    address: 'Rua Augusta, 500 - São Paulo, SP',
    birthDate: '1988-11-10',
    licenseNumber: '45678912300',
    licenseCategory: 'AB',
    licenseValidity: '2024-11-10',
    observations: 'Cliente exigente com manutenção.',
    createdAt: '2023-03-05T09:15:00',
    updatedAt: '2023-03-05T09:15:00',
  },
];

// Demo motorcycles
const mockMotorcycles: Motorcycle[] = [
  {
    id: '1',
    brand: 'Honda',
    model: 'CG 160',
    licensePlate: 'ABC1D23',
    year: '2022',
    mileage: 5200,
    status: 'available',
    weeklyRate: 250,
    observations: 'Revisão feita em 01/2023',
    photo: 'https://www.honda.com.br/motos/sites/hda/files/styles/product_list_image/public/2022-05/cg160_start_vermelho_0.png',
    createdAt: '2022-11-05T08:00:00',
    updatedAt: '2023-01-10T14:30:00',
  },
  {
    id: '2',
    brand: 'Yamaha',
    model: 'Fazer 250',
    licensePlate: 'DEF4G56',
    year: '2021',
    mileage: 8700,
    status: 'rented',
    weeklyRate: 320,
    observations: 'Troca de óleo necessária no retorno',
    photo: 'https://dd5nxstdmymoz.cloudfront.net/cdn-cgi/image/quality=80,format=auto/https://www.yamaha-motor.com.br/ccstore/v1/images/?source=/file/v4495343904393873204/products/18962.fz25-bluish-gray-metallic-2022.png',
    createdAt: '2022-10-12T10:15:00',
    updatedAt: '2023-02-20T16:45:00',
  },
  {
    id: '3',
    brand: 'Honda',
    model: 'XRE 300',
    licensePlate: 'GHI7J89',
    year: '2023',
    mileage: 2100,
    status: 'maintenance',
    weeklyRate: 380,
    observations: 'Em manutenção preventiva',
    photo: 'https://www.honda.com.br/motos/sites/hda/files/styles/product_list_image/public/2022-11/XRE190_AZUL%20%281%29.png',
    createdAt: '2023-03-01T11:30:00',
    updatedAt: '2023-03-15T13:20:00',
  },
  {
    id: '4',
    brand: 'Kawasaki',
    model: 'Z400',
    licensePlate: 'JKL0M12',
    year: '2022',
    mileage: 4500,
    status: 'available',
    weeklyRate: 450,
    observations: 'Nova no estoque',
    photo: 'https://storage.kawasaki.eu/public/kawasaki.eu/en-EU/model/23MY_Z400_GY1_STU__2_.png',
    createdAt: '2022-12-10T09:45:00',
    updatedAt: '2023-02-05T10:15:00',
  },
];

// Demo rentals with payments
const mockRentals: Rental[] = [
  {
    id: '1',
    clientId: '1',
    motorcycleId: '2',
    startDate: '2023-05-01T10:00:00',
    expectedEndDate: '2023-06-01T10:00:00',
    weeklyRate: 320,
    deposit: 500,
    initialPayment: 820,
    status: 'active',
    observations: 'Cliente preferencial',
    paymentMethod: 'pix',
    createdAt: '2023-05-01T10:00:00',
    updatedBy: '1',
    payments: [
      {
        id: '1',
        rentalId: '1',
        amount: 820,
        method: 'pix',
        date: '2023-05-01T10:00:00',
        status: 'paid',
        weekNumber: 1,
      },
      {
        id: '2',
        rentalId: '1',
        amount: 320,
        method: 'pix',
        date: '2023-05-08T10:00:00',
        status: 'paid',
        weekNumber: 2,
      },
      {
        id: '3',
        rentalId: '1',
        amount: 320,
        method: 'pix',
        date: '2023-05-15T10:00:00',
        status: 'pending',
        weekNumber: 3,
      },
    ],
  },
  {
    id: '2',
    clientId: '2',
    motorcycleId: '1',
    startDate: '2023-04-15T14:00:00',
    expectedEndDate: '2023-05-15T14:00:00',
    actualEndDate: '2023-05-10T16:30:00',
    weeklyRate: 250,
    deposit: 500,
    initialPayment: 750,
    status: 'completed',
    observations: 'Devolvida antes do prazo',
    paymentMethod: 'card',
    createdAt: '2023-04-15T14:00:00',
    updatedBy: '2',
    payments: [
      {
        id: '4',
        rentalId: '2',
        amount: 750,
        method: 'card',
        date: '2023-04-15T14:00:00',
        status: 'paid',
        weekNumber: 1,
      },
      {
        id: '5',
        rentalId: '2',
        amount: 250,
        method: 'card',
        date: '2023-04-22T14:00:00',
        status: 'paid',
        weekNumber: 2,
      },
      {
        id: '6',
        rentalId: '2',
        amount: 250,
        method: 'card',
        date: '2023-04-29T14:00:00',
        status: 'paid',
        weekNumber: 3,
      },
      {
        id: '7',
        rentalId: '2',
        amount: 250,
        method: 'card',
        date: '2023-05-06T14:00:00',
        status: 'paid',
        weekNumber: 4,
      },
    ],
  },
];

// Demo users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrator',
    email: 'admin@motolocadora.com',
    username: 'admin',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Employee',
    email: 'employee@motolocadora.com',
    username: 'employee',
    role: 'employee',
  },
];

// Mock dashboard stats
const mockDashboardStats: DashboardStats = {
  availableMotorcycles: 2,
  rentedMotorcycles: 1,
  maintenanceMotorcycles: 1,
  totalRentals: 2,
  activeRentals: 1,
  weeklyRevenue: 1070,
  monthlyRevenue: 3390,
  pendingPayments: 1,
};

// Storage functions for local data management
const getLocalData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveLocalData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock Service Implementation
export const ClientService = {
  getClients: (): Client[] => {
    return getLocalData<Client[]>('clients', mockClients);
  },
  
  getClientById: (id: string): Client | undefined => {
    const clients = getLocalData<Client[]>('clients', mockClients);
    return clients.find(client => client.id === id);
  },
  
  createClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
    const clients = getLocalData<Client[]>('clients', mockClients);
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    clients.push(newClient);
    saveLocalData('clients', clients);
    return newClient;
  },
  
  updateClient: (client: Client): Client => {
    const clients = getLocalData<Client[]>('clients', mockClients);
    const index = clients.findIndex(c => c.id === client.id);
    
    if (index !== -1) {
      clients[index] = {
        ...client,
        updatedAt: new Date().toISOString(),
      };
      saveLocalData('clients', clients);
      return clients[index];
    }
    
    throw new Error('Client not found');
  },
  
  deleteClient: (id: string): void => {
    const clients = getLocalData<Client[]>('clients', mockClients);
    const newClients = clients.filter(client => client.id !== id);
    saveLocalData('clients', newClients);
  },
};

export const MotorcycleService = {
  getMotorcycles: (): Motorcycle[] => {
    return getLocalData<Motorcycle[]>('motorcycles', mockMotorcycles);
  },
  
  getMotorcycleById: (id: string): Motorcycle | undefined => {
    const motorcycles = getLocalData<Motorcycle[]>('motorcycles', mockMotorcycles);
    return motorcycles.find(motorcycle => motorcycle.id === id);
  },
  
  createMotorcycle: (motorcycle: Omit<Motorcycle, 'id' | 'createdAt' | 'updatedAt'>): Motorcycle => {
    const motorcycles = getLocalData<Motorcycle[]>('motorcycles', mockMotorcycles);
    const newMotorcycle: Motorcycle = {
      ...motorcycle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    motorcycles.push(newMotorcycle);
    saveLocalData('motorcycles', motorcycles);
    return newMotorcycle;
  },
  
  updateMotorcycle: (motorcycle: Motorcycle): Motorcycle => {
    const motorcycles = getLocalData<Motorcycle[]>('motorcycles', mockMotorcycles);
    const index = motorcycles.findIndex(m => m.id === motorcycle.id);
    
    if (index !== -1) {
      motorcycles[index] = {
        ...motorcycle,
        updatedAt: new Date().toISOString(),
      };
      saveLocalData('motorcycles', motorcycles);
      return motorcycles[index];
    }
    
    throw new Error('Motorcycle not found');
  },
  
  deleteMotorcycle: (id: string): void => {
    const motorcycles = getLocalData<Motorcycle[]>('motorcycles', mockMotorcycles);
    const newMotorcycles = motorcycles.filter(motorcycle => motorcycle.id !== id);
    saveLocalData('motorcycles', newMotorcycles);
  },
  
  getAvailableMotorcycles: (): Motorcycle[] => {
    const motorcycles = getLocalData<Motorcycle[]>('motorcycles', mockMotorcycles);
    return motorcycles.filter(motorcycle => motorcycle.status === 'available');
  },
  
  updateMotorcycleStatus: (id: string, status: 'available' | 'rented' | 'maintenance'): Motorcycle => {
    const motorcycles = getLocalData<Motorcycle[]>('motorcycles', mockMotorcycles);
    const index = motorcycles.findIndex(m => m.id === id);
    
    if (index !== -1) {
      motorcycles[index] = {
        ...motorcycles[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      saveLocalData('motorcycles', motorcycles);
      return motorcycles[index];
    }
    
    throw new Error('Motorcycle not found');
  },
};

export const RentalService = {
  getRentals: (): Rental[] => {
    return getLocalData<Rental[]>('rentals', mockRentals);
  },
  
  getRentalById: (id: string): Rental | undefined => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    return rentals.find(rental => rental.id === id);
  },
  
  getClientRentals: (clientId: string): Rental[] => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    return rentals.filter(rental => rental.clientId === clientId);
  },
  
  getMotorcycleRentals: (motorcycleId: string): Rental[] => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    return rentals.filter(rental => rental.motorcycleId === motorcycleId);
  },
  
  createRental: (rental: Omit<Rental, 'id' | 'createdAt' | 'payments'>): Rental => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    const newRental: Rental = {
      ...rental,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      payments: [
        {
          id: `payment-${Date.now()}`,
          rentalId: `${Date.now()}`,
          amount: rental.initialPayment,
          method: rental.paymentMethod,
          date: new Date().toISOString(),
          status: 'paid',
          weekNumber: 1,
        }
      ],
    };
    
    rentals.push(newRental);
    saveLocalData('rentals', rentals);
    
    // Update motorcycle status
    MotorcycleService.updateMotorcycleStatus(rental.motorcycleId, 'rented');
    
    return newRental;
  },
  
  updateRental: (rental: Rental): Rental => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    const index = rentals.findIndex(r => r.id === rental.id);
    
    if (index !== -1) {
      rentals[index] = rental;
      saveLocalData('rentals', rentals);
      return rentals[index];
    }
    
    throw new Error('Rental not found');
  },
  
  completeRental: (id: string): Rental => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    const index = rentals.findIndex(r => r.id === id);
    
    if (index !== -1) {
      rentals[index] = {
        ...rentals[index],
        status: 'completed',
        actualEndDate: new Date().toISOString(),
      };
      saveLocalData('rentals', rentals);
      
      // Update motorcycle status
      MotorcycleService.updateMotorcycleStatus(rentals[index].motorcycleId, 'available');
      
      return rentals[index];
    }
    
    throw new Error('Rental not found');
  },
  
  addPayment: (payment: Omit<Payment, 'id'>): Payment => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    const rentalIndex = rentals.findIndex(r => r.id === payment.rentalId);
    
    if (rentalIndex !== -1) {
      const newPayment: Payment = {
        ...payment,
        id: `payment-${Date.now()}`,
      };
      
      rentals[rentalIndex].payments.push(newPayment);
      saveLocalData('rentals', rentals);
      
      return newPayment;
    }
    
    throw new Error('Rental not found');
  },
  
  getActiveRentals: (): Rental[] => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    return rentals.filter(rental => rental.status === 'active');
  },
  
  getPendingPayments: (): Payment[] => {
    const rentals = getLocalData<Rental[]>('rentals', mockRentals);
    const pendingPayments: Payment[] = [];
    
    rentals.forEach(rental => {
      rental.payments
        .filter(payment => payment.status === 'pending')
        .forEach(payment => pendingPayments.push(payment));
    });
    
    return pendingPayments;
  },
};

export const UserService = {
  getUsers: (): User[] => {
    return getLocalData<User[]>('users', mockUsers);
  },
  
  getUserById: (id: string): User | undefined => {
    const users = getLocalData<User[]>('users', mockUsers);
    return users.find(user => user.id === id);
  },
  
  createUser: (user: Omit<User, 'id'>): User => {
    const users = getLocalData<User[]>('users', mockUsers);
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };
    
    users.push(newUser);
    saveLocalData('users', users);
    return newUser;
  },
  
  updateUser: (user: User): User => {
    const users = getLocalData<User[]>('users', mockUsers);
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = user;
      saveLocalData('users', users);
      return users[index];
    }
    
    throw new Error('User not found');
  },
  
  deleteUser: (id: string): void => {
    const users = getLocalData<User[]>('users', mockUsers);
    const newUsers = users.filter(user => user.id !== id);
    saveLocalData('users', newUsers);
  },
};

export const DashboardService = {
  getDashboardStats: (): DashboardStats => {
    // In a real app, this would calculate stats dynamically
    return mockDashboardStats;
  }
};

// Initialize local storage with mock data on first load
export const initializeMockData = (): void => {
  if (!localStorage.getItem('clients')) {
    saveLocalData('clients', mockClients);
  }
  
  if (!localStorage.getItem('motorcycles')) {
    saveLocalData('motorcycles', mockMotorcycles);
  }
  
  if (!localStorage.getItem('rentals')) {
    saveLocalData('rentals', mockRentals);
  }
  
  if (!localStorage.getItem('users')) {
    saveLocalData('users', mockUsers);
  }
};
