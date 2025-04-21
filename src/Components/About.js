import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


export default function About() {

  const navigate = useNavigate();
      const location = useLocation();
    
      const goHome = ()=>{
        navigate('/');
      }
      const goAbout = ()=>{
        navigate('/about');
      }


  return (
    <>  

      <div className='NavBtns' >
              <button onClick={goHome} className="NavBtn">Home</button>
              <button onClick={goAbout} className="NavBtn">About</button>
      </div>
        <div>About Me</div>
        <p>Hi, I am Jaimin, developer of your beloved ThePhotoBooth</p>
    </>
  )
}
