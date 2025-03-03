import Link from "next/link";
import React from "react";

const Footer = () => {
  const navLinks = [
    {
      href: "/",
      title: "Home",
    },
    {
      href: "/dashboard",
      title: "Dashboard",
    },
    {
      href: "/interview",
      title: "Interview Prep",
    },
    {
      href: "/resume",
      title: "Resume Builder",
    },
    {
      href: "/ai-cover-letter",
      title: "AI Cover Letter",
    },
  ];

  const socialIcons = [
    {
      href: "https://www.facebook.com/profile.php?id=100041387829111",
      title: "facebook",
      svg: (
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      href: "https://www.linkedin.com/in/bilalahmad072/",
      title: "LinkedIn",
      svg: (
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z"
              fill="currentColor"
            ></path>{" "}
            <path
              d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z"
              fill="currentColor"
            ></path>{" "}
            <path
              d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z"
              fill="currentColor"
            ></path>{" "}
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
              fill="currentColor"
            ></path>{" "}
          </g>
        </svg>
      ),
    },
    {
      href: "",
      title: "twitter",
      svg: (
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
        </svg>
      ),
    },
    {
      href: "https://github.com/Profysr",
      title: "github",
      svg: (
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
  ];
  return (
    <section className="bg-muted/80 border-t">
      <div className="container px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          {navLinks.map((currLink, idx) => {
            return (
              <div className="px-5 py-2" key={idx}>
                <Link
                  href={currLink.href}
                  className="text-base leading-6 text-gray-500 hover:text-primary duration-200"
                >
                  {currLink.title}
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          {socialIcons.map((curr, idx) => (
            <a
              key={idx}
              href={curr.href}
              className="text-gray-400 hover:text-primary duration-200"
            >
              <span className="sr-only">{curr.title}</span>
              {curr.svg}
            </a>
          ))}
        </div>
        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          © 2025 AI, Inc. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
