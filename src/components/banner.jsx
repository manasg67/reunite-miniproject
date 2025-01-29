import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      title: "Search Person by Face Photo.",
      description: "Search by face photo to get the best possible results providing you with accurate and similar matched results.",
      image: "/images/police_face_scan.jpg",
      buttonText: "Search Person By Face Photo"
    },
    {
      title: "Report Missing Person",
      description: "File a detailed report about a missing person with all relevant information to help in the search process.",
      image: "/images/sbidentity.jpg",
      buttonText: "File Missing Report"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-red-900 to-red-950">
      <div className="container mx-auto">
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/30 p-2 text-white hover:bg-white/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/30 p-2 text-white hover:bg-white/50"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Carousel Content */}
          <div className="flex min-h-[600px] items-center px-4 py-12 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Image Section */}
              <div className="flex items-center justify-center">
                <div className="overflow-hidden rounded-full">
                  <img
                    src={features[currentSlide].image}
                    alt="Feature illustration"
                    className="h-[400px] w-[400px] object-cover transition-opacity duration-500"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-center space-y-6 text-white">
                <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl">
                  {features[currentSlide].title}
                </h2>
                <p className="text-lg md:text-xl">
                  {features[currentSlide].description}
                </p>
                <button className="w-fit rounded-full bg-blue-900 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800">
                  {features[currentSlide].buttonText}
                </button>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;