import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/server/checkUser";

const Header = async () => {
  await checkUser();
  return (
    <header className="fixed top-0 left-0 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 z-50 w-screen">
      <nav className="flex items-center justify-between px-4 container mx-auto h-16">
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            alt="Your AI Coach"
            width={120}
            height={60}
            priority={true}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant={"outline"}>
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"default"}>
                  <StarIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant={"outline"}>Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: `w-10 h-10`,
                  userButtonPopoverCard: `shadow-xl`,
                  userPreviewMainIdentifier: `font-semibold`,
                },
              }}
              //   afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
