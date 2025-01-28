import { Article, Channel, Quotidien } from "./interfaces";

export type ChannelsNavigateParams = {
  Chaines: undefined;
};

export type RootLogin = {
  Login: undefined;
};

export type ChannelNavigateParams = {
  Chaine: { channel: Channel } | undefined;
};

export type ArticleNavigateParams = {
  Article: { channel: Channel | undefined; article: Article };
};

export type QuotidienNavigateParams = {
  Quotidien: { quotidiens: Quotidien[]; activeIndex: number };
};
