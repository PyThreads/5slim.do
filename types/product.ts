import { IArticlePublic, ICart } from "@/api/src/interfaces";


export interface CartContextType {
  cart: ICart[];
  addToCart: (product: IArticlePublic) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export interface FilterState {
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  searchTerm: string;
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
}