export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  FINANCE = 'FINANCE',
  INVENTORY = 'INVENTORY',
  STAFFING = 'STAFFING',
  CLINICAL = 'CLINICAL',
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: 'pending' | 'cleared' | 'flagged';
  accountID: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  unit: string;
  monthlyUsage: number[]; // Last 6 months
  forecastedDemand?: number;
  aiRecommendation?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Admin';
  department: string;
  shiftPreference: 'Morning' | 'Afternoon' | 'Night';
  hoursWorked: number;
}

export interface AIResponse {
  analysis: string;
  recommendations: string[];
  riskAssessment?: string;
  dataPoints?: any;
}