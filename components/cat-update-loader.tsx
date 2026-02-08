import { readCat } from "@/actions/cat/readCat";
import UpdateCatForm from "./update-cat-form";

const CatUpdateLoader = async ({ catId }: { catId: string }) => {
  const cat = await readCat(catId);

  if (!cat) {
    return <div>Katt ikke funnet.</div>;
  }

  return <UpdateCatForm cat={cat} />;
};
export default CatUpdateLoader;
