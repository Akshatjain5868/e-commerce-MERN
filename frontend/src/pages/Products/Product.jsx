import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { BASE_URL } from "../../redux/constants";

const Product = ({ product }) => {
  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative">
      <div className="relative">
        <div className="flex justify-center items-center">
          <img
            src={`${BASE_URL}/${product.image}`}
            alt={product.name}
            className="h-[25rem] rounded"
          />
        </div>
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg w-[20rem]">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              {product.price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
