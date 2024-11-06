import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { GiTripleScratches } from "react-icons/gi";

interface Product {
  title: string;
  price: string | null;
  rating: string | null;
  image: string;
  link: string;
}

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleScrape = async () => {
    try {
      await axios.post('http://localhost:5000/api/scrape', {url});
      fetchProducts();
    } 
    catch (err) {
      setError('Error initiating scrape');
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('http://localhost:5000/api/products');
      setProducts(response.data);
      setError('');
    } 
    catch (err) {
      setError('Error fetching products');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-5 items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold mb-6">GeoScraper!</h1>
      <div className="mb-4">
        <div className="flex gap-1 items-center">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter Amazon category URL"
            className="p-2 border border-gray-300 rounded-md w-80"
          />
          <button
            onClick={handleScrape}
            className="ml-2 p-1.5 text-3xl bg-black hover:bg-[#000000c5] text-white rounded-md"
          >
            <GiTripleScratches/>
          </button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6  gap-5">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-5 relative h-64 w- overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"/>
            </div>
            <div className="p-3 bg-white h-48 flex flex-col justify-between">
              <h1 className="text-[19px] font-semibold text-gray-700 line-clamp-3">
                {product.title}
              </h1>
              <p className="text-gray-700 text-[16px]">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500 pr-1.5"/>
                {product.rating ? `Rating: ${product.rating}` : 'Rating not available'}
              </p>
              <p className="font-bold text-[22px] text-gray-900">
                {product.price ? `Price: ${product.price}` : 'Price not available'}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default App;
