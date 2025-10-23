import { readResearchCatalogue } from "@/server/data/researchStore";

import { CreateOngoingForm } from "./CreateOngoingForm";
import { CreatePreprintForm } from "./CreatePreprintForm";
import { CreatePublishedForm } from "./CreatePublishedForm";
import { OngoingTable } from "./OngoingTable";
import { PreprintTable } from "./PreprintTable";
import { PublishedTable } from "./PublishedTable";

export default async function AdminResearchPage() {
  const catalogue = await readResearchCatalogue();

  return (
    <div className="space-y-8 text-white">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold">Research Library</h1>
        <p className="text-sm text-white/70">Maintain the canonical corpus of publications, preprints, and ongoing explorations.</p>
      </header>

      <div className="space-y-6">
        <CreatePublishedForm />
        <PublishedTable entries={catalogue.published} />
      </div>

      <div className="space-y-6">
        <CreatePreprintForm />
        <PreprintTable entries={catalogue.preprints} />
      </div>

      <div className="space-y-6">
        <CreateOngoingForm />
        <OngoingTable entries={catalogue.ongoing} />
      </div>
    </div>
  );
}
