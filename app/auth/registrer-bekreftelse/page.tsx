import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Takk for at du registrerte deg!
              </CardTitle>
              <CardDescription>
                Sjekk e-posten din for bekreftelse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Du har registrert deg. Vennligst sjekk e-posten din og bekreft
                kontoen før du logger inn.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
