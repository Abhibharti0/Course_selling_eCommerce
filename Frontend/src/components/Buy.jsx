import axios from "axios";
import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import toast from "react-hot-toast";

function Buy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  if (!token) navigate("/login");

  // ⭐ STEP 1 — Load Payment Intent
  useEffect(() => {
    const loadIntent = async () => {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/courses/payment-intent/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCourse(res.data.course);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
        setError("Could not start payment");
      }
    };

    loadIntent();
  }, [courseId]);

  // ⭐ STEP 2 — Final Payment Handler
  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setCardError("");

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card field missing");
      setLoading(false);
      return;
    }

    // Create Payment Method
    const { error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (pmError) {
      toast.error(pmError.message);
      setCardError(pmError.message);
      setLoading(false);
      return;
    }

    // Confirm Payment with Stripe
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

    if (confirmError) {
      toast.error(confirmError.message);
      setCardError(confirmError.message);
      setLoading(false);
      return;
    }

    // ⭐ PAYMENT SUCCESS
    if (paymentIntent.status === "succeeded") {
      try {
        // ⭐ MUST — Save Purchase in DB
        await axios.post(
          `${BACKEND_URL}/api/courses/buy/${courseId}`,
          {
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Course Purchased Successfully! 🎉");
        navigate("/purchases");

      } catch (err) {
        toast.error(err.response?.data?.errors || "Already purchased!");
      }
    }

    setLoading(false);
  };

  return (
    <>
       {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;
