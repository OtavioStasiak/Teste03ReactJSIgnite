import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

export interface ProductFormatted extends Product {
  amount: string;
}


const Home = (): JSX.Element => {
   const [products, setProducts] = useState<Product[]>([]);
   const { addProduct, cart } = useCart();

    async function loadProducts() {
      const response =  await api.get('products');
      setProducts(response.data);
    };

    useEffect(() => { loadProducts();}, []);


    function handleAddProduct(productId: number) {
      addProduct(productId);
    };

    return (

      <ProductList>
        {products.map((item,index) => 
        <li key={item.id}>
          <img src={item.image} alt={item.title} />
          <strong>{item.title}</strong>
          <span>{new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.price)}</span>
          <button
            type="button"
            data-testid="add-product-button"
          onClick={() => handleAddProduct(item.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
            {cart.find(shoe => shoe.id === item.id)?.amount || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>)}
      </ProductList>
    );
};

export default Home;
