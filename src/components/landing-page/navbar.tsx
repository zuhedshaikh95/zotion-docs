"use client";
import { NavbarConfig } from "@/configs/navbar.config";
import { cn } from "@/libs/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button, NavigationMenu } from "..";

const routes = [
  { title: "Features", href: "#features" },
  { title: "Resources", href: "#resources" },
  { title: "Pricing", href: "#pricing" },
  { title: "Testimonials", href: "#testimonials" },
];

interface Props {}

const Navbar: React.FC<Props> = ({}) => {
  const [path, setPath] = useState<string>("#products");

  return (
    <header
      className="
        mx-auto
        md:px-10
        md:py-3
        sm:p-2
        p-4
        flex
        justify-center
        items-center"
    >
      <Link
        href="/"
        className="
            w-full
            flex
            gap-2
            justify-start
            items-center"
        passHref
      >
        <Image src="/zotion-logo.png" alt="zotion-logo" width={35} height={35} />
        <span className="font-semibold dark:text-white">Zotion</span>
      </Link>

      <NavigationMenu.Root className="hidden md:block">
        <NavigationMenu.List className="gap-6">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger
              className={twMerge(
                cn({
                  "dark:text-white": path === "#resources",
                  "dark:text-white/40": path !== "#resources",
                }),
                "font-normal"
              )}
              onClick={() => setPath("#resources")}
            >
              Resources
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul
                className="
                  grid
                  gap-3
                  p-4
                  md:w-[400px]
                  lg:w-[500px]
                  lg:grid-cols-[.75fr_1fr]"
              >
                <li className="row-span-3">
                  <span
                    className="
                      flex
                      h-full
                      w-full
                      select-none
                      flex-col
                      justify-end
                      rounded-md
                      bg-gradient-to-b
                      from-muted/60
                      to-muted
                      p-5
                      no-underline
                      outline-none
                      focus:shadow-md"
                  >
                    Hello, Topper
                  </span>
                </li>
                <ListItem href="#" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="#" title="Introduction">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="#" title="Introduction">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger
              className={twMerge(
                cn({
                  "dark:text-white": path === "#pricing",
                  "dark:text-white/40": path !== "#pricing",
                }),
                "font-normal"
              )}
              onClick={() => setPath("#pricing")}
            >
              Pricing
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul
                className="
                  grid
                  gap-3
                  p-4
                  md:w-[400px]
                  md:grid-rows-2"
              >
                <ListItem title="Pro Plan" href="#">
                  Unlock full power with collaboration.
                </ListItem>
                <ListItem title="free Plan" href="#">
                  Great for teams just starting out.
                </ListItem>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Content>
              <ul
                className="
                  grid w-[400px]
                  gap-3
                  p-4
                  md:w-[500px]
                  md:grid-cols-2 
                  lg:w-[600px]
                  "
              >
                {NavbarConfig.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link
              className={cn(
                NavigationMenu.navigationMenuTriggerStyle,
                {
                  "dark:text-white": path === "#testimonials",
                  "dark:text-white/40": path !== "#testimonials",
                },
                "font-normal text-sm"
              )}
              onClick={() => setPath("#testimonials")}
            >
              Testimonial
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <aside
        className="
          flex
          w-full
          gap-2
          justify-end"
      >
        <Link href="/login" passHref>
          <Button className="p-1 hidden sm:block text-sm" variant="btn-secondary">
            Login
          </Button>
        </Link>

        <Link href="/signup" passHref>
          <Button className="whitespace-nowrap text-sm" variant="btn-primary" size="sm">
            Signup
          </Button>
        </Link>
      </aside>
    </header>
  );
};

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenu.Link asChild>
          <a className={cn("group block select-none space-y-1 font-medium leading-none")} ref={ref} {...props}>
            <div
              className="
                text-white
                text-sm
                font-medium
                leading-none"
            >
              {title}
            </div>
            <p
              className="
                group-hover:text-white/70
                line-clamp-2
                leading-snug
                text-white/40"
            >
              {children}
            </p>
          </a>
        </NavigationMenu.Link>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

export default Navbar;
