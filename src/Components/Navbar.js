import React from 'react';
import {Link} from 'react-router-dom';



//read NavBar documentetion for responsiveness

export default function Navbar() {
  return (
    <>
    
        <div className="navbar ">
                <div className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                </div>
                {/* <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/booth">Booth</Link>
                </li> */}
                <div className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/about">About</Link>
                </div>
        </div>
            
    
    </>
  )
}
