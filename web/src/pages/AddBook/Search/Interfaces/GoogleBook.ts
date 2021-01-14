export interface ImageLinks {
    smallThumbnail: string;
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
  }
  
  export interface VolumeInfo {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    pageCount: number;
    categories: string[];
    imageLinks: ImageLinks;
  }
  
  export default interface GoogleBook {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: VolumeInfo;
  }
  