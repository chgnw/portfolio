import type { SectionKey } from "@/lib/content/registry";
import type { PortfolioView } from "@/lib/content/view";

export interface SectionProps {
  view: PortfolioView;
  goTo: (section: SectionKey) => void;
}
