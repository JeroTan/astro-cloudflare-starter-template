const pageTypes = [
  "Organization","BlogPosting","NewsArticle","Website","WebPage","Article","BreadcrumbList","FAQPage","QAPage","Product","LocalBusiness","Place","Event","Person","CreativeWork","ImageObject","VideoObject","AudioObject","AboutPage","Service"
] as const;

export type PAGE_TYPE = typeof pageTypes[number];