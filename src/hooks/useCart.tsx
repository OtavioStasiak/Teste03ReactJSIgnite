import { createContext, ReactNode, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
  stockValue?: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');    
     if (storagedCart) {
       return JSON.parse(storagedCart);
    };
    return [];
  });


  async function addProduct(productId: number) {
    try {
      const updatedCart = [...cart];
      const productExists = updatedCart.find(item => item.id === productId);

      const verifyInStock = await api.get(`/stock/${productId}`);

      const amountInCart = productExists ? productExists.amount : 0;
      const newAmount = amountInCart + 1;

      if(newAmount > verifyInStock.data.amount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      };

      if(productExists){
        productExists.amount = newAmount;
      } else {
        const productData = await api.get(`/products/${productId}`)
        const newProduct = {...productData.data, amount: 1};
        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));

    } catch {
      toast.error('Erro na adição do produto');
    }
  };


  const removeProduct = (productId: number) => {
    const updatedCart = [...cart];
    const indexToRemove = updatedCart.findIndex(item => item.id === productId);

    try {
      if(indexToRemove >= 0){
        updatedCart.splice(indexToRemove, 1);
        setCart(updatedCart);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      }else{
        throw Error();  
      }; 
    } catch {
      toast.error('Erro na remoção do produto');
    };
  };



  const updateProductAmount = async ({
    productId,
    amount
  }: UpdateProductAmount) => {

    try {
      if(amount <=0){
        return;
      }
      const verifyInStock = await api.get(`/stock/${productId}`);

      if(amount > verifyInStock.data.amount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      };

      const updatedCart = [...cart];
      const productExists = updatedCart.find(item => item.id === productId);

      if(productExists){
        productExists.amount = amount;
        setCart(updatedCart);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      }else{
        throw Error();
      }

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
