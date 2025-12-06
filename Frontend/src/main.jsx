import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51SaapsB2Xb6LSmp37OOaXE9AuqSk1QOvZvXC7i9pAmVeBptkkQ7F6LkoFPVR9H61fzH00t13I7ubFk1fP3285i1Q000LvasjIm"
);
import axios from "axios";   
axios.defaults.withCredentials = true; 

createRoot(document.getElementById('root')).render(
<Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
   
  
)
