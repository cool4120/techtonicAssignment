import './App.css'
import { LookBook } from './components/LookBook'
import image1 from './assets/clothImage1.jpg'
import image2 from './assets/clothImage2.jpg'
import image3 from './assets/clothImage3.jpg'
import image4 from './assets/clothImage4.jpg'
import vid1 from './assets/sampleVideo.mp4'
import { MediaItem } from './common/types/MediaItem'
import LookbookComponent from './components/LookBookNew'

function App() {
  const sampleItems: MediaItem[] = [
    {
      type: "image",
      src: image1,
      alt: "Baggy Fashion Look",
      products: [
        { 
          id: "p1", 
          name: "Biege Shirt", 
          price: 49.99, 
          x: 50, 
          y: 40 
        },
        { 
          id: "p2", 
          name: "White Pants", 
          price: 79.99, 
          x: 55, 
          y: 56 
        }
      ]
    },
    {
      type: "image",
      src: image2,
      alt: "Winter Fashion Look",
      products: [
        { 
          id: "p1", 
          name: "Pink Coat", 
          price: 99.99, 
          x: 50, 
          y: 40 
        },
      ]
    },
    {
      type: "video",
      src: vid1,
      alt: "Runway Walk",
      products: [
        { 
          id: "p1", 
          name: " OverCoat", 
          price: 299.99, 
          x: 50, 
          y: 40 
        },
      ]
    }
  ];
  return (
    <>  
      <div className='flex min-h-screen items-center self-center bg-gray-100 '>
        <div className='flex-col	items-center justify-center bg-gray-100'>
          <h1 className='text-gray-600'>TecTonic Assign</h1>
          {/* <LookBook items={sampleItems}/> */}
          <LookbookComponent/>
        </div>
      </div>
    </>
  )
}

export default App
 