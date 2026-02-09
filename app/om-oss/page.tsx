import Image from "next/image";

const Page = () => {
  return (
    <div className="min-h-screen p-4 space-y-10 mt-10">
      <h1 className="text-2xl text-center font-semibold text-gray-900 mb-2">
        Om oss
      </h1>
      <div className="xl:flex items-center justify-center bg-gray-50 gap-4">
        <Image
          src="/img/om-oss.webp"
          alt="hei"
          width={600}
          height={600}
          className="w-[300px] md:w-[500px] h-auto rounded-lg mx-auto my-8"
        />

        <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-xl p-6 shadow-sm mx-auto">
          <p className="text-gray-600 mb-6">
            Vi er Anja Breivik Møldrup og Martin Grindheim Johannessen – et par
            i 30-årene som bor i hjertet av Mathopen og driver Mathopen
            Kattepensjonat. Begge er utdannede ingeniører, men vi har også en
            stor felles lidenskap: å skape et trygt, rolig og omsorgsfullt sted
            for katter.
          </p>

          <p className="text-gray-600 mb-6">
            Anja har hatt katt som en naturlig del av livet sitt helt siden
            barndommen. Da hennes egen katt gikk bort i 2018, ønsket hun
            fortsatt å ha katter rundt seg – og slik startet hun med kattepass i
            eget hjem. Siden den gang har hun hatt gleden av å bli kjent med og
            ta vare på mange ulike katter, alle med sine egne personligheter og
            behov. Med over syv års erfaring innen kattepass har Anja
            opparbeidet seg en trygg og omsorgsfull tilnærming til katter i alle
            livsfaser. Hun har god forståelse for katteadferd, daglig stell og
            stresshåndtering, og har særlig hjerte for katter som trenger litt
            ekstra omtanke.
          </p>

          <p className="text-gray-600 mb-6">
            Martin ble en del av driften i 2022, og har siden hatt stor glede av
            å bidra til at kattene får et trygt og godt opphold.
          </p>

          <div className="h-px bg-gray-200 my-6" />

          <p className="text-gray-600 mb-6">
            Behovet for kattepass i fellesferien har alltid vært større enn
            kapasiteten vår, og derfor bestemte vi oss for å etablere et
            fullverdig – og luksuriøst – kattepensjonat. Målet vårt er å skape
            et lite paradis for kattene, der de får masse tilsyn, omsorg og
            oppmerksomhet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
