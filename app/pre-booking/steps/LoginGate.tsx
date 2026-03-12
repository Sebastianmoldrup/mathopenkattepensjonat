import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginGate = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Vennlgist log inn for å fortsette
      </h2>

      <Link href="/login">
        <Button>Logg inn</Button>
      </Link>
    </div>
  );
};

export default LoginGate;
