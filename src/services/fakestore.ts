import axios from "axios";

export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

const api = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 12000,
});

export async function fetchTopProducts(limit = 5): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`/products?limit=${limit}`);
  return data;
}
