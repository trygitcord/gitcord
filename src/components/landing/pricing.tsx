import { Pricing2 } from "@/components/ui/pricing2";

const demoData = {
  heading: "Pricing",
  description:
    "Powerful features, simple pricing. Choose the perfect plan that fits your needs and start building amazing projects with our comprehensive development tools and analytics.",
  plans: [
    {
      id: "free",
      name: "Free",
      description: "Basic access",
      monthlyPrice: "$0",
      features: [
        { text: "Public repos only" },
        { text: "Basic stats" },
        { text: "Last activity" },
        { text: "Community support" },
      ],
      button: {
        text: "Get Started",
        url: "/signup",
      },
    },
    {
      id: "pro",
      name: "Pro",
      description: "Full access",
      monthlyPrice: "$4",
      features: [
        { text: "Public & private repos" },
        { text: "Advanced analytics" },
        { text: "Access to AI features" },
        { text: "Premium profile badge" },
        { text: "Unlimited activity" },
      ],
      button: {
        text: "Get Pro",
        url: "/",
      },
    },
  ],
};

function PricingSection() {
  return <Pricing2 {...demoData} />;
}

export { PricingSection };
