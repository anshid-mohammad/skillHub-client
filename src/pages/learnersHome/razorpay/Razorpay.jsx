// import axios from 'axios'
// import React, { useState } from 'react'

// function Razorpay() {
// const [responseId,setResponseId]=useState("")
//     const[responseState,setResponseState]=useState([])

//     const loadScript= (src)=>{
// return new Promise((resolve)=>{
//     const script=document.createElement("script")
//     script.src=src;
//     script.onload()=()=>{
//         resolve(true)
//     }
//     script.onerror()=()=>{
//         resolve(false)
//     }
//     document.body.appendChild(script)
// })
//     }

//     const createRazorpayOrder=(amount)=>{
//         let data=JSON.stringify({
//             amount:amount * 100,
//             currency:"INR"
//         })
//         let config={
//             method:"post",
//             maxBodyLength:Infinity,
//             url:"http://localhost:5000/api/auth/orders",
//             headers:{
//                 "content-type":'application/json'
//             },
//             data:data
//         }
//         axios.request(config)
//         .then((response)=>{
//             console.log(JSON.stringify(response.data))
//             handleRazorpayScreen(response.data.amount)
//         })
//         .catch((error)=>{
// console.log("error at",error)
//         })
//     }
// const handleRazorpayScreen=async(amount)=>{
//     const res=await loadScript("https:/checkout.razorpay.com/v1/checkout.js")

//     if(!res){
//         alert("some error at razorpay screen loading")
//         return;
//     }
//     const options={
//         key:"rzp_test_dvZ4a5WOhieg51",
//         amount:amount,
//         currency:'INR',
//         name:"pappaya corders",
//         image:"../../../image.demo.pmg",
//         handler:function (response){
//             setResponseId(response.razorpay_payment_id)
//         },
//         prefill:{
//             name:"pappaya coders",
//             email:"pappayacoders@gmai;.com"

//         },
//         theme:{
//             color:" #0056b3"
//         }

//     }
//     const paymentObject=new window.Razorpay(options)
//     paymentObject.open()
// }
// const paymentFetch=(e)=>{
//     e.preventDefault();

//     const paymentId=e.target.paymentId.value;

//     axios.get(`/api/auth/payments/${paymentId}`)
//     .then((response)=>{
//         console.log(response.data)
//         setResponseState(response.data)
//     })
//     .catch((error)=>{
//         console.log("error at",error)

//     })
// }
//   return (
//     <div className='app' >
//       <button onClick={()=>createRazorpayOrder(100)}>payment of 100 RS</button>
//       {responseId&&<p>{responseId}</p>}
//       <h1>payment verification form</h1>
//       <form action="" onSubmit={paymentFetch}>
// <input type='text' name='paymentId' />
// <button type='submit'>Fetch Payments</button>
//       </form>
//     </div>
//   )
// }

// export default Razorpay



import axios from "axios";
import React, { useState } from "react";

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
      const { data } = await axios.post("http://localhost:5000/api/auth/orders", {
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
        name: "Pappaya Coders",
        email: "pappayacoders@gmail.com",
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
      const { data } = await axios.get(`/api/auth/payments/${paymentId}`);
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
