import { createClient } from "@/lib/supabase/server";
import { getBookedCounts } from "@/actions/rpc/getBookedCounts";
// import { getUserCats } from "@/actions/cats/getUserCats";
import { getUserCats } from "@/actions/cat/getUserCats";
import LoginGate from "./steps/LoginGate";
import NoCatsGate from "./steps/NoCatsGate";
import BookingWizard from "./BookingWizard";

export default async function BookingGate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <LoginGate />;

  const cats = await getUserCats(user.id);
  const bookedCounts = await getBookedCounts();

  if (!cats || cats.length === 0) return <NoCatsGate />;

  return <BookingWizard user={user} cats={cats} bookedCounts={bookedCounts} />;
}
