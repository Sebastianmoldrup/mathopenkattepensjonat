"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cat } from "@/types";
import { Button } from "@/components/ui/button";
import { DeleteCatButton } from "./deleteCatButton";

function RenderCat({ cat }: { cat: Cat }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          {cat.image_url ? (
            <img
              src={cat.image_url}
              alt={cat.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500">
              Ingen bilde
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold">{cat.name}</h3>
          <p className="text-sm text-gray-600">Alder: {cat.age} år</p>
          <p className="text-sm text-gray-600">Rase: {cat.breed}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/minside/minekatter/${cat.id}`}>
          <Button variant="outline" size="sm">
            Rediger
          </Button>
        </Link>

        <DeleteCatButton catId={cat.id} />
      </div>
    </div>
  );
}

export function CatsListClient({ cats }: { cats: Cat[] }) {
  const router = useRouter();

  return (
    <div className="space-y-8 container mx-auto max-w-lg">
      <Button
        className="mb-4 w-full"
        onClick={() => router.push("/minside/minekatter/legg-til")}
      >
        Legg til katt
      </Button>

      {cats.length === 0 ? (
        <div>Du har ingen katter registrert.</div>
      ) : (
        <ul>
          {cats.map((cat) => (
            <li key={cat.id} className="mb-4 rounded-lg border p-4 mx-auto">
              <RenderCat cat={cat} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
