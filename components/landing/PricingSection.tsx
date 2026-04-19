import { Card, CardContent } from '@/components/ui/card'

export function PricingSection() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
          Priser
        </h2>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Priser */}
              <div>
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-5">
                    <p className="mb-4 text-sm font-medium text-slate-500">
                      Lavsesong
                    </p>
                    <div className="space-y-2 text-sm text-slate-700">
                      {[
                        { label: '1 katt', price: '220 kr' },
                        { label: '2 katter', price: '320 kr' },
                        { label: '3 katter', price: '400 kr' },
                      ].map(({ label, price }) => (
                        <div key={label} className="flex justify-between">
                          <span>{label}</span>
                          <span className="font-semibold text-slate-900">
                            {price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-5">
                    <p className="mb-4 text-sm font-medium text-slate-500">
                      Høysesong
                    </p>
                    <div className="space-y-2 text-sm text-slate-700">
                      {[
                        { label: '1 katt', price: '250 kr' },
                        { label: '2 katter', price: '350 kr' },
                        { label: '3 katter', price: '450 kr' },
                      ].map(({ label, price }) => (
                        <div key={label} className="flex justify-between">
                          <span>{label}</span>
                          <span className="font-semibold text-slate-900">
                            {price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mb-6 text-sm text-slate-600">
                  Priser er per døgn, minstebeløp tilsvarer 2 døgn
                </p>

                <div className="space-y-3">
                  {['Gratis medisinering', 'Rabatt ved langtidsopphold'].map(
                    (item) => (
                      <div key={item} className="flex items-start">
                        <span className="mr-2 text-slate-400">•</span>
                        <span className="text-slate-700">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Inn- og utsjekk */}
              <div>
                <h4 className="mb-4 font-semibold text-slate-900">
                  Inn- og utsjekk
                </h4>
                <p className="mb-4 text-slate-700">
                  <strong>Mandag–fredag og søndag:</strong>
                  <br />
                  Kl. 17:30–19:30
                </p>
                <p className="mb-4 text-slate-700">
                  <strong>Lørdag:</strong> Stengt
                </p>
                <p className="mb-4 text-slate-700">
                  <strong>Sommersesong:</strong> åpent for levering og henting
                  på lørdager.
                </p>
                <p className="text-sm text-slate-600">
                  Andre tidspunkt kun etter avtale
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
