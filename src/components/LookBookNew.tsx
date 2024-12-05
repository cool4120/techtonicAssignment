import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, ShoppingCart } from 'lucide-react';
import image1 from '../assets/clothImage1.jpg'
import vid1 from '../assets/sampleVideo.mp4'
import image3 from '../assets/clothImage3.jpg'
import image2 from '../assets/clothImage2.jpg'
import prodImg1 from '../assets/prodImg1.jpeg'
import prodImg12 from '../assets/prodImg12.jpeg'

import image4 from '../assets/clothImage4.jpg'
// Types remain the same as in previous implementation
interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
  }
  
  interface Annotation {
    x: number;
    y: number;
    productId: string;
  }
  
  interface MediaItem {
    type: 'image' | 'video';
    src: string;
    annotations?: Annotation[];
    products: Product[];
  }
  
  interface Look {
    id: string;
    mediaItems: MediaItem[];
  }

const LookbookComponent: React.FC = () => {
  // Expanded mock data to showcase vertical scrolling
  const looks: Look[] = [
    {
      id: 'Casual',
      mediaItems: [
        {
          type: 'image',
          src: image1,
          annotations: [
            { x: 40, y: 30, productId: 'prod1' },
            { x: 70, y: 80, productId: 'prod2' }
          ],
          products: [
            { 
              id: 'prod1', 
              name: 'Summer Dress', 
              price: 79.99, 
              image: prodImg1
            },
            { 
              id: 'prod2', 
              name: 'Baggy Pants', 
              price: 49.99, 
              image: prodImg12
            }
          ]
        }
      ]
    },
    {
        id: 'Elegant',
        mediaItems: [
          {
            type: 'image',
            src: image3,
            products: [
              {
                id: 'prod3',
                name: 'Elegant Coat',
                price: 129.99,
                image: image3,
              },
            ],
          },
        ],
     },
    {
      id: 'look2',
      mediaItems: [
        {
          type: 'video',
          src: vid1,
          products: [
            { 
              id: 'prod3', 
              name: 'Coat', 
              price: 129.99, 
              image: image3
            }
          ]
        }
      ]
    }
  ];

  const [currentLookIndex, setCurrentLookIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lookbookRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);


  // Existing media progression logic
  useEffect(() => {
    setProgress(0);

    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    const currentMedia = looks[currentLookIndex].mediaItems[currentMediaIndex];
    if (currentMedia.type === 'image') {
      progressTimerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextMedia();
            return 0;
          }
          return prev + (100 / 50);
        });
      }, 100);
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [currentLookIndex, currentMediaIndex]);

  // Existing video mute logic
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Navigation methods

  const handlePrevMedia = () => {
    const currentLook = looks[currentLookIndex];
    setCurrentMediaIndex(prev => 
      prev === 0 ? currentLook.mediaItems.length - 1 : prev - 1
    );
  };
  const handleNextMedia = () => {
    const currentLook = looks[currentLookIndex];
    setCurrentMediaIndex((prev) => (prev + 1) % currentLook.mediaItems.length);
  };

  const handleNextLook = () => {
    setCurrentLookIndex(prev => 
      (prev + 1) % looks.length
    );
    setCurrentMediaIndex(0);
  };

  const handlePrevLook = () => {
    setCurrentLookIndex(prev => 
      prev === 0 ? looks.length - 1 : prev - 1
    );
    setCurrentMediaIndex(0);
  };

  const handleProductClick = (productId: string) => {
    console.log(`Navigating to product: ${productId}`);
  };

  // Render method for media
  const renderMedia = () => {
    const currentLook = looks[currentLookIndex];
    const currentMedia = currentLook.mediaItems[currentMediaIndex];

    return (
      <div 
        className="relative w-full h-[70vh] overflow-hidden"
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
      >
        {/* Progress Bar */}
        <div className="absolute top-2 left-0 right-0 z-20 flex space-x-1 px-2">
          {currentLook.mediaItems.map((_, index) => (
            <div 
              key={index} 
              className="flex-1 h-1 bg-gray-300 overflow-hidden"
            >
              {currentMediaIndex === index && (
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${progress}%` }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Media Rendering - Similar to previous implementation */}
        {currentMedia.type === 'image' ? (
          <img 
            src={currentMedia.src} 
            alt="Look" 
            className="w-full h-full object-cover"
          />
        ) : (
          <video 
            ref={videoRef}
            src={currentMedia.src}
            autoPlay 
            loop
            className="w-full h-full object-cover"
          />
        )}

        {/* Annotations */}
        {currentMedia.annotations?.map((annotation, index) => (
          <button
            key={index}
            className="absolute w-4 h-4 bg-white rounded-full border-2 border-black"
            style={{ 
              left: `${annotation.x}%`, 
              top: `${annotation.y}%` 
            }}
            onClick={() => handleProductClick(annotation.productId)}
          >
            <span className="sr-only">
              View Product
            </span>
          </button>
        ))}

        {/* Media Navigation Controls */}
        <button 
          onClick={handlePrevMedia}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={handleNextMedia}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronRight />
        </button>

        {/* Video Controls */}
        {currentMedia.type === 'video' && (
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full"
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        )}
      </div>
    );
  };

  // Render method for product strip
  const renderProductStrip = () => {
    const currentLook = looks[currentLookIndex];
    const currentMedia = currentLook.mediaItems[currentMediaIndex];

    return (
      <div className="p-4 bg-white">
        <div className="flex space-x-4 overflow-x-auto">
          {currentMedia.products.map(product => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-24 cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-24 object-cover rounded-md"
              />
              <div className="mt-2 text-sm">
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
              <button 
                className="mt-2 w-full bg-black text-white py-1 rounded-md flex items-center justify-center"
                onClick={() => handleProductClick(product.id)}
              >
                <ShoppingCart className="mr-2 w-4 h-4" />
                Shop
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
    //   ref={lookbookRef}
      className="max-w-md mx-auto bg-gray-100 min-h-screen"
    >
      {renderMedia()}
      {renderProductStrip()}

      {/* Look Navigation Indicators */}
      <div className="fixed top-1/2 left-0 right-0 z-30 pointer-events-none">
        <div className="flex justify-center space-x-2">
          {looks.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentLookIndex 
                  ? 'bg-black' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LookbookComponent;