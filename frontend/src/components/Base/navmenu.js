"use client";

import React from "react";
import {useState ,useEffect} from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components = [
  {
    title: "CGPA Input Dialog",
    href: "http://ai-cgpa-calculator.vercel.app",
    description:
      "A modal dialog for students to input their CGPA details and receive calculated results.",
  },
  {
    title: "PDF Upload Section",
    href: "http://ai-cgpa-calculator.vercel.app",
    description:
      "Allows students to upload transcripts or mark sheets for automated CGPA extraction.",
  },
  {
    title: "Calculation Progress",
    href: "http://ai-cgpa-calculator.vercel.app",
    description:
      "Displays real-time CGPA calculation progress based on uploaded data.",
  },
  {
    title: "Result Scroll Area",
    href: "http://ai-cgpa-calculator.vercel.app",
    description:
      "Provides a structured display for CGPA results and detailed score breakdown.",
  },
];

export function Navmenu() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Documents</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-gradient-to-tr from-black to-zinc-900">
            <ul className="grid gap-3 p-4 w-[280px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                {windowWidth > 768 ? (<Link
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 no-underline outline-none focus:shadow-md bg-[url('/thumbnail1.png')] bg-cover bg-center"
                  href="https://www.figma.com/design/GSsbx9vrR8F7rKfbFVx2lk/GPI-Calculator?m=auto&t=PJ9REQQ58XhKOk9s-1"
                >
            
                </Link>) : (<Link
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 no-underline outline-none focus:shadow-md bg-[url('/thumbnail.png')] bg-cover bg-center aspect-[16/9]"
                  href="https://www.figma.com/design/GSsbx9vrR8F7rKfbFVx2lk/GPI-Calculator?m=auto&t=PJ9REQQ58XhKOk9s-1"
                >
      
              
                </Link>)}
                
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-gradient-to-tr from-black to-zinc-900">
            <ul className="grid gap-3 p-4 md:w-full  md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <li
                  key={component.title}
                  className="select-none space-y-1 rounded-md p-3 leading-none transition-colors text-white shadow hover:bg-zinc-800"
                >
                  <div className="text-sm font-semibold leading-none">
                    {component.title}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {/* Fix: Ensure no nested <a> tags */}
          <NavigationMenuLink asChild>
            <Link
              href="https://github.com/Lovedragn"
              className={navigationMenuTriggerStyle()}
            >
              Visit
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef(function ListItem(
  { className, title, children, href, ...props },
  ref
) {
  return (
    <li>
      {/* Fix: Directly use Link for navigation */}
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  );
});

export default Navmenu;