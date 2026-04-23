import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Cat } from 'lucide-react'
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const CAGE_TYPES = [
  {
    name: 'standard',
    lowSeasonPrice: 220,
    highSeasonPrice: 250,
    img: 'hd-standard',
    lowSeasonPrices: [
      {
        amount: '1',
        price: 220,
      },
      {
        amount: '2',
        price: 320,
      },
    ],
    highSeasonPrices: [
      {
        amount: '1',
        price: 250,
      },
      {
        amount: '2',
        price: 350,
      },
    ],
    list: [
      'Eget rom på L85, D90, H100',
      'Seng, dokasse, mat- og vannskål',
      'Plass til 2 katter fra samme husstand',
    ],
  },
  {
    name: 'senior & comfort',
    lowSeasonPrice: 220,
    highSeasonPrice: 250,
    img: 'senior-&-comfort',
    lowSeasonPrices: [
      {
        amount: '1',
        price: 220,
      },
      {
        amount: '2',
        price: 220,
      },
    ],
    highSeasonPrices: [
      {
        amount: '1',
        price: 250,
      },
      {
        amount: '2',
        price: 350,
      },
    ],
    list: [
      'Eget rom på L90, D100, H80',
      'Seng, dokasse, mat- og vannskål',
      'Plass til 2 katter fra samme husstand',
      'Tilrettelagt for eldre katter og katter med helseutfordringer',
    ],
    highlight: true,
  },
  {
    name: 'suite',
    lowSeasonPrice: 350,
    highSeasonPrice: 450,
    img: 'suite',
    lowSeasonPrices: [
      {
        amount: '1-2',
        price: 350,
      },
      {
        amount: '3',
        price: 400,
      },
    ],
    highSeasonPrices: [
      {
        amount: 'Standard pris per døgn',
        price: 450,
      },
    ],
    list: [
      'Eget rom på L85, D100, H240',
      'Seng, dokasse, mat- og vannskål',
      'Plass til 3 katter fra samme husstand',
      'Ekstra stor plass og privat område',
    ],
    premium: true,
  },
]

const Page = () => {
  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Rom og fasiliteter
        </h1>
        <p className="mt-3 text-muted-foreground">
          Komfortable og trygge omgivelser for din katt
        </p>
      </div>

      {/* Cage cards */}
      <section
        aria-labelledby="romtyper"
        className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {CAGE_TYPES.map((cage) => (
          <article key={cage.name}>
            <Card className="group rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {cage.name}
                  </CardTitle>

                  {cage.premium && <Badge>Premium</Badge>}
                  {cage.highlight && (
                    <Badge variant="secondary">Tilrettelagt</Badge>
                  )}
                </div>

                <p className="text-xl font-semibold">
                  Fra {cage.lowSeasonPrice} kr
                  <span className="text-sm font-normal text-muted-foreground">
                    {' '}
                    / døgn
                  </span>
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Image with dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="mx-auto block">
                      <Image
                        src={`/illustration/${cage.img}.webp`}
                        alt={cage.name}
                        width={400}
                        height={300}
                        className="mx-auto max-h-56 w-40 rounded-lg object-contain transition-transform group-hover:scale-105"
                      />
                    </button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-3xl">
                    <DialogTitle className="text-center text-2xl font-semibold capitalize">
                      {cage.name}
                    </DialogTitle>
                    <Image
                      src={`/illustration/${cage.img}.webp`}
                      alt={cage.name}
                      width={500}
                      height={400}
                      className="mx-auto rounded-lg object-contain"
                    />
                  </DialogContent>
                </Dialog>

                <span className="block text-center text-xs text-muted-foreground">
                  Illustrasjon – avvik kan forekomme
                </span>

                {/* Key features (only first 3 visible) */}
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {cage.list.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Expandable details */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-sm">
                      Se detaljer
                    </AccordionTrigger>

                    <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                      {/* Pricing */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                            Lav sesong priser
                          </span>
                          {cage.lowSeasonPrices?.map((price, index) => (
                            <p
                              key={index}
                              className="flex items-center gap-2 text-base font-semibold"
                            >
                              <span className="flex items-center gap-0.5">
                                {Array.from({
                                  length:
                                    price.amount === '1-2'
                                      ? 2
                                      : Number(price.amount),
                                }).map((_, i) => (
                                  <Cat key={i} className="h-3.5 w-3.5" />
                                ))}
                                {price.amount === '1-2' && (
                                  <span className="ml-0.5 text-xs font-normal opacity-60">
                                    1-2
                                  </span>
                                )}
                              </span>
                              <span className="opacity-30">·</span>
                              {price.price} kr
                            </p>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                            Høy sesong priser
                          </span>
                          {cage.highSeasonPrices?.map((price, index) => (
                            <p
                              key={index}
                              className="flex items-center gap-2 text-base font-semibold"
                            >
                              {/^\d+$/.test(price.amount) ? (
                                <>
                                  <span className="flex items-center gap-0.5">
                                    {Array.from({
                                      length: Number(price.amount),
                                    }).map((_, i) => (
                                      <Cat key={i} className="h-3.5 w-3.5" />
                                    ))}
                                  </span>
                                  <span className="opacity-50">·</span>
                                </>
                              ) : (
                                <span className="text-xs font-normal opacity-80">
                                  {price.amount}
                                </span>
                              )}
                              {price.price} kr
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Remaining features */}
                      {cage.list.length > 3 && (
                        <div className="space-y-2 border-t pt-3">
                          {cage.list.slice(3).map((item) => (
                            <p key={item}>{item}</p>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Page
