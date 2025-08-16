import { Testimonials } from "@/components/ui/testimonials";

const testimonials = [
  {
    text: "Thanks to AI integration, I now have a clear vision for my upcoming projects, it feels like all my ideas are right at my fingertips.",
    image: "https://avatars.githubusercontent.com/u/21373355?v=4",
    name: "BlanchDev",
    username: "blanchDev",
    social: "https://twitter.com/BlanchDev",
  },
  {
    text: "I was new to software development and github felt overwhelming but after discovering @gitcord, I realized there was nothing to stress about.",
    image: "https://avatars.githubusercontent.com/u/70480951?v=4",
    name: "Pingu",
    username: "pingu",
    social: "https://twitter.com/Pingu",
  },
];

export function MarqueeColumns() {
  return (
    <div id="reviews" className="container py-10 scroll-mt-20">
      <Testimonials testimonials={testimonials} />
    </div>
  );
}
