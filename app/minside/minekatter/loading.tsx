import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <Spinner className="size-6" />
      Laster katter…
    </div>
  );
}
