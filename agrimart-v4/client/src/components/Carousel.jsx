import React, { useState, useEffect } from 'react';
import '../styles/Carousel.css';

const Carousel = () => {
  // 1. Array of images and deals
  const slides = [
    {
      id: 1,
      image: "https://img.freepik.com/free-vector/flat-agriculture-faming-horizontal-banner-template_23-2148895924.jpg",
      buttonText: "SHOP SEEDS"
    },
    {
      id: 2,
      image: "https://img.freepik.com/free-vector/flat-farming-landing-page-template_23-2148902517.jpg",
      buttonText: "VIEW EQUIPMENT"
    },
    {
      id: 3,
      image: "https://img.freepik.com/free-vector/organic-farming-horizontal-banner_23-2149113645.jpg",
      buttonText: "GET NUTRIENTS"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Logic to auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [slides.length]);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div 
          className={index === currentIndex ? "carousel-slide active" : "carousel-slide"} 
          key={slide.id}
        >
          {index === currentIndex && (
            <>
              <img src={slide.image} alt="Deal Banner" />
              <div className="carousel-content">
                <button className="shop-btn">{slide.buttonText}</button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* 3. Navigation Dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span 
            key={index}
            className={index === currentIndex ? "dot active" : "dot"}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;