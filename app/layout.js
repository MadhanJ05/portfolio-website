import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { site } from '@/lib/content';
import './globals.css';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const title = 'Madhan Jothimani: Quantitative Finance & Machine Learning';

export const metadata = {
  // Set NEXT_PUBLIC_SITE_URL once a custom domain is live; on Vercel the
  // production URL is used automatically until then.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: { default: title, template: '%s · Madhan Jothimani' },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description: site.description,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title, description: site.description },
};

export const viewport = {
  themeColor: '#09090a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="wrap footer__inner">
            <span>© 2026 {site.name} · {site.location}</span>
            <span>Charts are drawn from the published results in each project’s repo.</span>
          </div>
        </footer>
        <Reveal />
      </body>
    </html>
  );
}
