import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ClientResponse,
  Product,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';
import {
  getME,
  getProducts,
} from '../commercetools-environment/apiRequests.ts';
import TestForm from '../components/TestForm/TestForm.tsx';

const INITIAL_DATA_PRODUCTS: {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: Product[];
} = {
  limit: 0,
  offset: 0,
  count: 0,
  results: [],
};

export default function MainPage() {
  const [dataProducts, setDataProducts] = useState(INITIAL_DATA_PRODUCTS);
  useEffect(() => {
    getProducts()
      .then((data: ClientResponse<ProductPagedQueryResponse>) => {
        setDataProducts({ ...data.body });
        console.log(
          'Firs-data-------------------',
          data,
          'getProducts-------------------',
        );
      })
      .catch(console.error);
  }, []);

  const getProductList = (productData: ProductPagedQueryResponse) => {
    const productQuantity: string = String(productData.count);
    const productsList = productData.results.map((product: Product) => {
      const productInfo = product.masterData.current;
      const productImage =
        productInfo.masterVariant.images && productInfo.masterVariant.images[0];
      const productPrice =
        productInfo.masterVariant.prices && productInfo.masterVariant.prices[0];
      return (
        <li className="product-card" key={product.id}>
          <h4>{productInfo.name['en - US']}</h4>
          {productImage && <img src={productImage.url} alt="card-image"></img>}
          <p>Product description: </p>
          <p>{productInfo.description && productInfo.description['en-US']}</p>
          {productPrice && (
            <p>
              {'Price: '}
              {(
                productPrice.value.centAmount /
                10 ** productPrice.value.fractionDigits
              ).toFixed(productPrice.value.fractionDigits)}{' '}
              {productPrice.value.currencyCode}
            </p>
          )}
        </li>
      );
    });

    return (
      <div key="products-list-key" className="products">
        <h3>Product List</h3>
        <p>product quantity: {productQuantity}</p>
        <ul className="products-list">{productsList.length && productsList}</ul>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <button
          onClick={() => {
            getME()
              .then((data) => {
                console.log('getMe', data);
              })
              .catch((error) => console.log('getMeError', error));
          }}
        >
          get me
        </button>
        <TestForm />
      </div>
      {getProductList(dataProducts)}

      <h1>Main Page</h1>

      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
