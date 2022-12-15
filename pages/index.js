import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Lo sentimos. No queda stock del producto');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Producto añadido al carrito');
  };

  return (
    <Layout title="Inicio">
      <div className="z-0">
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          <div>
            <img src="/images/banner1.jpg" />
            <p className="legend">
              La Señora Yola inicia actividades en internet
            </p>
          </div>
          <div>
            <img src="/images/banner2.jpg" />
            <p className="legend">La mejor variedad en productos y ofertas</p>
          </div>
          <div>
            <img src="/images/banner3.jpg" />
            <p className="legend">Don Yolo también lo atiende a usted tambié</p>
          </div>
        </Carousel>
      </div>
      <h2 className="h2 my-4 text-2xl">Últimos productos</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
