import React, { useState } from 'react';
import './style.css';

const steps = [
  { label: 'Address', imageUrl: 'https://via.placeholder.com/150' },
  { label: 'Shipping', imageUrl: 'https://via.placeholder.com/150' },
  { label: 'Payment', imageUrl: 'https://via.placeholder.com/150' },
  { label: 'Summary', imageUrl: 'https://via.placeholder.com/150' },
];

const ProgressSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [popupImage, setPopupImage] = useState(null);

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const openPopup = (imageUrl) => {
    setPopupImage(imageUrl);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  const progressWidth = `${(activeStep / (steps.length - 1)) * 100}%`;

  return (
    <div className="progress-container">
      <div className="step-container">
        <div className="progress-bar" style={{ width: progressWidth }}></div>
        {steps.map((step, index) => (
          <div key={index} className="step-wrapper" onClick={() => openPopup(step.imageUrl)}>
            <div className={`step ${index <= activeStep ? 'completed' : ''}`}>
              {index < activeStep ? '✔' : index + 1}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button onClick={prevStep} disabled={activeStep === 0}>
          Previous
        </button>
        <button onClick={nextStep} disabled={activeStep === steps.length - 1}>
          Next
        </button>
      </div>

      {popupImage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content">
            <img src={popupImage} alt="Step Image" />
            <button className="close-button" onClick={closePopup}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSteps;
