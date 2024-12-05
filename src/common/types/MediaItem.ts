export type MediaItem =  {
    type: "image" | "video";
    src: string;
    alt?: string;
    products?: Product[];
  }
  
export type Product =  {
    id: string;
    name: string;
    price: number;
    x: number;
    y: number;
  }