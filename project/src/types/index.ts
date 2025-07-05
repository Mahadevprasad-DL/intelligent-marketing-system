export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  industry: string;
  country: string;
  state: string;
  city: string;
  userType: string;
  leadSource: string;
  campaign: string;
  marketingCampaignId: string;
  estimatedBudget: string;
  expectedTimeToBuy: string;
}

export interface Campaign {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}