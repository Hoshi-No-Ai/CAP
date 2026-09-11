import type { Metadata } from 'next';
import './globals.css';
import { authors, paperTitle, arxivPdfUrl } from '@/lib/publication';
export const metadata: Metadata = {
  metadataBase: new URL('https://hoshi-no-ai.github.io'),
  title: paperTitle,
  authors: authors.map(({ name }) => ({ name })),
  alternates: { canonical: 'https://hoshi-no-ai.github.io/CAP/' },
  description: 'Continuously Adaptive Perception-Blind Humanoid Locomotion via Learned Denoising. A single policy for changing perception, demonstrated on the Unitree G1.',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.svg` },
  robots: { index: true, follow: true },
  other: {
    citation_title: paperTitle,
    citation_author: authors.map(({ name }) => name),
    citation_conference_title: 'Conference on Robot Learning',
    citation_publication_date: '2026',
    citation_pdf_url: arxivPdfUrl,
    citation_arxiv_id: '2609.11553',
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
