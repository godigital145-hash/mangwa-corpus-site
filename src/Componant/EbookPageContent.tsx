import { useState } from "react";
import EbooksAndMagazines from "./EbooksAndMagazines";
import SectionLibrairie from "./SectionLibrairie";

export default function EbookPageContent() {
  const [activeTab, setActiveTab] = useState<'ebook' | 'magazine'>('ebook');

  return (
    <>
      <EbooksAndMagazines activeTab={activeTab} onTabChange={setActiveTab} />
      <SectionLibrairie type={activeTab} />
    </>
  );
}
