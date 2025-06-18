import { Faq3 } from "@/components/ui/faq3";

const demoData = {
  heading: "Frequently asked questions",
  description:
    "Everything you need to know about Gitcord. Can't find the answer you're looking for? Feel free to contact our support team.",
  items: [
    {
      id: "faq-1",
      question: "What is Gitcord?",
      answer:
        "Gitcord is an advanced analytics tool designed for GitHub. It helps developers and teams gain powerful insights into their repositories, organizations, and profiles with real-time statistics, trends, and contribution overviews.",
    },
    {
      id: "faq-2",
      question: "What features does Gitcord offer?",
      answer:
        "Gitcord offers detailed analytics for GitHub repositories, organization-wide activity tracking, contribution graphs, issue and pull request trends, contributor insights, and customizable dashboards for both individual developers and teams.",
    },
    {
      id: "faq-3",
      question: "Is Gitcord free to use?",
      answer:
        "Gitcord offers both free and premium plans. The free version provides access to basic analytics for public repositories. Premium plans unlock advanced features like private repository insights, team dashboards, export options, and priority support.",
    },
    {
      id: "faq-4",
      question: "Can I use Gitcord for multiple repositories or organizations?",
      answer:
        "Absolutely! Gitcord supports multiple repositories and organizations. You can connect various GitHub accounts or organizations and get consolidated insights across all of them.",
    },
    {
      id: "faq-5",
      question: "How secure is Gitcord?",
      answer:
        "Gitcord prioritizes security and data privacy. We primarily use GitHub's API to fetch data in real-time and store minimal information such as your GitHub username and ID. We use OAuth2 for secure authentication via GitHub and only request read-only access to your repositories. Most of the statistics and analytics are generated on-the-fly from GitHub's API, ensuring we don't store unnecessary data.",
    },
  ],
  supportHeading: "Still have questions?",
  supportDescription:
    "Can't find the answer you're looking for? Our support team is here to help with any technical questions or concerns.",
  supportButtonText: "Contact Support",
  supportButtonUrl: "",
};

function FaqSection() {
  return <Faq3 {...demoData} />;
}

export { FaqSection };
