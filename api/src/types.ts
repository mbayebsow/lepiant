export interface Feed {
  id: string | number;
  title: string;
  link: string;
  published: Date;
  description: string;
}

export interface CronLog {
  date: Date;
  message: any;
}

export interface OtpCodeType {
  status: string;
  code: string;
}

export interface LiveNews {
  search_metadata: SearchMetadata;
  search_parameters: SearchParameters;
  top_stories_link: TopStoriesLink;
  news_results: NewsResult[];
  menu_links: MenuLink[];
}

export interface MenuLink {
  title: string;
  topic_token: string;
  serpapi_link: string;
}

export interface NewsResult {
  position: number;
  highlight?: Highlight;
  stories?: NewsResult[];
  story_token: string;
  serpapi_link: string;
  title?: string;
  source?: Source;
  link?: string;
  thumbnail?: string;
  date?: string;
}

export interface Highlight {
  title: string;
  source: Source;
  link: string;
  thumbnail: string;
  date: string;
}

export interface Source {
  name: string;
  icon: string;
  authors?: string[];
}

export interface SearchMetadata {
  id: string;
  status: string;
  json_endpoint: string;
  created_at: string;
  processed_at: string;
  google_news_url: string;
  raw_html_file: string;
  total_time_taken: number;
}

export interface SearchParameters {
  engine: string;
  gl: string;
}

export interface TopStoriesLink {
  topic_token: string;
  serpapi_link: string;
}

export interface NewsResponse {
  title: string;
  source: Source;
  link: string;
  thumbnail: string;
  date: string;
}
