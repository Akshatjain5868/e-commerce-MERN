import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { BASE_URL } from "../../redux/constants";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[12rem] ml-[2rem] p-1">
      <div className="relative flex justify-center items-center">
        <img
          src={`${BASE_URL}/${product.image}`}
          alt={product.name}
          className="h-[12rem] w-auto rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-1">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-md">{product.name.substring(0, 30)} ...</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
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

export default SmallProduct;
