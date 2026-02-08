import CatUpdateLoader from "@/components/cat-update-loader";

export default async function Page({
  params,
}: {
  params: Promise<{ catId: string }>;
}) {
  const { catId } = await params;

  return <CatUpdateLoader catId={catId} />;
}
