import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-background">
      <Image
        src="/not-found.png"
        alt="Not Found"
        width={480}
        height={480}
        className="w-72 h-72 mb-5"
      />
      <h1 className="text-4xl mb-2 text-muted-foreground">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-muted-foreground/50 text-sm my-2 mb-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href={"/"}>
        <Button size={"lg"} className="font-bold">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
