import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "BlanchDev",
      handle: "@blanch",
      avatar: "https://avatars.githubusercontent.com/u/21373355?v=4",
    },
    text: "Thanks to AI integration, I now have a clear vision for my upcoming projects, it feels like all my ideas are right at my fingertips.",
    href: "https://github.com/BlanchDev",
  },
  {
    author: {
      name: "Pingu",
      handle: "@pingu",
      avatar: "https://avatars.githubusercontent.com/u/70480951?v=4",
    },
    text: "I was new to software development and GitHub felt overwhelming but after discovering Gitcord, I realized there was nothing to stress about.",
    href: "https://github.com/berkcanakdeniz",
  },
];

export function Marquee() {
  return (
    <div className="max-w-6xl mx-auto">
      <TestimonialsSection
        title="Trusted by developers worldwide"
        description="Join thousands of developers who are already using Gitcord to enhance their GitHub experience with AI-powered features"
        testimonials={testimonials}
      />
    </div>
  );
}
