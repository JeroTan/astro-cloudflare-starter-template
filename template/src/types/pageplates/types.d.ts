import type { PAGE_TYPE } from "./pages"

export interface BASE_PLATE_PROPS {
  title?: string,
  noHeader?: boolean,
  noFooter?: boolean,
  noContainer?: boolean,
  clean?: boolean,
  expectedHeight?: string,
  prefetch?: string[],
  html?: HTMLAttributes<'html'>,

  descriptor?:{
    type?: PAGE_TYPE,
		title?: string,
		published?: string,
		author?: string,
		authorHandle?: string,
		keywords?: Array<string|number>,
		description?: string,
		thumbnail?: string,
    locale?: string,
    faqData?: Array<{
      id: string,
      question: string,
      answer: string,
    }>
	}
}