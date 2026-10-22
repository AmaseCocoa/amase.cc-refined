export const navigation = [
  { id: 'home', url: '/', label: 'Home' },
  { id: 'skills', url: '/skills/', label: 'Skills' },
  { id: 'works', url: '/works/', label: 'Works' },
  { id: 'timeline', url: '/timeline/', label: 'Timeline' },
] as const;

export type Page = (typeof navigation)[number]['id'];

export const descriptions: Record<Page, string> = {
  home: '多分色々なことをしています！',
  skills: '実はこんなことができます',
  works: '作ったものがあるのかも',
  timeline: '学歴や、つくってきたものなど。',
};
