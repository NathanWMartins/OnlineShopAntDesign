export type Product = {
    id: number;
    title: string;
    price: number;
    description?: string;
    category?: string;
    image: string;
    rating?: {
      rate: number;
      count?: number;
    };
  };
  
  export type User = {
    firstName: string;
    lastName: string;
    email: string;
  };