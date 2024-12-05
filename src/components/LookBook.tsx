import { useEffect, useRef, useState } from "react";
import { 
    ChevronLeft, 
    ChevronRight, 
    Volume2, 
    VolumeX, 
    ShoppingCart, 
    ChevronUp,
    ChevronDown
  } from 'lucide-react';
  interface MediaItem {
    type: "image" | "video";
    src: string;
    alt?: string;
    products?: Product[];
  }
interface LookbookProps {
    items: MediaItem[];
  }
  interface Product {
    id: string;
    name: string;
    price: number;
    x: number;
    y: number;
  }
export const LookBook:React.FC<LookbookProps> = ({items}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
        // Reset progress
        setProgress(0);
    
        // Clear any existing timer
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
    
        // Start new timer for images
        if (items[currentIndex].type === 'image') {
          progressTimerRef.current = setInterval(() => {
            setProgress(prev => {
              if (prev >= 100) {
                // Move to next media
                handleNextItem();
                return 0;
              }
              return prev + 2; // Adjust to complete in 5 seconds
            });
          }, 50);
        }
    
        // Cleanup timer on unmount or change
        return () => {
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
          }
        };
      }, [currentIndex]);
    
    useEffect(() => {
      setProgress(0);
        if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
  
      // Start new timer for images
      if (items[currentIndex].type === 'image') {
        progressTimerRef.current = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              // Move to next media
              handleNextItem();
              return 0;
            }
            return prev + 2; // Adjust to complete in 5 seconds
          });
        }, 50);
      }
  
      // Cleanup timer on unmount or change
      return () => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
      };
    }, [currentIndex]);
  
    // Handle video and mute/unmute
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.muted = isVideoMuted;
      }
    }, [isVideoMuted]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'up' | 'down') => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const scrollAmount = direction === 'down' 
          ? containerHeight 
          : -containerHeight;
        
        containerRef.current.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
  
        // Update current index
        setCurrentIndex(prev => 
          direction === 'down'
            ? Math.min(prev + 1, items.length - 1)
            : Math.max(prev - 1, 0)
        );
      }
    };
    const handleNextItem = () => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    };
  
    const handlePrevItem = () => {
      setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    };
  
    const handleProductClick = (e: React.MouseEvent, product: Product) => {
    //   e.stopPropagation();
      // Placeholder for product navigation
    //   alert(`Navigating to product: ${product.name}`);
    };
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


    return <div className="relative w-full h-screen overflow-hidden">
    {/* Vertical Scrolling Container */}
    <div 
      ref={containerRef}
      className="w-full h-full overflow-y-scroll scroll-smooth no-scrollbar"
      style={{ 
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {items.map((item, index) => (
        <div 
          key={index}
          className="w-full h-full flex-shrink-0 relative"
          style={{ 
            scrollSnapAlign: 'start',
            height: '100vh',
            position: 'relative'
          }}
        >
          {/* Media Rendering */}
          {item.type === 'image' ? (
            <div className="relative w-full h-full">
              <img
                src={item.src}
                alt={item.alt || `Lookbook item ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Product Annotations */}
              {item.products?.map((product) => (
                <button
                  key={product.id}
                  className="absolute bg-white/70 rounded-full px-3 py-1 text-xs transform -translate-x-1/2 -translate-y-1/2 hover:bg-white flex items-center"
                  style={{ 
                    left: `${product.x}%`, 
                    top: `${product.y}%` 
                  }}
                  onClick={(e) => handleProductClick(e, product)}
                >
                  <ShoppingCart className="mr-1 w-4 h-4" />
                  {product.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                src={item.src}
                autoPlay
                loop
                muted={isVideoMuted}
                className="w-full h-full object-cover"
              />
              
              {/* Mute Toggle for Videos */}
              <button 
                className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2"
                onClick={() => setIsVideoMuted(!isVideoMuted)}
              >
                {isVideoMuted ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
    {/* {renderProductStrip()} */}
    {/* Navigation Controls */}
    {currentIndex > 0 && (
      <button 
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full p-2 z-50"
        onClick={() => handleScroll('up')}
      >
        <ChevronUp className="text-white" />
      </button>
    )}
    
    {currentIndex < items.length - 1 && (
      <button 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full p-2 z-50"
        onClick={() => handleScroll('down')}
      >
        <ChevronDown className="text-white" />
      </button>
    )}

    {/* Current Position Indicator */}
    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full z-50">
      {currentIndex + 1} / {items.length}
    </div>
  </div>

    // <div className="relative w-full max-w-md mx-auto h-[70vh] flex flex-col">
    //   {/* Progress Bar */}
    //   <div className="absolute top-2 left-0 right-0 z-20 flex space-x-1 px-2">
    //     {items.map((_, index) => (
    //       <div 
    //         key={index} 
    //         className={`flex-1 h-1 ${
    //           index === currentIndex 
    //             ? `bg-white` 
    //             : `bg-white/50`
    //         }`}
    //       >
    //         {index === currentIndex && (
    //           <div 
    //             className="h-full bg-white" 
    //             style={{ width: `${progress}%` }}
    //           />
    //         )}
    //       </div>
    //     ))}
    //   </div>

    //   <div className="relative flex-grow overflow-hidden">
    //     {items[currentIndex].type === 'image' ? (
    //       <div className="relative w-full h-full">
    //         <img
    //           src={items[currentIndex].src}
    //           alt={items[currentIndex].alt || `Lookbook item ${currentIndex + 1}`}
    //           className="w-full h-full object-cover"
    //         />
            
    //         {/* Product Annotations for Images */}
    //         {items[currentIndex].products?.map((product) => (
    //         <a href="https://www.amazon.in/Regal-Square-Dotted-Weight-Oxford/dp/B0D5QRB1H7">
    //           <button
    //             key={product.id}
    //             className="absolute bg-white/70 rounded-full px-3 py-1 text-xs transform -translate-x-1/2 -translate-y-1/2 hover:bg-white flex items-center"
    //             style={{ 
    //               left: `${product.x}%`, 
    //               top: `${product.y}%` 
    //             }}
    //             onClick={(e) => handleProductClick(e, product)}
    //           >
    //             <ShoppingCart className="mr-1 w-4 h-4" />
    //             {product.name}{" "}{product.price}
    //           </button>
    //           </a>
    //         ))}
    //       </div>
    //     ) : (
    //       <div className="relative w-full h-full">
    //         <video
    //           ref={videoRef}
    //           src={items[currentIndex].src}
    //           autoPlay
    //           loop
    //           className="w-full h-full object-cover"
    //         />
            
    //         {/* Mute Toggle for Videos */}
    //         <button 
    //           className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2"
    //           onClick={() => setIsVideoMuted(!isVideoMuted)}
    //         >
    //           {isVideoMuted ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
    //         </button>
    //       </div>
    //     )}
    //      <button 
    //       className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
    //       onClick={handlePrevItem}
    //     >
    //       <ChevronLeft className="text-white" />
    //     </button>
    //     <button 
    //       className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
    //       onClick={handleNextItem}
    //     >
    //       <ChevronRight className="text-white" />
    //     </button>
    //   </div>

    //   {/* Look Navigation */}
    //   <div className="flex justify-center items-center space-x-4 p-4">
    //     <div className="text-sm text-gray-600">
    //       {currentIndex + 1} / {items.length}
    //     </div>
    //   </div>
    // </div>
        {/* {items.map((item, index) => (
        <div 
            key={index} 
            className={`flex-1 h-1 ${
            index === currentIndex 
                ? `bg-white` 
                : `bg-white/50`
            }`}
        >
          {item.type === "image" ? (
            <img
              src={item.src}
              alt={item.alt || `Lookbook item ${index + 1}`}
              style={{ width: `${progress}%` }}
              className="h-full bg-white"
            />
          ) : (
            <video
              controls
              className="w-72 h-48 object-cover p-5"
            >
              <source src={item.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ))} */}

      

}






