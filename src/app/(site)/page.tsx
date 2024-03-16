import { Button, Container, TitleSection } from "@/components";
import { CLIENTS } from "@/constants";
import Image from "next/image";
import React from "react";

export default async function Index() {
  return (
    <>
      <Container>
        <div
          className="
            overflow-hidden
            mt-10
            sm:flex
            sm:flex-col
            gap-4
            md:justify-center
            md:items-center"
        >
          <TitleSection
            title="All-in-one Collaboration and Productivity Platform"
            pill="✨ Your workspace, Perfected"
          />

          <div
            className="
            bg-white
            p-[2px]
            mt-3
            rounded-xl
            bg-gradient-to-r
            from-primary
            to-brand-primaryBlue
            sm:w-[300px]"
          >
            <Button
              variant="btn-secondary"
              className="
                w-full
                rounded-[10px]
                p-6
                text-2xl
                bg-background"
            >
              Get Zotion docs free
            </Button>
          </div>

          <div
            className="
            md:mt-[-75px]
            sm:w-full
            max-w-[800px]
            flex
            justify-center
            items-center
            mt-[-40px]
            relative
            h-[60vh]"
          >
            <Image className="object-contain" src="/app-banner.png" alt="application-banner" fill />
            <div
              className="
                inset-0
                top-[50%]
                bg-gradient-to-t
                dark:from-background
                absolute
                z-10"
            ></div>
          </div>
        </div>
      </Container>

      <section className="relative">
        <div
          className="
            overflow-hidden
            flex
            after:content['']
            after:dark:from-brand-dark
            after:to-transparent
            after:from-background
            after:bg-gradient-to-l
            after:right-0
            after:bottom-0
            after:top-0
            after:w-20
            after:z-10
            after:absolute

            before:content['']
            before:dark:from-brand-dark
            before:to-transparent
            before:from-background
            before:bg-gradient-to-r
            before:left-0
            before:top-0
            before:bottom-0
            before:w-20
            before:z-10
            before:absolute"
        >
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex animate-slide">
                {CLIENTS.map((client, index) => (
                  <div
                    className="
                    relative
                    w-[200px]
                    mx-10
                    my-20"
                    key={index}
                  >
                    <Image
                      className="object-contain"
                      src={`/${client.src}`}
                      alt={index.toString()}
                      width={150}
                      height={150}
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
