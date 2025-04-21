import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function Booth() {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const capture = async () => {
    setCapturedImages([]);
    setIsCapturing(true);
    const newImages = [];

    for (let i = 0; i < 3; i++) {
      for (let c = 3; c >= 0; c--) {
        setCountdown(c);
        await new Promise((res) => setTimeout(res, 1000));
      }

      // Flash effect instead of showing "0"
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

  const downloadCollage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600 * capturedImages.length;

    capturedImages.forEach((imageSrc, index) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        ctx.drawImage(img, 0, index * 600, 600, 600);
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
    <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
      {/* Webcam */}
      {(isCapturing || capturedImages.length === 0) && (
  <Webcam
    ref={webcamRef}
    width={600}
    height={600}
    mirrored={true}
    screenshotFormat="image/jpeg"
    screenshotQuality={1}
    style={{ border: '8px solid #222', borderRadius: '8px' }}
  />
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
          }}
        />
      )}

      {/* Countdown */}
      {countdown !== null && countdown !== 0 && (
        <div
          className="countdown"
          style={{
            position: 'absolute',
            top: '40%',
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
            <img
              key={idx}
              src={src}
              alt={`Captured ${idx + 1}`}
              width={200}
              height={200}
              style={{
                margin: '10px 0',
                borderRadius: '8px',
                border: '4px solid #444',
              }}
            />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="btn-container" style={{ marginTop: '20px' }}>
        {!isCapturing && capturedImages.length === 0 && (
          <button onClick={capture} style={btnStyle}>
            📸 Capture Photos
          </button>
        )}
        {!isCapturing && capturedImages.length === 3 && (
          <>
            <button onClick={downloadCollage} style={btnStyle}>
              ⬇️ Download Collage
            </button>
            <button onClick={reset} style={btnStyle}>
              🔄 Restart
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





















































// import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';

// export default function Booth() {
//   const webcamRef = useRef(null);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [countdown, setCountdown] = useState(null);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [showFlash, setShowFlash] = useState(false);

//   const capture = async () => {
//     setCapturedImages([]);
//     setIsCapturing(true);
//     const newImages = [];

//     for (let i = 0; i < 3; i++) {
//       for (let c = 3; c >= 0; c--) {
//         setCountdown(c);
//         await new Promise((res) => setTimeout(res, 1000));
//       }

//       // Flash effect instead of showing "0"
//       setCountdown(null);
//       triggerFlash();

//       const imageSrc = webcamRef.current.getScreenshot();
//       if (imageSrc) {
//         newImages.push(imageSrc);
//       }

//       await new Promise((res) => setTimeout(res, 300));
//     }

//     setCapturedImages(newImages);
//     setIsCapturing(false);
//     setCountdown(null);
//   };

//   const triggerFlash = () => {
//     setShowFlash(true);
//     setTimeout(() => setShowFlash(false), 150); // Flash for 150ms
//   };

//   const reset = () => {
//     setCapturedImages([]);
//     setIsCapturing(false);
//     setCountdown(null);
//   };

//   const downloadCollage = () => {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     canvas.width = 600;
//     canvas.height = 600 * capturedImages.length;

//     capturedImages.forEach((imageSrc, index) => {
//       const img = new Image();
//       img.src = imageSrc;
//       img.onload = () => {
//         ctx.drawImage(img, 0, index * 600, 600, 600);
//         if (index === capturedImages.length - 1) {
//           const link = document.createElement('a');
//           link.href = canvas.toDataURL('image/png');
//           link.download = 'photobooth_collage.png';
//           link.click();
//         }
//       };
//     });
//   };

//   return (
//     <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
//       {/* Webcam */}
//       {isCapturing && (
//         <Webcam
//           ref={webcamRef}
//           width={600}
//           height={600}
//           mirrored={true}
//           screenshotFormat="image/jpeg"
//           screenshotQuality={1}
//           style={{ border: '8px solid #222', borderRadius: '8px' }}
//         />
//       )}

//       {/* Flash overlay */}
//       {showFlash && (
//         <div
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'white',
//             opacity: 0.9,
//             zIndex: 999,
//           }}
//         />
//       )}

//       {/* Countdown */}
//       {countdown !== null && countdown !== 0 && (
//         <div
//           className="countdown"
//           style={{
//             position: 'absolute',
//             top: '40%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             fontSize: '5rem',
//             color: 'white',
//             textShadow: '2px 2px 10px black',
//             zIndex: 1000,
//           }}
//         >
//           {countdown}
//         </div>
//       )}

//       {/* Captured images shown vertically */}
//       {!isCapturing && capturedImages.length === 3 && (
//         <div
//           className="captured-images"
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             marginTop: '20px',
//           }}
//         >
//           {capturedImages.map((src, idx) => (
//             <img
//               key={idx}
//               src={src}
//               alt={`Captured ${idx + 1}`}
//               width={200}
//               height={200}
//               // style={{
//               //   // margin: '10px 0',
//               //   borderRadius: '8px',
//               //   border: '4px solid #444',
//               // }}
//             />
//           ))}
//         </div>
//       )}

//       {/* Buttons */}
//       <div className="btn-container" style={{ marginTop: '20px' }}>
//         {!isCapturing && capturedImages.length === 0 && (
//           <button onClick={capture} style={btnStyle}>
//             📸 Capture Photos
//           </button>
//         )}
//         {!isCapturing && capturedImages.length === 3 && (
//           <>
//             <button onClick={downloadCollage} style={btnStyle}>
//               ⬇️ Download Collage
//             </button>
//             <button onClick={reset} style={btnStyle}>
//               🔄 Restart
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// const btnStyle = {
//   padding: '10px 20px',
//   margin: '10px',
//   fontSize: '16px',
//   borderRadius: '5px',
//   background: '#111',
//   color: '#fff',
//   cursor: 'pointer',
//   border: 'none',
//   transition: 'all 0.3s ease',
// };


// // import React from 'react'
// // import Webcam from "react-webcam"; //https://blog.logrocket.com/using-react-webcam-capture-display-images/
// // import { useCallback,useRef,useState} from "react";

// // export default function Booth() {

// //     const CustomWebcam = () => {

      
// //       const webcamRef = useRef(null);
// //       const [imgSrc, setImgSrc] = useState(null);
      
// //       // const [mirrored, setMirrored] = useState(true); //if I want to allow option to mirror the img or not

// //       // const capture = useCallback(() => {
// //       //   const imageSrc = webcamRef.current.getScreenshot();
// //       //   setImgSrc(imageSrc);
// //       // }, [webcamRef]);
// //       //async timeout function:  Calling timeout() directly: You'll get a Promise object. Using .then() or await: You'll properly handle the resolved value ("Hello").
      
// //       const capture = useCallback(async () => {
        
// //         let countdown = 2; 
// //         const intervalId = setInterval(() => {
// //           setCountdown(countdown);
// //           countdown -= 1;
      
// //           if (countdown < 0) {
// //             clearInterval(intervalId);
// //           }
// //         }, 1000);
      
        
// //         await new Promise (resolve => setTimeout(resolve,3000));      
// //         const imageSrc = webcamRef.current.getScreenshot();
// //         setImgSrc(imageSrc);
// //       }, [webcamRef]);

// //       const retake = () => { 
// //         setImgSrc(null);
// //       }

// //       const [countdown, setCountdown] = useState(3);

// //       return (
// //         <div className="container">
// //         {imgSrc ? (
// //           <img src={imgSrc} alt="webcam" /> //if captured,shows the photo else show the webCam 
// //         ) : (
// //           <Webcam 
// //           height={600} 
// //           width={600} 
// //           ref={webcamRef} 
// //           mirrored={true} 
// //           screenshotFormat="image/jpeg"
// //           screenshotQuality={1}/>
// //         )}
// //         <div className='countdown'>{countdown}</div>
// //         <div className="btn-container">
// //           {imgSrc ? (
// //             <button onClick={retake}>Retake photo</button>
// //           ) : (
// //             <button onClick={capture}>Capture photo</button>
// //           )}
// //         </div>
// //       </div>
// //       );
// //     };

// //   return (
// //     <>
// //     <div className="booth-page">
         
// //         <div className='container-booth'>This is Booth</div>
// //         <div className="App">
// //           <CustomWebcam />
// //         </div>
// //     </div>
// //     </>
// //   )
// // }
