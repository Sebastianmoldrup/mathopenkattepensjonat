"use client";
import React from "react";
import { Cat, User } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import { readUser } from "@/lib/supabase/utils";
// import { readCatBucket } from "@/actions/cat/readCatBucket";
// import { createClient } from "@/lib/supabase/client";
import { getUserId } from "@/actions/user/getUserId";
import { getUserCats } from "@/actions/user/getUserCats";

const RenderCat = ({ index, cat }: { index: string; cat: Cat }) => {
  // console.log("Rendering cat:", cat);
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
            <div className="flex h-full w-full items-center text-center justify-center text-gray-500">
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
      <div>
        <Link
          href={{
            pathname: `/minside/minekatter/${cat.id}`,
            query: { catId: cat.id },
          }}
        >
          <Button variant="outline" size="sm">
            Rediger
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="ml-2">
          Slett
        </Button>
      </div>
    </div>
  );
};

const Page = () => {
  // const [user, setUser] = React.useState<User | null>(null);
  // const [cats, setCats] = React.useState<Cat | Cat[]>([]);
  // const [catImage, setCatImage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [cats, setCats] = React.useState<Cat[]>([]);

  React.useEffect(() => {
    const fetchUserAndCats = async () => {
      const userId = await getUserId();
      if (!userId) {
        // setUser(null);
        setLoading(false);
        return;
      }

      const userCats = await getUserCats(userId);
      console.log("Fetched cats:", userCats);

      setCats(userCats);
      console.log("Cats with images:", userCats);
      setLoading(false);
    };

    fetchUserAndCats();
  }, []);

  if (loading) {
    return <div>Laster...</div>;
  }

  return (
    <div className="container mx-auto max-w-lg">
      <Link
        href="/minside/minekatter/legg-til"
        className="mb-4 inline-block w-full"
      >
        <Button className="w-full py-6">Legg til katt</Button>
      </Link>
      {/* UI Cat list */}
      {cats.length === 0 ? (
        <div>Du har ingen katter registrert.</div>
      ) : (
        <ul className="">
          {cats.map((cat: Cat, index: number) => {
            return (
              <li key={index} className="mb-4 rounded-lg border p-4 mx-auto">
                <RenderCat index={cat.id} cat={cat} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default Page;
