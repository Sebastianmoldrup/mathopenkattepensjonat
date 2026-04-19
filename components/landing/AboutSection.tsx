import Image from 'next/image'

export function AboutSection() {
  return (
    <section className="bg-white px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
        Om oss
      </h2>
      <div className="mx-auto flex max-w-4xl flex-col-reverse items-center gap-8 md:flex-row">
        <div className="prose prose-slate max-w-none">
          <p className="mb-6 text-lg leading-relaxed text-slate-700">
            Vi er Anja Breivik Møldrup og Martin Grindheim Johannessen – et par
            i 30-årene som bor i Mathopen og driver Mathopen Kattepensjonat.
          </p>
          <p className="mb-6 text-lg leading-relaxed text-slate-700">
            Anja har drevet med kattepass siden 2018, og har gjennom flere år
            opparbeidet seg solid erfaring. Vi har et sterkt fokus på hver
            enkelt katt – deres personlighet, trivsel og individuelle behov.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            Behovet for kattepass i fellesferien har over tid vært større enn
            kapasiteten vår. Derfor bygger vi kattepensjonatet for å møte den
            økende etterspørselen etter trygge og gode løsninger for kattepass.
            Vi ønsker å skape et rolig og trygt sted der hver katt blir sett, og
            får et opphold tilpasset sin personlighet, trivsel og behov.
          </p>
        </div>
        <Image
          src="/img/om-oss.webp"
          alt="Anja og Martin, eiere av Mathopen Kattepensjonat"
          width={600}
          height={600}
          className="h-auto w-[150px] rounded-lg md:w-[400px]"
        />
      </div>
    </section>
  )
}
