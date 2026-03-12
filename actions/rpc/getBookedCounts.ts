"use server";

import { createClient } from "@/lib/supabase/server";

export async function getBookedCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_booked_counts_from_today");

  if (error || !data) return {};

  return Object.fromEntries(
    data.map((row: { date: string; cat_count: number }) => [
      row.date,
      row.cat_count,
    ]),
  );
}
