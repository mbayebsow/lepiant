export interface User {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  language: string;
  country: string;
  defaultStartedPage: string;
  allowNotifications: boolean;
  defaultArticleCategorie: number;
  categorie: { id: number; name: string };
  // channelsSubscribed: SubscribedChannel[];
  // articlesSaved: ArticleSaved[];
  // radiosLiked: [];
}

export interface Article {
  id: number;
  categorieId: number;
  channelId: number;
  title: string;
  image: string;
  description: string;
  link: string;
  saved?: boolean;
  published: Date;
}

export interface ArticleContent {
  url: string;
  title: string;
  description: string;
  links: string[];
  image: string;
  content: string;
  author: string;
  favicon: string;
  source: string;
  published: Date;
  ttr: number;
}

export interface ArticleCategory {
  id: number;
  name: string;
}

export interface ArticleSaved {
  id: number;
  articleId: number;
  article: Article;
}

export interface Channel {
  id: number;
  name: string;
  logo: string;
  fullLogo: string;
  webSite: string;
  country: string;
  language: string;
  sources: {
    categorieId: number;
  }[];
  isSubscribed?: boolean;
}

export interface SubscribedChannel {
  id: number;
  channelId: number;
}

export interface Radio {
  id: number;
  name: string;
  source: string;
  image: string;
  liked: boolean;
  isActive: boolean;
  // categorieId: number;
  categorie: {
    id: number;
    name: string;
  };
}

export interface RadioCategory {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RadioLiked {
  id: number;
  radioId: number;
}

export interface Quotidien {
  id: number;
  images: string;
  thumbnailUrl: string;
  publishedAt: string;
  createdAt: Date;
}

export interface Revues {
  id: number;
  name: string;
  audio: string;
  publishedAt: string;
  createdAt: Date;
}

export interface StorageIterface<T> {
  addedTime: Date;
  createdTime: Date;
  data: T;
}

export interface SuccessLogin {
  success: boolean;
  message: string;
}

export interface SuccessVerify {
  success: boolean;
  session: string;
}

export interface AverageColor {
  success: boolean;
  color?: {
    value: number[];
    rgb: string;
    rgba: string;
    hex: string;
    hexa: string;
    isDark: boolean;
    isLight: boolean;
  };
  message?: string;
}

// export interface TopNewsInterface {
//   title: string;
//   source: {
//     name: string;
//     icon: string;
//     authors?: string[];
//   };
//   link: string;
//   thumbnail: string;
//   date: string;
// }
