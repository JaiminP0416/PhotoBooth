//FALIED FRAME

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {facamera} from '@fortawesome/free-brands-svg-icons'
import { Camera } from 'lucide-react';


export default function BoothCopy() {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('grayscale(100%)');
  const [selectedFrame, setSelectedFrame] = useState(null); 
  const [filter,setFilter] = useState('Vintage');
  const canvasRefs = useRef([]);
  const frameCanvasRef = useRef(null);
  
  const navigate = useNavigate();

  const capture = async () => {  
    setCapturedImages([]);
    setIsCapturing(true);
    const newImages = [];

    for (let i = 0; i < 3; i++) {
      for (let c = 3; c >= 1; c--) { 
        setCountdown(c);
        await new Promise((res) => setTimeout(res, 100));
      }

      setCountdown(null); 
      triggerFlash();

      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        newImages.push(imageSrc);
      }

      await new Promise((res) => setTimeout(res, 300));
    }

    setCapturedImages(newImages); 
    setIsCapturing(false);
    setCountdown(null);
  }; 



  const triggerFlash = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150); // Flash for 150ms
  };

  const reset = () => {  
    setCapturedImages([]);
    setIsCapturing(false);
    setCountdown(null);
  };

    {/* Preview using Canvas */}
    useEffect(() => {
        if (capturedImages.length !== 3) return;
      
        capturedImages.forEach((src, idx) => {
          const canvas = canvasRefs.current[idx];
          if (!canvas) return;
      
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.src = src;
      
          img.onload = () => {
            const targetWidth = canvas.width;
            const targetHeight = canvas.height;
      
            const imageAspectRatio = img.width / img.height;
            const targetAspectRatio = targetWidth / targetHeight;
      
            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = img.width;
            let sourceHeight = img.height;
      
            if (imageAspectRatio > targetAspectRatio) {
              sourceWidth = img.height * (targetAspectRatio);
              sourceX = (img.width - sourceWidth) / 2;
            } else {
              sourceHeight = img.width / (targetAspectRatio);
              sourceY = (img.height - sourceHeight) / 2;
            }
      
            ctx.clearRect(0, 0, targetWidth, targetHeight); // clear previous image if any
            ctx.filter = selectedFilter;
            ctx.drawImage(
              img,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, 0, targetWidth, targetHeight
            );
          };
        });
      }, [capturedImages, selectedFilter]);
      
      useEffect(() => {
        if (!selectedFrame || capturedImages.length !== 3) return;
      
        const frameCanvas = frameCanvasRef.current;
        const ctx = frameCanvas.getContext('2d');
      
        const frameImg = new Image();
        frameImg.onload = () => {
          ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
          ctx.drawImage(frameImg, 0, 0, frameCanvas.width, frameCanvas.height);
        };
        frameImg.src = selectedFrame;
      }, [selectedFrame, capturedImages]);
      



      const downloadCollage = () => {
        const collageCanvas = document.createElement('canvas');
        const ctx = collageCanvas.getContext('2d');
        collageCanvas.width = 600;
        collageCanvas.height = 600 * capturedImages.length;
      
        let imagesLoaded = 0;
      
        capturedImages.forEach((imageSrc, index) => {
          const img = new Image();
          img.src = imageSrc;
      
          img.onload = () => {
            const targetWidth = 600;
            const targetHeight = 600;
      
            const imageAspectRatio = img.width / img.height;
            const targetAspectRatio = targetWidth / targetHeight;
      
            let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
      
            if (imageAspectRatio > targetAspectRatio) {
              sourceWidth = img.height * targetAspectRatio;
              sourceX = (img.width - sourceWidth) / 2;
            } else {
              sourceHeight = img.width / targetAspectRatio;
              sourceY = (img.height - sourceHeight) / 2;
            }
      
            ctx.filter = selectedFilter;
            ctx.drawImage(
              img,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, index * targetHeight, targetWidth, targetHeight
            );
      
            imagesLoaded++;
            if (imagesLoaded === capturedImages.length) {
              if (selectedFrame) {
                const frameImg = new Image();
                frameImg.onload = () => {
                  ctx.drawImage(frameImg, 0, 0, 600, 1800);
                  const link = document.createElement('a');
                  link.href = collageCanvas.toDataURL('image/png');
                  link.download = 'photobooth_collage.png';
                  link.click();
                };
                frameImg.src = selectedFrame;
              } else {
                const link = document.createElement('a');
                link.href = collageCanvas.toDataURL('image/png');
                link.download = 'photobooth_collage.png';
                link.click();
              }
            }
          };
        });
      };
      

  return (
    <div className="booth-container" style={{ position: 'relative', textAlign: 'center' }}>
        <FontAwesomeIcon icon="fa-solid fa-camera" />
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
  <><div style={{ position: 'relative', width: 200, height: 600 }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {capturedImages.map((src, idx) => (
        <canvas
          key={idx}
          ref={(el) => (canvasRefs.current[idx] = el)}
          width={200}
          height={200}
        />
      ))}
    </div>
    <canvas
      ref={frameCanvasRef}
      width={600}
      height={600}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />


  </div>
  <div style={{ margin: '20px' }}>
  <label style={{ fontSize: '16px', fontWeight: '500', fontFamily: 'Jost' }}>
    Select a Frame: 
  </label>
  <select
    onChange={(e) => setSelectedFrame(e.target.value || null)}
    style={{
      marginLeft: '10px',
      padding: '6px 10px',
      borderRadius: '4px',
      fontSize: '16px',
    }}
  >
    <option value="">None</option>
    <option value="/frames/Frame1.png">Frame 1</option>
    <option value="/frames/frame2.png">Frame 2</option>
  </select>
</div>
</>
)}


      {/* Buttons */}
      <div className="btn-container" style={{ marginTop: '20px' }}>
        {!isCapturing && capturedImages.length === 0 && (
          <button onClick={capture} style={shutterBtnStyle}>
            <Camera size={35}/>                                           {/* add Icons here */}
          </button>
        )}

          

        {!isCapturing && capturedImages.length === 3 && (
          <>
            <button onClick={downloadCollage} style={btnStyle}>
                 Download Collage                                           {/* add Icons here */}
            </button>
            <button onClick={reset} style={btnStyle}>
              Restart                                                    {/* add Icons here */}
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


const shutterBtnStyle = {
  //padding:'0px',
  height:'50px',
  width:'50px',
  margin: '10px',
  borderRadius: '5px',
  background: '#bbb',
  color: '#fff',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.3s ease',
};
