import { readCat } from "@/actions/cat/readCat";
import UpdateCatForm from "@/components/update-cat-form";

export default async function CatUpdateLoader({ catId }: { catId: string }) {
  const cat = await readCat(catId);

  if (!cat) {
    return <div>Katt ikke funnet.</div>;
  }

  return <UpdateCatForm cat={cat} />;
}
