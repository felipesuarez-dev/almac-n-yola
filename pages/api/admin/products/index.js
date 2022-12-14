import { getSession } from 'next-auth/react';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res
      .status(401)
      .send('Es necesario que un administrado inicie sesión');
  }
  // const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Método no permitido' });
  }
};
const postHandler = async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'Nombre de ejemplo',
    slug: 'nombre-ejemplo-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'categoría de ejemplo',
    brand: 'marca de ejemplo',
    countInStock: 0,
    description: 'descripción de ejemplo',
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Producto creado exitosamente', product });
};
const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};
export default handler;
