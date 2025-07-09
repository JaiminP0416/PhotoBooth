import React, { useRef, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Webcam from 'react-webcam';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

import './print.css';


export default function Booth() {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('grayscale(100%)'); 
  const [filter,setFilter] = useState('Vintage');
  const [frame,setFrame] = useState('simple');
  const canvasRefs = useRef([]);
  const navigate = useNavigate();

  const capture = async () => {  
    setCapturedImages([]);
    setIsCapturing(true);
    const newImages = [];

    for (let i = 0; i < 3; i++) {
      for (let c = 3; c >= 1; c--) { 
        setCountdown(c);
        await new Promise((res) => setTimeout(res, 1000));
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
        if (capturedImages.length !== 3 ) return;
      
        capturedImages.forEach((src, idx) => {
          const canvas = canvasRefs.current[idx];
          if (!canvas) return;
      
          const ctx = canvas.getContext('2d');
          const img = new Image();

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

          img.src = src;
        });
      }, [capturedImages, selectedFilter]);
      




  // const downloadCollage = () => {
  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');
  //   canvas.width = 600;
  //   canvas.height = 600 * capturedImages.length;

  //   capturedImages.forEach((imageSrc, index) => { 
  //     const img = new Image(); 
  //     img.src = imageSrc; 
      
  //     img.onload = () => {  

  //       const targetWidth = 600;
  //       const targetHeight = 600;

  //       const imageAspectRatio = img.width / img.height;
  //       const targetAspectRatio = targetWidth / targetHeight;

  //       let sourceX = 0;
  //       let sourceY = 0;
  //       let sourceWidth = img.width;
  //       let sourceHeight = img.height;

  //     // Crop logic: object-fit: cover
  //     if (imageAspectRatio > targetAspectRatio) {
  //       // Image is wider — crop sides
  //       sourceWidth = img.height * targetAspectRatio;
  //       sourceX = (img.width - sourceWidth) / 2;
  //     } else {
  //       // Image is taller — crop top and bottom
  //       sourceHeight = img.width / targetAspectRatio;
  //       sourceY = (img.height - sourceHeight) / 2;
  //     }
  //     ctx.filter = `${selectedFilter}`
  //     // Draw the cropped image into the fixed-size box
  //     ctx.drawImage(
  //       img,
  //       sourceX, sourceY, sourceWidth, sourceHeight,  // source crop
  //       0, index * targetHeight, targetWidth, targetHeight  // canvas destination
  //     );

  //     // Trigger download after last image
  //     if (index === capturedImages.length - 1) {
  //       const link = document.createElement('a');
  //       link.href = canvas.toDataURL('image/png');
  //       link.download = 'photobooth_collage.png';
  //       link.click();
  //     }
        

  //     };
  //   });
  // };
 

const downloadDivAsImage = async () => {
  const element = document.getElementById('canvasToDownload');

  if (!element) {
    console.error('Element not found!');
    return;
  }

  const canvas = await html2canvas(element, {
    useCORS: true, 
    backgroundColor: null
  });

  const link = document.createElement('a');
  link.download = 'photobooth_print.png';
  link.href = canvas.toDataURL();
  link.click();
};

  // const handleChange = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newFrame: string,
  // ) => {
  //   setFrame(newFrame);
  // };

    const handleChange = (newFrame) => {
    setFrame(newFrame);
  };

  const [color, setColor] = useColor("hex", "#dbdbdb");
  const textColor = parseInt(color.hex.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff';


  return (
    <div className="booth-container" style={{ position: 'relative', textAlign: 'center' }}>
        <FontAwesomeIcon icon="fa-solid fa-camera" />
      <div>
      {/* {location.pathname === '/booth' && (
        <button onClick={handleBackBtn} className='booth-back-btn'>Back</button>
        )} As we are already inside /booth we dont need this check */}

      <button onClick={() => navigate('/')} className='booth-back-btn'>Back</button>
      </div>

    
      {/* Webcam */}
      {(isCapturing || capturedImages.length === 0) && (
        <Webcam className='webcam'
          ref={webcamRef}
          //width={600}
          height={500}
          mirrored={true}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          style={{ border: '5px solid #222', borderRadius: '8px', marginTop: "50px", filter: selectedFilter}}
        />

        
)}      

        {/* ////////////////////////////////////////////////Filetr toggle switch////////////////////////////////////////// */}
        {(isCapturing || capturedImages.length === 0) && (
        <div className="btn-container form-switch" style={{marginTop:"20px"}}>

            {/* <input 
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
            </label> */}

              {/* <FormControlLabel control={<Switch defaultChecked />} label="Label" /> */}
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedFilter === 'grayscale(100%)'}
                    onChange={(e) => {
                      setSelectedFilter(e.target.checked ? 'grayscale(100%)' : 'none');
                    }}
                    name="grayscaleSwitch"
                    
                  />
                }
                label={filter}
                 sx={{
                  '.MuiFormControlLabel-label': {
                    fontFamily: 'Jost',
                    fontWeight: 500,
                    fontSize: '20px',
                    fontStyle: 'normal',
                  },
                }}
              />
           

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
            top: '38%',
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
        >
          <div id='canvasToDownload' className={frame} style={{ backgroundColor: frame === 'modern' ? color.hex : "" }}>
          {capturedImages.map((src, idx) => (
              <canvas
                key={idx}
                ref={(el) => (canvasRefs.current[idx] = el)}
                width={200}
                height={200}
              />
          ))}
            
             

            <div className="footer-date" style={{color: frame ==='modern' ? textColor : "black"}} >                 {/* adding dynamic contrast color detection*/}
              ❤ <br/>{new Date().toLocaleDateString('en-CA')}
            </div>
          </div>
          <div className='color-picker' style={{ display: frame === 'modern' ? 'flex' : 'none' }}>
          <ColorPicker  color={color} onChange={setColor} />
        </div>
        </div>
      )}

      {/* Buttons */}

      <div className="frame-btn-container">
          
        {!isCapturing && capturedImages.length === 3 && (
          <>
           {/* <ToggleButtonGroup
              value={frame}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton className='button-56' value="classic">Classic</ToggleButton>
              <ToggleButton className='button-56' value="modern">Modern</ToggleButton>
              <ToggleButton className='button-56' value="simple">None</ToggleButton>
            </ToggleButtonGroup> */}
            {/* <div role="group" aria-label="Platform" style={{ marginTop: 20 }}> */}
        <span className='frame-inst'>Choose your Frame:</span> 
        <button
          type="button"
          className={`button-55 ${frame === "classic" ? "selected" : ""}`}
          onClick={() => handleChange("classic")}
          aria-pressed={frame === "classic"}
        >
          Classic
        </button>

        <button
          type="button"
          className={`button-55 ${frame === "modern" ? "selected" : ""}`}
          onClick={() => handleChange("modern")}
          aria-pressed={frame === "modern"}
          style={{ marginLeft: 8 }}
        >
          Modern
        </button>

        <button
          type="button"
          className={`button-55 ${frame === "heart" ? "selected" : ""}`}
          onClick={() => handleChange("heart")}
          aria-pressed={frame === "heart"}
          style={{ marginLeft: 8 }}
        >
          Heart
        </button>
        <button
          type="button"
          className={`button-55 ${frame === "simple" ? "selected" : ""}`}
          onClick={() => handleChange("simple")}
          aria-pressed={frame === "simple"}
          style={{ marginLeft: 8 }}
        >
          None
        </button>
      {/* </div> */}


           
          
          </>
        )}


      </div>

      <div className="btn-container">
        {!isCapturing && capturedImages.length === 0 && (
          <button onClick={capture} style={shutterBtnStyle}>
            <Camera size={35}/>                                           {/* add Icons here */}
          </button>
        )}

        {!isCapturing && capturedImages.length === 3 && (
          <>          
            <button onClick = {downloadDivAsImage} style={btnStyle}>
              Download
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



