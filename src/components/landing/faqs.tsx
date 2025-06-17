import { Faq3 } from "@/components/ui/faq3";

const demoData = {
  heading: "Frequently asked questions",
  description:
    "Everything you need to know about shadcnblocks. Can't find the answer you're looking for? Feel free to contact our support team.",
  items: [
    {
      id: "faq-1",
      question: "What is shadcnblocks?",
      answer:
        "shadcnblocks is a collection of ready-to-use block components built on top of shadcn/ui, designed to help you build beautiful websites faster.",
    },
    {
      id: "faq-2",
      question: "How do I install shadcnblocks?",
      answer:
        "shadcnblocks components are designed to be copied and pasted into your project. Simply browse the components, click on the one you want to use, and copy the code directly into your project. This gives you full control over the code and allows for easy customization.",
    },
    {
      id: "faq-3",
      question: "Is shadcnblocks free to use?",
      answer:
        "Yes, shadcnblocks is open-source and free to use in both personal and commercial projects. You can customize and modify the blocks to suit your needs.",
    },
    {
      id: "faq-4",
      question: "Can I customize the blocks?",
      answer:
        "Absolutely! All blocks are built with customization in mind. You can modify the styling, content, and behavior through props and Tailwind CSS classes.",
    },
    {
      id: "faq-5",
      question: "Do you offer support?",
      answer:
        "Yes, we provide support through our GitHub repository where you can report issues, suggest features, or ask questions about implementation.",
    },
  ],
  supportHeading: "Still have questions?",
  supportDescription:
    "Can't find the answer you're looking for? Our support team is here to help with any technical questions or concerns.",
  supportButtonText: "Contact Support",
  supportButtonUrl: "https://shadcnblocks.com",
};

function Faq3Demo() {
  return <Faq3 {...demoData} />;
}

export { Faq3Demo };
