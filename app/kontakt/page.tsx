const Page = () => {
  return (
    <div className="min-h-screen flex flex-wrap gap-20 items-center justify-center bg-gray-50 px-4">
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

      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1974.280566762042!2d5.197349599999999!3d60.3414794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x463cfb20aa03571f%3A0xab25d05e5ad4b0fe!2sStoringavika%202%2C%205174%20Mathopen!5e0!3m2!1sen!2sno!4v1770599414252!5m2!1sen!2sno"
          width="600"
          height="450"
          style={{
            border: 0,
            borderRadius: "1rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Page;
