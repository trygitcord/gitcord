import { Metadata } from "next";
import { HeroHeader } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";

export const metadata: Metadata = {
  title: "Gitcord | Terms of Service",
  description:
    "Terms and conditions for using Gitcord's GitHub analytics platform.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16 pt-16">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-4">
            These terms govern your use of Gitcord and describe the rights and
            responsibilities that apply to both you and us.
          </p>
          <p className="text-muted-foreground text-sm">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {/* Acceptance of Terms */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Acceptance of Terms
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              By accessing or using Gitcord (&ldquo;the Service&rdquo;), you
              agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
              If you disagree with any part of these terms, then you may not
              access the Service.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              These Terms apply to all visitors, users, and others who access or
              use the Service. By using our Service, you represent that you are
              at least 13 years old and have the legal capacity to enter into
              these Terms.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Description of Service
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Gitcord is a GitHub analytics platform that provides insights into
              developer activity and coding performance. Our Service includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>GitHub activity tracking and contribution analysis</li>
              <li>Developer leaderboards and activity scoring</li>
              <li>Contribution graphs and statistics visualization</li>
              <li>User profiles with GitHub integration</li>
              <li>Activity logs and performance metrics</li>
              <li>Premium features for enhanced analytics</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              User Accounts
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Account Creation
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  To use our Service, you must create an account by connecting
                  your GitHub account. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
                  <li>Maintaining the security of your GitHub account</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring your GitHub profile information is accurate</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Premium Accounts
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  Gitcord offers premium features with enhanced analytics.
                  Premium accounts:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
                  <li>Are billed according to the selected plan</li>
                  <li>Provide access to advanced analytics features</li>
                  <li>Can be cancelled at any time</li>
                  <li>Include enhanced support and features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Acceptable Use Policy
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              You agree to use our Service only for lawful purposes and in
              accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated tools to scrape or abuse the Service</li>
              <li>
                Create false or misleading activity on GitHub to manipulate
                scores
              </li>
              <li>Share your account credentials with others</li>
              <li>Attempt to reverse engineer the Service</li>
              <li>Use the Service to spam or harass other users</li>
            </ul>
          </section>

          {/* GitHub Integration */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              GitHub Integration
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Our Service integrates with GitHub through their official API. By
              using our Service:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>
                You grant us permission to access your public GitHub data as
                authorized
              </li>
              <li>
                We access your GitHub events, contributions, and public profile
                information
              </li>
              <li>
                You can revoke our access at any time through your GitHub
                settings
              </li>
              <li>
                We respect GitHub&rsquo;s API rate limits and terms of service
              </li>
              <li>
                We only access data necessary for analytics and leaderboard
                functionality
              </li>
            </ul>
          </section>

          {/* Data and Analytics */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Data and Analytics
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Our analytics system tracks and processes your GitHub activity.
              We:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>Calculate activity scores based on your GitHub events</li>
              <li>Store contribution data and activity metrics</li>
              <li>Generate leaderboards and performance comparisons</li>
              <li>Track usage statistics for service improvement</li>
              <li>Log API requests for troubleshooting and optimization</li>
            </ul>
          </section>

          {/* Premium Services */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Premium Services
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Billing and Payment
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  Premium features are billed according to your selected plan:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
                  <li>
                    Payment is processed securely through third-party providers
                  </li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>You can upgrade, downgrade, or cancel at any time</li>
                  <li>Refunds are handled according to our refund policy</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Service Availability
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We strive to provide reliable service but cannot guarantee
                  100% uptime. Premium features may occasionally be unavailable
                  due to maintenance, updates, or technical issues.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Intellectual Property Rights
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Our Rights
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The Service and its features, analytics algorithms, and user
                  interface are the exclusive property of Gitcord. This includes
                  our scoring systems, data visualizations, and platform
                  functionality.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Your Data
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  You retain ownership of your GitHub data. By using our
                  Service, you grant us permission to analyze and display your
                  public GitHub activity for the purpose of providing analytics
                  and leaderboard features.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Disclaimers
            </h2>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                IMPORTANT LEGAL NOTICE
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Analytics and scoring are based on publicly available GitHub
                data and may not reflect complete development activity.
              </p>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES. We
              disclaim warranties including but not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>Accuracy of analytics and scoring calculations</li>
              <li>Completeness of GitHub data synchronization</li>
              <li>Uninterrupted service availability</li>
              <li>Compatibility with all browsers and devices</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Limitation of Liability
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Gitcord&rsquo;s liability is limited to the maximum extent
              permitted by law. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>Loss of data due to GitHub API limitations or changes</li>
              <li>Inaccurate analytics or scoring calculations</li>
              <li>Service interruptions or downtime</li>
              <li>Decisions made based on our analytics</li>
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed mt-6">
              Our total liability shall not exceed the amount you paid for
              premium services in the 12 months preceding any claim.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Termination
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  By You
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  You may terminate your account at any time by revoking GitHub
                  access or contacting us. Premium subscriptions can be
                  cancelled through your account settings.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  By Us
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We may suspend or terminate accounts that violate these Terms,
                  abuse the Service, or engage in activities that harm other
                  users or the platform.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Changes to These Terms
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We reserve the right to modify these Terms at any time. Material
              changes will be communicated through the Service or via email.
              Continued use of the Service constitutes acceptance of updated
              Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Contact Information
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              If you have questions about these Terms, please contact us through
              our support channels or via the contact information provided on
              our website.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
