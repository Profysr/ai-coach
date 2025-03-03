"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import bannerImage from "./banner.jpeg";

const HeroSection = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 100;
      if (scrollY > scrollThreshold) {
        if (imageRef.current) {
          imageRef.current.classList.add("scrolled");
        }
      } else {
        if (imageRef.current) {
          imageRef.current.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="w-full pt-36 md:pt-40">
      <div className="space-y-6 text-center">
        {/* heading section */}
        <div className="space-y-6 mx-auto">
          <h1 className="gradient-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
            Your AI Coach for <br /> Professional Growth
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advanced your growth through ouur expert guidance, interview
            preparation and AI powered tool for job success
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4 justify-center">
          <Link href={"/sign-in"}>
            <Button size={"lg"}>Get Started</Button>
          </Link>
          <Link href={"/dashboard"}>
            <Button variant={"outline"} size={"lg"}>
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Banner Image  */}
        <div className="hero-image-wrapper">
          <div className="hero-image" ref={imageRef}>
            <Image
              src={bannerImage}
              alt="Banner Image"
              // width={1200}
              // height={720}
              // priority
              loading="lazy"
              placeholder="blur"
              className="rounded-xl border mx-auto shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
