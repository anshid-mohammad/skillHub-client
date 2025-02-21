

import axios from "axios";
import React, { useState } from "react";
import API_BASE_URL from "../../../config/config";

function Razorpay() {
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/orders`, {
        amount: amount * 100,
        currency: "INR",
      });

      console.log("Order Created:", data);
      handleRazorpayScreen(data.amount);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_dvZ4a5WOhieg51",
      amount,
      currency: "INR",
      name: "Pappaya Coders",
      image: "https://yourdomain.com/logo.png",
      handler: (response) => setResponseId(response.razorpay_payment_id),
      prefill: {
        name: "anshid",
        email: "anshid@gmail.com",
      },
      theme: { color: "#0056b3" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const paymentFetch = async (e) => {
    e.preventDefault();
    const paymentId = e.target.paymentId.value;

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/payments/${paymentId}`);
      console.log("Payment Data:", data);
      setResponseState(data);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  return (
    <div className="app">
      <button onClick={() => createRazorpayOrder(100)}>Pay ₹100</button>
      {responseId && <p>Payment ID: {responseId}</p>}

      <h1>Payment Verification</h1>
      <form onSubmit={paymentFetch}>
        <input type="text" name="paymentId" placeholder="Enter Payment ID" required />
        <button type="submit">Fetch Payments</button>
        {responseState.length !==0 &&(
            <ul>
                <li>amount:{responseState.amount/100}Rs.</li>
                <li>currency{responseState.currency}</li>
                <li>status:{responseState.status}</li>
                <li>method:{responseState.method}</li>
            </ul>
        )}
      </form>
    </div>
  );
}

export default Razorpay;
