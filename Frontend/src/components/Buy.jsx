import axios from 'axios';
import React,{useState} from 'react'
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils';

const Buy = () => {
  const {courseId} = useParams();
  const navigate = useNavigate();
  const [loading,setLoading]= useState(false);
  const [error, setError] = useState("");

  const user= JSON.parse(localStorage.getItem("user"));
  const token= user?.token;

  const handlePurchase= async()=>{
    if(!token){
      toast.error("Kindly login to purchase the course");
      return;
    }

    try{  
      setLoading(true);

      const response = await axios.post(
        `${BACKEND_URL}/api/courses/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials:true
        }
      );

      toast.success(response.data.message || "course purchased successfully");
      navigate("/purchases");
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error?.response?.status === 400) {
        toast.error("you have already purchase")
        navigate("/purchases");
      } else {
        toast.error(error?.response?.data?.errors);
      }
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <button 
        className='bg-blue-500 text-white py-2 px-4 hover:bg-blue-800 duration-300 rounded-2xl'
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Confirm Purchase'}
      </button>
    </div>
  )
}

export default Buy;
