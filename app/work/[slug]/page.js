import { notFound } from 'next/navigation';
import { work } from '@/lib/content';
import OptionsCase from '@/components/case/OptionsCase';
import StrategyCase from '@/components/case/StrategyCase';
import VoltexCase from '@/components/case/VoltexCase';

const CASES = {
  'options-engine': OptionsCase,
  'strategy-search': StrategyCase,
  voltex: VoltexCase,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = work.find((w) => w.slug === slug);
  if (!project) return {};
  return {
    title: project.fullTitle,
    description: project.summary,
    openGraph: { title: project.fullTitle, description: project.summary },
  };
}

export default async function CasePage({ params }) {
  const { slug } = await params;
  const project = work.find((w) => w.slug === slug);
  const Case = CASES[slug];
  if (!project || !Case) notFound();
  return <Case project={project} />;
}
