import { readCat } from "@/actions/cat/readCat";
import UpdateCatForm from "./update-cat-form";
import { getCatPhoto } from "@/lib/supabase/utils";

const CatUpdateLoader = async ({ catId }: { catId: string }) => {
  const cat = await readCat(catId);
  const catPhoto = await getCatPhoto(cat.photo_path);

  if (!cat) {
    return <div>Katt ikke funnet.</div>;
  }

  return <UpdateCatForm cat={cat} photoUrl={catPhoto} />;
};
export default CatUpdateLoader;
