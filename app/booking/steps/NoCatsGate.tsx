import Link from "next/link";

const NoCatsGate = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Ingen katter funnet</h2>
      <p>Du må legge til minst én katt i profilen din for å kunne booke.</p>
      <Link
        href="/minside/minekatter"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Legg til katt
      </Link>
    </div>
  );
};

export default NoCatsGate;
