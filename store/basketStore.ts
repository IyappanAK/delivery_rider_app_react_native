import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  price: number;
  info: string;
  img: any;
}

export interface BasketState {
  products: Array<Product & { quantity: number }>;
  clearCart:() => void;
  clearToken: () => void;
  setProducts:(data:any)=>void,
  setToken: (token:any) => void;
  setTotal: (total:any) => void;
  addProduct: (product: Product) => void;
  reduceProduct: (product: Product) => void;
  setCurrentLocation: (location:any) => void;
  items: number;
  total: number;
  token:any;
  currentLocation:any
}


const useBasketStore = create<BasketState>()((set) => ({
  products: [],
  items: 0,
  total: 0,
  token:null,
  currentLocation:null,
  addProduct: (product) => { 
    set((state) => {
      state.items += 1;
      state.total += product.price;
      const hasProduct = state.products.find((p) => p.id === product.id);

      if (hasProduct) {
        hasProduct.quantity += 1;
        return { products: [...state.products] };
      } else {
        return { products: [...state.products, { ...product, quantity: 1 }] };
      }
    });
  },
  reduceProduct: (product) => {
    set((state) => {
      state.total -= product.price;
      state.items -= 1;
      return {
        products: state.products
          .map((p) => {
            if (p.id === product.id) {
              p.quantity -= 1;
            }
            return p;
          })
          .filter((p) => p.quantity > 0),
      };
    });
  },
  clearCart: () => set({ products: [], items: 0, total: 0 }),
  setProducts:(data)=>set({ products: data }),
  setToken:(token:any)=> {
    set({token})
  },
  setTotal:(total:any)=> {
    set({total})
  },
   clearToken:()=> {
    set({token:null})
  },
  setCurrentLocation:(location)=>{
    set({currentLocation:location})
  }
}));

export default useBasketStore;
