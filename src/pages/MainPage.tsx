import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ClientResponse,
  Product,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { getME, getProducts } from '../services';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { logoutUser, selectUser } from '../features/user/userSlice.ts';

const INITIAL_DATA_PRODUCTS: ProductPagedQueryResponse = {
  limit: 0,
  offset: 0,
  count: 0,
  results: [],
};

export default function MainPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/'))
      .catch((e) => console.error('Logout failed:', e));
  };

  const [dataProducts, setDataProducts] = useState(INITIAL_DATA_PRODUCTS);
  useEffect(() => {
    getProducts()
      .then((data: ClientResponse<ProductPagedQueryResponse>) => {
        setDataProducts({ ...data.body });
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
        {user.isAuthenticated && <button onClick={handleLogout}>Logout</button>}
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
      </div>
      {getProductList(dataProducts)}

      <h1>Main Page</h1>
      <p>
        Status:{' '}
        {user.isAuthenticated ? `Logged in as ${user.email}` : 'Not logged in'}
      </p>
    </div>
  );
}

//
// import { Box, Center, Text } from '@chakra-ui/react';
//
// const MainPage = () => {
//   return (
//     <Box
//       w="100%"
//       minH="70vh"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//     >
//       <Center>
//         <Text
//           fontSize="2xl"
//           fontWeight="bold"
//           color="primary"
//           _dark={{ color: 'brand.300' }}
//         >
//           Welcome to our flower shop website!
//         </Text>
//       </Center>
//     </Box>
//   );
// };
//
// export default MainPage;
