import { Avatar, Button, CustomCard, Container, TitleSection, Card } from "@/components";
import { CLIENTS, PRICING_CARDS, PRICING_PLANS, USERS } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default async function Landing() {
  return (
    <>
      <Container>
        <div
          className="
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
              sm:w-[250px]"
          >
            <Button
              variant="btn-secondary"
              className="
                w-full
                rounded-[10px]
                p-5
                bg-background"
            >
              Get Zotion free
            </Button>
          </div>

          <div
            className="
              md:mt-[-75px]
              w-full
              flex
              justify-center
              items-center
              mt-[-60px]
              relative
              h-[50vh]
              sm:h-[70vh]"
          >
            <Image className="object-contain" src="/app-banner.png" alt="application-banner" fill />
            <div
              className="
                inset-0
                top-[25%]
                sm:top-[50%]
                bg-gradient-to-t
                dark:from-background
                absolute
                z-10"
            />
          </div>
        </div>
      </Container>

      <section className="relative mt-20">
        <div
          className="
            overflow-hidden
            flex
            after:content['']
            after:absolute
            after:dark:from-brand-dark
            after:bg-gradient-to-l
            after:to-transparent
            after:from-background
            after:right-0
            after:bottom-0
            after:top-0
            after:w-32
            after:z-10

            before:content['']
            before:absolute
            before:dark:from-brand-dark
            before:bg-gradient-to-r
            before:to-transparent
            before:from-background
            before:left-0
            before:top-0
            before:bottom-0
            before:w-32
            before:z-10"
        >
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex animate-slide">
                {CLIENTS.map((client, index) => (
                  <div key={index} className="relative w-[200px] mx-8">
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

      <Container
        className="
          mt-20
          flex
          flex-col
          justify-center
          items-center
          relative"
      >
        <div
          className="
            w-[30%]
            blur-[120px]
            rounded-full
            h-[60vh]
            absolute
            bg-brand-primaryPurple/50
            -z-10
            top-22"
        />
        <TitleSection
          title="Keep track of your meetings all in one place"
          subtitle="Capture your ideas, thoughts, and meeting notes in a structured and organized manner."
          pill="Features"
        />
        <div
          className="
            mt-10
            w-full
            max-w-[400px]
            relative
            rounded-3xl
            h-[60vh]
            border-[6px]
            border-washed-purple-300 
            border-opacity-10"
        >
          <Image className="rounded-2xl object-center" src="/calendar.png" alt="Banner" fill />
        </div>
      </Container>

      <section className="relative mt-20">
        <div
          className="
            w-[95%]
            blur-[120px]
            rounded-full
            h-[60vh]
            absolute
            bg-brand-primaryPurple/50
            -z-10
            top-44"
        />

        <div className="px-4 sm:px-2 md:px-10">
          <TitleSection
            title="Trusted by all"
            subtitle="Join thousands of satisfied users who rely on our platform for their 
            personal and professional productivity needs."
            pill="Testimonials"
          />
        </div>

        <div
          className="
            flex
            flex-col
            overflow-x-hidden"
        >
          {Array(2)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={twMerge(
                  clsx("mt-10 flex flex-nowrap gap-6 self-start", {
                    "flex-row-reverse": index === 1,
                    "animate-[slide_250s_linear_infinite]": true,
                    "animate-[slide_250s_linear_infinite_reverse]": index === 1,
                    "ml-[100vw]": index === 1,
                  }),
                  "hover:paused"
                )}
              >
                {USERS.map((testimonial, index) => (
                  <CustomCard
                    key={index}
                    className="
                      w-[300px]
                      sm:w-[500px]
                      shrink-0
                      rounded-xl
                      dark:bg-gradient-to-t
                      dark:from-border
                      dark:to-background"
                    header={
                      <div className="flex items-center gap-3">
                        <Avatar.Root>
                          <Avatar.Image src={`/avatars/${index + 1}.png`} />
                          <Avatar.Fallback>
                            <Image src="/placeholder.jpg" alt="placeholder" fill />
                          </Avatar.Fallback>
                        </Avatar.Root>

                        <div>
                          <Card.Title className="text-foreground">{testimonial.name}</Card.Title>

                          <Card.Description className="dark:text-washed-purple-800">
                            {testimonial.name.toLowerCase()}
                          </Card.Description>
                        </div>
                      </div>
                    }
                    body={<p className="text-sm sm:text-base font-light">{testimonial.message}</p>}
                  />
                ))}
              </div>
            ))}
        </div>
      </section>

      <Container className="mt-20">
        <TitleSection
          title="The Perfect Plan For You"
          subtitle="Experience all the benefits of our platform. Select a plan that suits your needs and take your productivity to new heights."
          pill="Pricing"
        />
        <div
          className="
            flex
            flex-col-reverse
            sm:flex-row
            gap-4
            justify-center
            sm:items-stretch
            mt-10"
        >
          {PRICING_CARDS.map((pricing, index) => (
            <CustomCard
              key={index}
              className={clsx("w-full sm:w-[300px] rounded-2xl dark:bg-black/40 relative", {
                "border-brand-primaryPurple/70": pricing.planType === PRICING_PLANS.proplan,
              })}
              header={
                <Card.Title>
                  {pricing.planType === PRICING_PLANS.proplan && (
                    <>
                      <div
                        className="
                          hidden
                          dark:block
                          w-full
                          blur-[120px]
                          rounded-full
                          h-32
                          absolute
                          bg-brand-primaryPurple/80
                          -z-10
                          top-0"
                      />
                      <Image
                        className="absolute right-4 top-4"
                        src="/icons/diamond.svg"
                        alt="pro-plan-icon"
                        height={20}
                        width={20}
                      />
                    </>
                  )}
                  {pricing.planType}
                </Card.Title>
              }
              body={
                <Card.Content className="p-0">
                  <span className="font-normal text-2xl">{pricing.price}</span>

                  {!!pricing.price && <span className="dark:text-washed-purple-800 ml-1">/mo</span>}

                  <p className="dark:text-washed-purple-800">{pricing.description}</p>

                  <Button className="whitespace-nowrap w-full mt-4 text-base" variant="btn-primary" size="sm">
                    {pricing.planType === PRICING_PLANS.proplan ? "Go Pro" : "Get Started"}
                  </Button>
                </Card.Content>
              }
              footer={
                <ul>
                  <small className="font-normal flex mb-2 flex-col">{pricing.highlightFeature}</small>
                  {pricing.freatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Image src="/icons/check.svg" height={20} width={20} alt="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              }
            />
          ))}
        </div>
      </Container>
    </>
  );
}
