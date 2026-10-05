import { getUniversities } from "@/services/university.service";
import UniversitiesManager from "@/components/cms/universities/UniversitiesManager";

export default async function UniversitiesPage() {
  const universities = await getUniversities();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-950">Universities</h1>

        <p className="mt-1 text-sm text-zinc-500">
          Manage universities displayed on the Maitri Global Education website.
        </p>
      </div>

      <UniversitiesManager universities={universities} />
    </div>
  );
}
