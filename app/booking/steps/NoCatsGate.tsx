import Link from "next/link";
import { Button } from "@/components/ui/button";

const NoCatsGate = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">No Cats Found</h2>
      <p className="text-gray-600">
        Du har ingen katter registrert. For å kunne booke en tjeneste, må du
        først legge til en katt i profilen din.
      </p>

      <Link href="/profile" className="text-blue-500 hover:underline">
        <Button>Gå til mine katter</Button>
      </Link>
    </div>
  );
};

export default NoCatsGate;
