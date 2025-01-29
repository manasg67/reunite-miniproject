import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Banner = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const features = [
    {
      title: t('banner.features.face_search.title'),
      description: t('banner.features.face_search.description'),
      image: "/images/police_face_scan.jpg",
      buttonText: t('banner.features.face_search.button')
    },
    {
      title: t('banner.features.report_missing.title'),
      description: t('banner.features.report_missing.description'),
      image: "/images/sbidentity.jpg",
      buttonText: t('banner.features.report_missing.button')
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isAnimating]);

  const nextSlide = () => {
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (slideIndex) => {
    setIsAnimating(true);
    setCurrentSlide(slideIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('/public/pattern.svg')]" />
      
      <div className="container mx-auto relative">
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/10 p-4 text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/10 p-4 text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Carousel Content */}
          <div className="flex min-h-[700px] items-center px-6 py-16 md:px-8">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Image Section */}
              <div className="flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={features[currentSlide].image}
                      alt={features[currentSlide].title}
                      className="h-[500px] w-full object-cover transform transition-all duration-700 hover:scale-110"
                    />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-center space-y-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    {features[currentSlide].title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                    {features[currentSlide].description}
                  </p>
                </div>
                <button className="group flex items-center gap-2 w-fit rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-1">
                  {features[currentSlide].buttonText}
                  <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Dots Navigation */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform space-x-3">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
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