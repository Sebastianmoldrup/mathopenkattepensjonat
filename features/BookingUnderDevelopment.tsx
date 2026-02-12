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
        <h2 className="text-2xl font-bold mb-4">Booking åpner snart</h2>

        <p className="text-lg text-gray-600">
          Vårt nye bookingsystem er for tiden under utvikling.
        </p>

        <p className="text-lg text-gray-600 mt-4">
          Ønsker du å reservere plass for opphold etter 1. juli? Send oss gjerne
          en e-post, så hjelper vi deg manuelt i mellomtiden.
        </p>

        <a
          href="mailto:post@mathopenkattepensjonat.no"
          className="text-blue-600 hover:underline mt-1 mb-4 block font-medium"
        >
          post@mathopenkattepensjonat.no
        </a>

        <p className="text-lg text-gray-600 mt-6">
          Du kan allerede nå opprette en profil med nødvendig informasjon om deg
          som eier og katten(e) dine, slik at alt er klart når bookingsystemet
          lanseres.
        </p>
      </div>
    </div>
  );
};

export default BookingUnderDevelopment;
