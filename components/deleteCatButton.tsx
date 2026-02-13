"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteCat } from "@/actions/cat/deleteCat";

export function DeleteCatButton({ catId }: { catId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("catId", catId);
      await deleteCat(formData);
      router.refresh();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Sletter..." : "Slett"}
    </Button>
  );
}
