import type { Metadata } from "next";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import { getPublishedDocument } from "@/lib/content/queries";
import { collectIconKeys, resolvePortfolio } from "@/lib/content/view";
import { renderIcons } from "@/lib/icons/server";

/**
 * Production site. Statically rendered from the latest *published* snapshot
 * and regenerated on demand when the owner publishes — visitors get plain
 * pre-built HTML with all content inlined, so there is nothing to load.
 */
export const dynamic = "force-static";
export const revalidate = false;

async function getView() {
  const published = await getPublishedDocument().catch((err) => {
    console.error("Failed to load published content", err);
    return null;
  });
  return published ? resolvePortfolio(published.doc) : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const view = await getView();
  return {
    title: view?.texts.global.metaTitle ?? "Portfolio",
    description: view?.texts.global.metaDescription,
  };
}

export default async function PortfolioPage() {
  const view = await getView();
  if (!view) {
    return (
      <main className="portfolio-bg flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio coming soon</h1>
          <p className="text-foreground/70">Nothing has been published yet.</p>
        </div>
      </main>
    );
  }
  const icons = await renderIcons(collectIconKeys(view));
  return <PortfolioView view={view} icons={icons} enableDashboardShortcut />;
}
