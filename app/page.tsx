import HeroSection from "@/components/HeroSection";
import { features, stats } from "@/data/features";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import Image from "next/image";
import { faqs } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  return (
    <div className="mx-auto">
      <div className="grid-background bg-muted" />

      <HeroSection />

      <section className="py-12 md:py-24 lg:py-32 w-full bg-muted/25 mt-8">
        <div className="container mx-auto px-4">
          <div className="space-y-6 text-center">
            {/* Heading  */}

            <h1 className="text-3xl tracking-tighter mb-12 font-bold text-center">
              Powerful Features for your Growth
            </h1>

            {/* Cards  */}
            <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-8 max-w-6xl">
              {features.map((curr, idx) => (
                <Card
                  key={idx}
                  className="border-2 hover:border-primary transition-colors duration-300 w-full basis-80"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col justify-center items-center gap-2">
                      {curr.icon}
                      <h3 className="font-bold text-lg mb-2">{curr.title}</h3>
                      <p className="text-muted-foreground">
                        {curr.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-background/75 w-full">
        <div className="px-4 container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((curr, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center space-y-2"
              >
                <h2 className="font-bold text-2xl md:text-4xl">{curr.stat}</h2>
                <p className="text-muted-foreground">{curr.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 w-full bg-background/75">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">How it Works</h2>
            <p className="mt-2 text-muted-foreground ">
              Four simple steps to accelrate your growth
            </p>
          </div>

          <div className="flex justify-center items-center flex-wrap gap-6">
            {howItWorks.map((curr, idx) => {
              return (
                <Card key={idx} className="border-none basis-80">
                  <CardContent className="flex flex-col space-y-4 justify-center items-center text-center">
                    <div className="bg-muted grid place-content-center w-16 h-16 rounded-full cursor-pointer ">
                      {curr.icon}
                    </div>
                    <h3 className="font-bold text-xl">{curr.title}</h3>
                    <p className="text-muted-foreground">{curr.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 w-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold ">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonial.map((curr, idx) => {
              return (
                <Card key={idx} className="bg-muted/50">
                  <CardHeader>
                    <div className="flex space-x-4 items-center">
                      <Image
                        src={curr.image}
                        alt={curr.author}
                        width={70}
                        height={70}
                        className="rounded-full object-cover border-2 border-primary/20 p-1"
                      />
                      {/* </div> */}

                      <div className="flex flex-col">
                        <h4 className="font-bold">{curr.author}</h4>
                        <p className="text-muted-foreground text-sm">
                          {curr.role}
                        </p>
                        <p className="text-primary text-sm">{curr.company}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <blockquote>
                      <p className="italic text-muted-foreground relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">
                          &quot;
                        </span>
                        {curr.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 w-full bg-background/75">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center w-full mb-12">
            <h2 className="text-4xl font-bold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Get answers for your most common questions
            </p>
          </div>

          <div className="w-full max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((curr, idx) => {
                return (
                  <AccordionItem key={idx} value={`${curr}-${idx}`}>
                    <AccordionTrigger>{curr.question}</AccordionTrigger>
                    <AccordionContent>{curr.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 w-full gradient">
        <div className="px-4 md:px-6">
          <div className="max-w-3xl mx-auto w-full text-center">
            <h2 className="text-3xl md:text-5xl text-background/80 font-bold mb-2">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-background/50 max-w-[600px] mx-auto">
              Join thousands of professionals who are advancing their careers
              with AI powered guidance{" "}
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                variant="secondary"
                className="h-11 mt-5 animate-bounce"
              >
                Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/** py, bg, w-full
 *  container, px, mx-auto
 */
