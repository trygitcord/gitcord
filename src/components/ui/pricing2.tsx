"use client";

import { ArrowRight, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
}

interface Pricing2Props {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

const Pricing2 = ({
  heading = "Pricing",
  description = "Check out our affordable pricing plans",
  plans,
}: Pricing2Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-pretty text-3xl font-semibold lg:text-4xl">
            {heading}
          </h2>
          <p className="font-normal text-muted-foreground sm:text-lg max-w-[800px]">
            {description}
          </p>
          <div className="flex flex-col items-stretch gap-6 md:flex-row pt-4">
            {plans &&
              plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`flex w-80 flex-col justify-between text-left bg-neutral-950 ${
                    plan.id === "pro" ? "border-2 border-[#3ABA81]" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle>
                      <p>{plan.name}</p>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <span className="text-4xl font-bold">
                      {plan.monthlyPrice}
                    </span>
                    <p className="text-muted-foreground">Billed monthly</p>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-6" />
                    {plan.id === "pro" && (
                      <p className="mb-3 font-medium">
                        Everything in Free, and:
                      </p>
                    )}
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CircleCheck className="size-4" />
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      asChild
                      className={`w-full ${
                        plan.id === "pro"
                          ? "bg-[#3ABA81] hover:bg-[#3ABA81]/90"
                          : ""
                      }`}
                    >
                      <a href={plan.button.url} target="_blank">
                        {plan.button.text}
                        <ArrowRight className="ml-2 size-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
