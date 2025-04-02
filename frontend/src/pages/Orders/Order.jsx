import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePaymentGatewayMutation,
  useValidateOrderMutation,
} from "../../redux/api/orderApiSlice";
import { BASE_URL } from "../../redux/constants";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [validateOrder, { isLoading: loadingPay }] = useValidateOrderMutation();
  const [razorpayOrder, { isLoading: loadingRazorpay }] =
    usePaymentGatewayMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (e) => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online");
        return;
      }

      const { data: result } = await razorpayOrder(orderId);
      console.log(result);

      if (!result) {
        alert("Server Error!");
        return;
      }

      const { amount, id: order_id, currency } = result;

      const options = {
        key: "rzp_test_der4pLSiUdkt1G",
        amount,
        currency,
        order_id,
        name: "E-Commerce Store",
        handler: async (res) => {
          const data = { ...res };

          console.log(data);
          const result = await validateOrder({ orderId, data }).unwrap();

          location.reload();
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", () => {
        alert("Payment failed");
      });
      paymentObject.open();
      e.preventDefault();
    } catch (error) {
      console.log(error);
    }
  };

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data?.message}</Messsage>
  ) : (
    <div className="container w-[90vw] flex mx-[5rem] justify-between">
      <div className="md:w-[55vw] pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={`${BASE_URL}/${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">
                        {item.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td>
                      <td className="p-2 text-center">
                        {(item.qty * item.price).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-[35vw]">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>
            {order.itemsPrice.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>
            {order.shippingPrice.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>
            {order.taxPrice.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>
            {order.totalPrice.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        </div>

        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}{" "}
            {loadingRazorpay ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <button
                    onClick={displayRazorpay}
                    className="p-2 w-full text-center text-[2rem] text-indigo-700 bg-yellow-600 rounded rounded-lg"
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
