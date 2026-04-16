import Image from 'next/image'
const BookingUnderDevelopment = () => {
  return (
    <div className="mx-auto max-w-xl items-center justify-center gap-12 px-4 py-16 text-center lg:flex">
      <Image
        src="/illustration/reserve-spots.webp"
        alt="Under development"
        width={200}
        height={200}
        className="mx-auto mb-6 rounded-md"
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Bookingen er nå åpen</h2>

        <p className="text-lg text-gray-600">
          Vi opplever stor pågang for juli og er allerede nær fullbooket. Dersom
          ønskelig, kan vi sette deg på venteliste.
        </p>

        <p className="text-lg text-gray-600">
          Erfaringsmessig skjer det en del endringer frem mot sommeren, så det
          er gode muligheter for at vi kan tilby plass til flere etter hvert.
        </p>

        <p className="text-lg text-gray-600">
          Ta gjerne kontakt på e-post hvis du ønsker å stå på venteliste eller
          har spørsmål!
        </p>
        <a
          href="mailto:post@mathopenkattepensjonat.no"
          className="mb-4 mt-1 block font-medium text-blue-600 hover:underline"
        >
          post@mathopenkattepensjonat.no
        </a>
      </div>
    </div>
  )
}

export default BookingUnderDevelopment
