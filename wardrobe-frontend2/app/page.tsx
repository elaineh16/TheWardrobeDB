import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Clock, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance font-bold tracking-tight font-serif text-8xl">
              Cornell Wardrobe
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Access premium clothing for any occasion. Browse our curated collection and rent the perfect outfit for
              your next event.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/catalog">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="/requests">View My Requests</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Shop by Category</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/catalog?category=womens" className="group">
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5">
                  <img
                    src="/elegant-women-s-formal-dress-on-mannequin.jpg"
                    alt="Women's Collection"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">Women's Collection</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Elegant dresses, professional attire, and more</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog?category=mens" className="group">
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary/10 to-secondary/5">
                  <img
                    src="/men-s-formal-suit-on-mannequin.jpg"
                    alt="Men's Collection"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">Men's Collection</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Suits, blazers, and formal wear</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog?category=accessories" className="group">
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-[4/3] bg-gradient-to-br from-accent/10 to-accent/5">
                  <img
                    src="/fashion-accessories-ties-scarves-bags.jpg"
                    alt="Accessories"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">Accessories</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Complete your look with the perfect accessories</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Cornell Wardrobe?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">Curated collection of high-quality clothing from top brands</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Rentals</h3>
              <p className="text-muted-foreground">Rent for as long as you need with easy request management</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Student Friendly</h3>
              <p className="text-muted-foreground">Affordable access to professional attire for Cornell students</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
                <p className="mb-6 text-lg opacity-90">
                  Browse our full collection and find the perfect outfit for your next event
                </p>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/catalog">
                    Explore Catalog
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
