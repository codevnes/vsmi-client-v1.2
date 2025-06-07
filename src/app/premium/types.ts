export interface PremiumPlan {
  id: string;
  name: string;
  originalPrice: number | null;
  price: number;
  period: string;
  description: string;
  buttonText: string;
  tag: string | null;
  highlight: boolean;
  savings: string | null;
  pricePerMonth: number | null;
}

export interface PremiumBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface AIFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  content: string;
} 