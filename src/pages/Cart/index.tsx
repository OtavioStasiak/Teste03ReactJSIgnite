import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import { toast } from 'react-toastify';

 import { useCart } from '../../hooks/useCart';
 import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}


const Cart = (): JSX.Element => {
   const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => ({
      title: product.title,
      subTotal: formatPrice(product.amount * product.price),
      id: product.id,
      image: product.image,
      priceFormatted: formatPrice(product.price),
      price: product.price,
      amount: product.amount
  }))
 const total = formatPrice(cart.reduce((sumAmount, product) => {
    return sumAmount + (product.amount * product.price);
 },0));


  function handleProductIncrement(product: Product) {
    const amount = product.amount + 1;
    updateProductAmount({productId: product.id, amount: amount});
  };

  function handleProductDecrement(product: Product) {
    if(product.amount <= 1){
      toast.error('Erro na alteração de quantidade do produto');
      return;
    }
   
    const amount = product.amount - 1;
    updateProductAmount({productId: product.id, amount: amount});
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
              { cartFormatted.map((item, index) =>
                <tr data-testid="product" key={index}>
                <td>
                  <img src={item.image} />
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <span>{item.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                     disabled={item.amount <= 1}
                     onClick={() => handleProductDecrement(item)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={item.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(item)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{item.subTotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(item.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>)
              }
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>{total}</span>
          <strong></strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
