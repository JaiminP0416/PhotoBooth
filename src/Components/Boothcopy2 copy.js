//BACK up of Backup with IMG replaced with Canvas

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function BoothCopy() {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('grayscale(100%)'); 
  const [filter,setFilter] = useState('Vintage');
  const canvasRefs = useRef([]);
  
  const navigate = useNavigate();
  // const handleBackBtn = () => { //No need as we are inside Booth so can directly use arrow function
  //   navigate('/');
  // };




  const capture = async () => {  //capture button will create an array of clicked images.
    setCapturedImages([]);
    setIsCapturing(true);
    const newImages = [];

    for (let i = 0; i < 3; i++) {
      for (let c = 3; c >= 1; c--) {  //countdown of three seconds will happen for 3 times.
        setCountdown(c);
        await new Promise((res) => setTimeout(res, 100));
      }

      // Flash effect instead of showing "0"
      setCountdown(null); //after the internal for loop, countdown set to null for another iteration of main for loop.
      triggerFlash();

      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        newImages.push(imageSrc);
      }

      await new Promise((res) => setTimeout(res, 300));
    }

    setCapturedImages(newImages); //fills up the array with pictures
    setIsCapturing(false);
    setCountdown(null);
  };  //End of capture

  const triggerFlash = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150); // Flash for 150ms
  };

  const reset = () => {  //Removed the access to Reset from UserEnd 
    setCapturedImages([]);
    setIsCapturing(false);
    setCountdown(null);
  };

    
    useEffect(() => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 600 * capturedImages.length;

      capturedImages.forEach((imageSrc, index) => { //we pass the image sorce and index
        const img = new Image();  //Image(); created object in JS like <img/> in HTML
        img.src = imageSrc; 
        /* This code snippet is handling the logic for creating a photo collage from the captured images.
        Here's a breakdown of what it does: */
        img.onload = () => {  //once the image is loaded, we draw it on the canvas 
          //ctx.drawImage(img, 0, index * 600, 600, 400); //using .drawImage method and passing the img, we draw it on the canvas we created
          // if (index === capturedImages.length - 1) { 
          //   const link = document.createElement('a'); //creates an anchor tag to simulate a download
          //   link.href = canvas.toDataURL('image/png');
          //   link.download = 'photobooth_collage.png';
          //   link.click();
          // }
  
          const targetWidth = 600;
          const targetHeight = 600;
  
          const imageAspectRatio = img.width / img.height;
          const targetAspectRatio = targetWidth / targetHeight;
  
          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = img.width;
          let sourceHeight = img.height;
  
        // Crop logic: object-fit: cover
        if (imageAspectRatio > targetAspectRatio) {
          // Image is wider — crop sides
          sourceWidth = img.height * targetAspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller — crop top and bottom
          sourceHeight = img.width / targetAspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
        ctx.filter = `${selectedFilter}`
        // Draw the cropped image into the fixed-size box
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,  // source crop
          0, index * targetHeight, targetWidth, targetHeight  // canvas destination
        );
      }});
    }, [capturedImages]);




  const downloadCollage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600 * capturedImages.length;

    capturedImages.forEach((imageSrc, index) => { //we pass the image sorce and index
      const img = new Image();  //Image(); created object in JS like <img/> in HTML
      img.src = imageSrc; 
      /* This code snippet is handling the logic for creating a photo collage from the captured images.
      Here's a breakdown of what it does: */
      img.onload = () => {  //once the image is loaded, we draw it on the canvas 
        //ctx.drawImage(img, 0, index * 600, 600, 400); //using .drawImage method and passing the img, we draw it on the canvas we created
        // if (index === capturedImages.length - 1) { 
        //   const link = document.createElement('a'); //creates an anchor tag to simulate a download
        //   link.href = canvas.toDataURL('image/png');
        //   link.download = 'photobooth_collage.png';
        //   link.click();
        // }

        const targetWidth = 600;
        const targetHeight = 600;

        const imageAspectRatio = img.width / img.height;
        const targetAspectRatio = targetWidth / targetHeight;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

      // Crop logic: object-fit: cover
      if (imageAspectRatio > targetAspectRatio) {
        // Image is wider — crop sides
        sourceWidth = img.height * targetAspectRatio;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        // Image is taller — crop top and bottom
        sourceHeight = img.width / targetAspectRatio;
        sourceY = (img.height - sourceHeight) / 2;
      }
      ctx.filter = `${selectedFilter}`
      // Draw the cropped image into the fixed-size box
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,  // source crop
        0, index * targetHeight, targetWidth, targetHeight  // canvas destination
      );

      // Trigger download after last image
      if (index === capturedImages.length - 1) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'photobooth_collage.png';
        link.click();
      }
        

      };
    });
  };

  return (
    <div className="booth-container" style={{ position: 'relative', textAlign: 'center' }}>
      <div>
      {/* {location.pathname === '/booth' && (
        <button onClick={handleBackBtn} className='booth-back-btn'>Back</button>
        )} As we are already inside /booth we dont need this check */}

      <button onClick={() => navigate('/')} className='booth-back-btn'>Back</button>
      </div>
      
      {/* <div style={{ marginTop: '20px' }}>
        <button onClick={() => setSelectedFilter('grayscale(100%)')} style={btnStyle}>Grayscale</button>
        <button onClick={() => setSelectedFilter('')} style={btnStyle}>None</button>
      </div> */}
    
      {/* Webcam */}
      {(isCapturing || capturedImages.length === 0) && (
        <Webcam
          ref={webcamRef}
          //width={600}
          height={500}
          mirrored={true}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          style={{ border: '5px solid #222', borderRadius: '8px', marginTop: "50px", filter: selectedFilter}}
        />

        
)}      

        {/* Filetr toggle switch */}
        {(isCapturing || capturedImages.length === 0) && (
        <div className="btn-container form-switch" style={{marginTop:"20px"}}>

            <input 
            checked={selectedFilter === 'grayscale(100%)'} 
            onChange={(e) =>{ 
              setSelectedFilter(e.target.checked ? 'grayscale(100%)' : 'none');
              // setFilter(e.target.checked ? 'Vintage' : "")
              }} 
            className="form-check-input" type="checkbox" 
            role="switch" 
            id="switchCheckDefault"/>

            <label className="form-check-label" 
              style={{
              paddingLeft:"10px",
              fontFamily: "Jost",
              fontWeight: "500",
              fontSize:"20px",
              fontStyle: "normal",}}
              for="switchCheckDefault">
                {`${filter}`}
            </label>

        </div>
       )}

      

      {/* Flash overlay */}
      {showFlash && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            opacity: 0.9,
            zIndex: 999,
            pointerEvents: 'none',
          }}
        />
      )}


      {/* Countdown */}
      {countdown !== null && countdown !== 0 && (
        <div
          className="countdown"
          style={{
            fontFamily: "Pacifico",
            fontWeight: "400",
            fontStyle: "normal",
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '5rem',
            color: 'white',
            textShadow: '2px 2px 10px black',
            zIndex: 1000,
          }}
        >
          {countdown}
        </div>
      )}

      {/* Captured images shown vertically */}
      {!isCapturing && capturedImages.length === 3 && (
        <div
          className="captured-images"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          {capturedImages.map((src, idx) => (
            // <img
            //   key={idx}
            //   src={src}
            //   alt={`Captured ${idx + 1}`}
            //   width={200}
            //   height={200}
            //   // style={{
            //   //   margin: '10px 0',
            //   //   borderRadius: '8px',
            //   //   border: '4px solid #444',
            //   // }}
            // />
              <canvas
                key={idx}
                ref={(el) => (canvasRefs.current[idx] = el)}
                width={200}
                height={200}
                style={{ margin: '5px', border: '1px solid #ccc' }}
              />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="btn-container" style={{ marginTop: '20px' }}>
        {!isCapturing && capturedImages.length === 0 && (
          <button onClick={capture} style={btnStyle}>
            📸 Capture Photos                                              {/* add Icons here */}
          </button>
        )}

          

        {!isCapturing && capturedImages.length === 3 && (
          <>
            <button onClick={downloadCollage} style={btnStyle}>
              ⬇️ Download Collage                                           {/* add Icons here */}
            </button>
            <button onClick={reset} style={btnStyle}>
              🔄 Restart                                                    {/* add Icons here */}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  background: '#111',
  color: '#fff',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.3s ease',
};
