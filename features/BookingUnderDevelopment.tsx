import Image from "next/image";
const BookingUnderDevelopment = () => {
  return (
    <div className="lg:flex items-center justify-center max-w-xl mx-auto px-4 py-16 gap-12 text-center">
      <Image
        src="/illustration/reserve-spots.webp"
        alt="Under development"
        width={200}
        height={200}
        className="mb-6 rounded-md mx-auto"
      />
      <div>
        <h2 className="text-2xl font-bold mb-4">Booking kommer snart</h2>
        <p className="text-lg text-gray-600">
          Bookingsystemet er fortsatt under utvikling.
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Dersom du ønsker å reservere plass for opphold etter 1. juli, kan du
          gjerne sende oss en e-post på:
        </p>
        <a
          href="mailto:post@mathopenkattepensjonat.no"
          className="text-blue-600 hover:underline mt-2 block"
        >
          post@mathopenkattepensjonat.no
        </a>
      </div>
    </div>
  );
};

export default BookingUnderDevelopment;
