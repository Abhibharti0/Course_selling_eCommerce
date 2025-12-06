import axios from "axios";
import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import toast from "react-hot-toast";

function Buy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  if (!token) navigate("/login");

  // Safe extraction of user email & id (works in all structures)
  const userEmail = user?.user?.email || user?.email;
  const userId = user?.user?._id || user?._id;

  // ⭐ STEP 1 — Fetch PaymentIntent + Course Info
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/courses/payment-intent/${courseId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCourse(res.data.course);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        if (err?.response?.status === 400) {
          toast.error("You already purchased this course!");
          navigate("/purchases");
          return;
        }
        setError("Payment initialization failed");
      }

      setLoading(false);
    };

    fetchPaymentIntent();
  }, [courseId]);


  // ⭐ STEP 2 — Handle Payment + Save Order
  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setCardError("");

    if (!clientSecret) {
      toast.error("Client secret missing");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card input missing");
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
      setLoading(false);
      return;
    }

    // Confirm Payment
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

    if (confirmError) {
      toast.error(confirmError.message);
      setLoading(false);
      return;
    }

    // ⭐ PAYMENT SUCCESS
    if (paymentIntent.status === "succeeded") {
      try {
        const orderInfo = {
          email: userEmail,
          userId: userId,
          courseId,
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount/100,
          status: paymentIntent.status,
        };

        // ⭐ SAVE ORDER
        await axios.post(`${BACKEND_URL}/api/order`, orderInfo, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Course Purchased Successfully! 🎉");
        navigate("/purchases");

      } catch (err) {
        toast.error("Order saving failed");
      }
    }

    setLoading(false);
  };


  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-200 p-4 rounded">{error}</div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          
          {/* LEFT: Course Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>

           <div className="flex items-center space-x-2 mt-4">
  <h2 className="text-gray-600 text-sm">Total Price:</h2>
  <p className="text-red-500 font-bold">₹{course?.price}</p>
</div>


            <div className="flex items-center space-x-2">
              <h2 className="text-gray-600 text-sm">Course:</h2>
              <p className="text-red-500 font-bold">{course?.title}</p>
            </div>
          </div>

          {/* RIGHT: Payment Form */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Process your Payment!</h2>

              <form onSubmit={handlePurchase}>
                <CardElement />

                <button
                  type="submit"
                  disabled={!stripe || loading}
                  className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md"
                >
                  {loading ? "Processing..." : "Pay"}
                </button>
              </form>

              {cardError && (
                <p className="text-red-500 text-xs">{cardError}</p>
              )}
            </div>
          </div>

        </div>
      )}
    </>
  );
}

export default Buy;
