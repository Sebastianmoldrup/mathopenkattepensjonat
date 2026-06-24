import { createClient } from "@/lib/supabase/server";
import { getUserCats } from "@/actions/cat/getUserCats";
import { CatsListClient } from "@/components/cats-list-client";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const cats = await getUserCats(user.id);

  return <CatsListClient cats={cats} />;
}
