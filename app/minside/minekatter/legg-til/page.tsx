import AddCatForm from "@/components/add-cat-form";

// Raises the server-action timeout for this route (createCat, called on
// submit) past the platform default -- a customer on a slow upload
// connection could otherwise have the whole request killed mid-upload
// with a raw platform error instead of one of our own messages. Only
// takes effect up to whatever the hosting plan allows; see the
// 2026-10-18 FIXLOG entry.
export const maxDuration = 60;

export default function Page() {
  return (
    <div className="mx-auto max-w-xl p-4">
      <AddCatForm />
    </div>
  );
}
