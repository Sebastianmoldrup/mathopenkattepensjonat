const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Kontakt oss
        </h1>

        <p className="text-gray-600 mb-6">
          Har du spørsmål eller trenger hjelp? Ta gjerne kontakt med oss via
          e-post på{" "}
          <a
            href="mailto:anja.moldrup@hotmail.no"
            className="text-blue-600 hover:underline"
          >
            Vår mail
          </a>
          .
        </p>

        <div className="h-px bg-gray-200 my-6" />

        <p className="text-sm text-gray-500">Vi ser frem til å høre fra deg!</p>
      </div>
    </div>
  );
};

export default Page;
