// import Image from "next/image";

import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* WIP */}
      <section className="w-full flex flex-col justify-center items-center gap-8 mt-28">
        <Image
          src="/img/wip.png"
          width={300}
          height={300}
          alt="Picture of the author"
        />
        <h1 className="text-2xl font-test font-semibold text-center">
          Under konstruksjon - Lanseres 2026!
        </h1>
      </section>
    </main>
  );
}
