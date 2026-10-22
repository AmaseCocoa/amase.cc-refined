export interface TimelineEntry {
  date: string;
  endDate?: string;
  kind: '制作' | '学歴' | '活動';
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}

export const timeline: TimelineEntry[] = [
  {
    date: '2026-04',
    endDate: '2029-03',
    kind: '学歴',
    title: 'S高等学校',
  },
  {
    date: '2026-07',
    kind: '制作',
    title: 'ブログ用のAstroテーマをOSSに',
    description: '自分のブログのために書いたテーマを公開しました。',
    href: 'https://tw.amase.cc/articles/2026-07-27-自分のブログのためにastroテーマを書いてoss化した/',
    linkLabel: '制作についての記事',
  },
  {
    date: '2026-08',
    kind: '制作',
    title: 'anylink',
    description: 'Cloudflare Workersを活用したリンク共有サービス。',
    href: 'https://anylink.amase.cc',
    linkLabel: 'サイトを見る',
  },
];
