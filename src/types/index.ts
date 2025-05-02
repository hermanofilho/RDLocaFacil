
// User types
export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
}

// Client types
export interface Client {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  address: string;
  birthDate: string;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseValidity?: string;
  observations?: string;
  licenseImageFront?: string;
  licenseImageBack?: string;
  photo?: string;
  proofOfAddress?: string;
  signedTerms?: string;
  createdAt: string;
  updatedAt: string;
}

// Motorcycle types
export type MotorcycleStatus = 'available' | 'rented' | 'maintenance';

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  year: string;
  mileage: number;
  status: MotorcycleStatus;
  weeklyRate: number;
  observations?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

// Rental types
export type PaymentMethod = 'pix' | 'card' | 'cash';
export type RentalStatus = 'active' | 'completed' | 'overdue';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface Payment {
  id: string;
  rentalId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  notes?: string;
  status: PaymentStatus;
  weekNumber: number;
}

export interface Rental {
  id: string;
  clientId: string;
  motorcycleId: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  weeklyRate: number;
  deposit: number;
  initialPayment: number;
  status: RentalStatus;
  observations?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedBy: string;
  payments: Payment[];
}

// Dashboard types
export interface DashboardStats {
  availableMotorcycles: number;
  rentedMotorcycles: number;
  maintenanceMotorcycles: number;
  totalRentals: number;
  activeRentals: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
}
