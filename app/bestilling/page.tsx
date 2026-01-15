import { Suspense } from "react";

// BOOKING FLOW
// 0. Introduksjon:
//  ~ La oss finne den perfekte katteløsningen for deg. Dette tar bare noen få minutter.
//  ~ Vi passer katten(e) dine i trygge og koselige bur, med daglig tilsyn, lek og stell. La oss gjøre bestillingen enkel og rask – dette tar bare noen minutter.
// 1. Hvor mange katter skal bo hos oss?
//  ~ Velg antall katter
// 2. Når skal katten(e) bo hos oss?
//  ~ Velg hele perioden katten(e) skal være hos oss. Vi sørger for at de får mat, vann, renset toalett og tid til lek hver dag.
// 3. Fortell oss om katten(e)
//  ~ Jo mer vi vet, desto bedre kan vi gjøre oppholdet trygt og koselig.
// 4. Dine opplysninger
//  ~ Dette bruker vi kun for å kontakte deg angående bestillingen.
// 5. Sjekk bestillingen din
//  ~ Her ser du en oppsummering av opplysningene dine. Du kan gå tilbake for å gjøre endringer.
//  ~ Når du bekrefter vil Anja gå gjennom detaljene og kontakte deg med mer informasjon.
// 6. Tusen takk!
//  ~ Bestillingen er registrert og du vil bli kontaktet snart! Vi gleder oss til å passe katten(e) dine og gi dem et trygt og koselig opphold.

async function BookingData() {}

const Page = () => {
  return (
    <main className="w-full h-screen grid place-content-center">
      <Suspense fallback={<div>Laster...</div>}>Bestilling</Suspense>
    </main>
  );
};

export default Page;
