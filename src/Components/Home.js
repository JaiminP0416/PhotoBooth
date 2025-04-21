import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate();
    const location = useLocation();
  
    const goHome = ()=>{
      navigate('/');
    }
    const goAbout = ()=>{
      navigate('/about');
    }
    
    const handleGo = ()=>{
      navigate('/booth');
    }


  return (
    <>
    <div className='home-container'>
      <div className='NavBtns' >
              <button onClick={goHome} className="NavBtn">Home</button>
              <button onClick={goAbout} className="NavBtn">About</button>

      </div>
      <div className="container-go-btn"> 
        <button onClick={handleGo} className="btn-lets-go">Let's GO</button>
        
      </div>
      </div> 
    </>
  )
}

