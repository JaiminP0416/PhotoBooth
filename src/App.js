import './App.css';
import React from 'react';
import About from './Components/About';
import Home from './Components/Home';
// import Booth from './Components/Booth';
import Booth from './Components/Booth';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';



function App() {

  const router = createBrowserRouter([
    {
      path: '/' ,
      element:<><Home/></>,
    },
    {
      path:'/booth',
      // element:<><Navbar/><Booth/></>,
      element:<><Booth/></>,
    },
    // {
    //   path:'/booth',
    //   // element:<><Navbar/><Booth/></>,
    //   element:<><Booth/></>,
    // },
    {
      path:'/about',
      element:<><About/></>,
    }
  ],
  {
    basename: '/PhotoBooth'
  }

)
  return (
      <>  
      
        <RouterProvider router = {router}/>
 
      </>
  );
}


// function NavBtns(){

//   const navigate = useNavigate();
//   const location = useLocation();

//   const goHome = ()=>{
//     navigate('/');
//   }
//   const goAbout = ()=>{
//     navigate('/about');
//   }
  
//   return(
//           <div className='NavBtns' >
//             <button onClick={goHome} className="NavBtn">Home</button>
//             <button onClick={goAbout} className="NavBtn">About</button>
//           </div>

//   )

// }




// function BoothBackBtn () {
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleBackBtn = ()=>{
//     navigate('/');
//   }

//  return(
//         <div>
//           {location.pathname ==='/booth'&&         
//             <button onClick={handleBackBtn} className='booth-back-btn'>Back</button>
//           }
//           <Booth/>
//         </div>
//  );
// }


export default App;



// ////////////////////////////////////////////////////////////////////////////////////////////////////////






//started with routing. Added a button to go booth.js and was using NavBar to go Home and About. Now, when I added the background Image to body, I did not want to be displayed on the Booth page so I wraped the booth.js and home.js in body tags with different class names and gave each of them different classes and gave background-image: none to booth body. This solved the problem and I was able to get the desired output. However, I kept getting this console error that I cannot wrap body tag inside a div, which was happening at app.js. To tackle this, I wrapped both components into main divs and gave the same classes. this time it was funcitonal but with a little malfunciton, Navbar was also excluded from that img leaving a white space there. It was not an issues if I decided not to blend these home and about links into one page. So I decided to convert these into buttons, just like let's go button to go to Booth. Now I made a mistake while routoing it. Solution was to create two new buttons just like Let's Go button inside a function and that function whould repalce the <NavBar/> tag. I was not providing this tag to the router casung tons of issues. All I had to do was Create a NavBtn funciton inside which create two fucntions goHome and goAbout, call these inside return when the respecive buttons are clicked. These funcitons uses useNavigation from react-router-dom and with arrow funcitons add the navigation path to desired pages. 

//okay, all of above is rubbish. We had to move the buttons to home.js and gave the background image to the home.js only. We were not able to restrict the image being shown in about and booth.js. We had to move all the buttons to home.js where Let's Go button was already. 












