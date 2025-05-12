import Insights from './index';

declare global {
  namespace NodeJS {
    interface Global {
      insights: Insights;
    }
  }
}

export {};
