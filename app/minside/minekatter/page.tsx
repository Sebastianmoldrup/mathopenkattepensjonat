"use client";
import React from "react";
import { getCatPhoto, readUser } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/client";
import { Cat, User } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

const getUserId = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    console.error("Error getting user claims:", error.message);
    return null;
  }
  return data?.claims.sub || null;
};

const getUserCats = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("owner_id", userId);

  if (error) {
    console.error("Error fetching cats:", error.message);
    return [];
  }

  return data || [];
};

const Page = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [cats, setCats] = React.useState<Cat[]>([]);
  const [catImage, setCatImage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      const userId = await getUserId();
      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      const user = await readUser(userId);
      const userCats = await getUserCats(userId);
      const catImage = await getCatPhoto(userCats[0]?.photo_path || "");
      setCatImage(catImage);
      setUser(user);
      setCats(userCats);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Laster...</div>;
  }

  return (
    <div>
      <Link
        href="/minside/minekatter/legg-til"
        className="mb-4 inline-block w-full"
      >
        <Button className="w-full py-4">Legg til katt</Button>
      </Link>
      {/* UI Cat list */}
      {cats.length === 0 ? (
        <div>Du har ingen katter registrert.</div>
      ) : (
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between mb-2 p-4 border rounded"
            >
              <div>
                <h3 className="font-bold">{cat.name}</h3>
                <p>Rase: {cat.breed}</p>
                <p>Alder: {cat.age} år</p>
                <Link href={`/minside/minekatter/${cat.id}`} passHref>
                  <Button variant="outline" size="sm" className="mt-2">
                    Rediger
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="mt-2 ml-2">
                  Slett
                </Button>
              </div>
              <div>
                <Image
                  src={catImage || "/placeholder-cat.png"}
                  alt={cat.name}
                  width={200}
                  height={200}
                  className="object-cover rounded w-24 h-24"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Page;
