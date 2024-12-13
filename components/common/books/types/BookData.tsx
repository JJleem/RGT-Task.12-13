export interface VolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  imageLinks?: {
    thumbnail: string;
  };
}

export interface GoogleBooksApiResponse {
  items: {
    volumeInfo: VolumeInfo;
  }[];
}
