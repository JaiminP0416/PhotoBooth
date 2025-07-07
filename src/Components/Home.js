import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './home.css';

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
        {/* https://codepen.io/ash_creator/pen/zYaZXLJ button animation */}
      
        {/* Make a small video and replace these instructions!! */}
        <div className="instructions-container card--glass">
          <span className='bold-span'>To Experience Virtual Photobooth:</span><br/><pre/>
          <span className="tab"> <span className='bold-span'>1.</span> Think of <span className='bold-span'>3 poses</span></span><br/>
          <span className="tab"> <span className='bold-span'>2.</span> Settle in and Click on <span className='bold-span'ong>"Let's Go"</span></span><br/>
          <span className="tab"> <span className='bold-span'>3.</span> CLick on 📸 </span><br/>
          <span className="tab">  <span className='bold-span'>4.</span> Choose your <span className='bold-span'>Frame</span> and <span className='bold-span'>Download!</span></span>
          <span className='bold-span'><p class="card-footer">Have Fun!</p></span>
        </div>
      </div>
      </div> 
    </>
  )
}

