import Link from "next/link";

const LoginGate = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">
        Du må logge inn for å fortsette
      </h1>
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Logg inn
      </Link>
    </div>
  );
};

export default LoginGate;
