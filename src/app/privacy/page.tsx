import { Metadata } from "next";
import { HeroHeader } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer-section";

export const metadata: Metadata = {
  title: "Gitcord | Privacy Policy",
  description: "Learn how Gitcord protects your privacy and handles your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16 pt-16">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-4">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information when you use Gitcord.
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
          {/* Information We Collect */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Information We Collect
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  GitHub Profile Data
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  When you connect your GitHub account to Gitcord, we collect
                  and store:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-4">
                  <li>GitHub ID and username</li>
                  <li>Display name and email address</li>
                  <li>Profile bio and avatar URL</li>
                  <li>GitHub profile URL</li>
                  <li>Account role and moderation status (internal use)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  GitHub Activity Data
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  We fetch and analyze your public GitHub activity including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-4">
                  <li>Push events, pull requests, and issues</li>
                  <li>Public contribution data and commit statistics</li>
                  <li>Repository information and contribution graphs</li>
                  <li>Weekly activity scores and leaderboard rankings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  User Statistics and Premium Data
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  We maintain internal statistics and premium account
                  information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-4">
                  <li>Profile view count and credit system data</li>
                  <li>Premium subscription status and expiration dates</li>
                  <li>Selected premium plan information</li>
                  <li>Account timestamps (creation and updates)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Activity Logs
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  We log certain activities for security and troubleshooting:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-4">
                  <li>Login and logout activities</li>
                  <li>API requests and response codes</li>
                  <li>Service interactions and method calls</li>
                  <li>Error logs for debugging purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              How We Use Your Information
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>Authenticate your identity through GitHub OAuth</li>
              <li>Calculate activity scores and generate leaderboards</li>
              <li>Display your contribution graphs and statistics</li>
              <li>Provide premium features and manage subscriptions</li>
              <li>Track profile views and manage internal credit systems</li>
              <li>Improve our platform and debug technical issues</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Data Sharing and Disclosure
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We do not sell your personal information. We may share your
              information only in these circumstances:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>
                Public display: Your GitHub activity and statistics are
                displayed publicly on leaderboards and profile pages as part of
                our core functionality
              </li>
              <li>
                Service providers: With hosting and database services necessary
                to operate our platform
              </li>
              <li>
                Legal requirements: When required by law or to protect our
                rights and the safety of our users
              </li>
              <li>
                Business transfers: In connection with a merger, acquisition, or
                sale (with appropriate safeguards)
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Data Security
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We implement security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>Secure OAuth authentication through GitHub</li>
              <li>Database security and access controls</li>
              <li>Regular monitoring and security assessments</li>
              <li>Secure hosting infrastructure</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Data Retention
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We retain your information for as long as necessary to provide our
              services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>
                Profile data: Retained while your account is active and for 30
                days after deletion
              </li>
              <li>
                Activity data: GitHub activity data is refreshed regularly and
                historical data may be retained for analytics purposes
              </li>
              <li>
                Activity logs: System logs are retained for 90 days for security
                and troubleshooting purposes
              </li>
              <li>
                Premium data: Billing and subscription data retained as required
                by law
              </li>
            </ul>
          </section>

          {/* Your Rights and Choices */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Your Rights and Choices
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              You have control over your data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>
                Access: View your stored profile and statistics through your
                dashboard
              </li>
              <li>
                Correction: Update your information through GitHub profile
                changes
              </li>
              <li>
                Deletion: Request account deletion which removes your stored
                data
              </li>
              <li>Revocation: Revoke GitHub access permissions at any time</li>
              <li>Data portability: Request a copy of your stored data</li>
              <li>
                Premium control: Manage or cancel premium subscriptions
                independently
              </li>
            </ul>
          </section>

          {/* GitHub Integration */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              GitHub Integration
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Our GitHub integration works as follows:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>We use GitHub OAuth for secure authentication</li>
              <li>
                We request access to public repositories and user profile
                information
              </li>
              <li>
                We fetch public activity data through GitHub's official API
              </li>
              <li>We respect GitHub's rate limits and terms of service</li>
              <li>
                You can revoke our access through your GitHub account settings
              </li>
              <li>We do not access private repositories or sensitive data</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Cookies and Tracking
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We use cookies and similar technologies for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>Authentication and session management</li>
              <li>Remembering your preferences and settings</li>
              <li>Basic analytics to improve our service</li>
              <li>Security and fraud prevention</li>
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed mt-6">
              You can control cookies through your browser settings, though this
              may affect the functionality of our service.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Third-Party Services
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Our service integrates with the following third-party platforms:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-4">
              <li>
                GitHub: For authentication and accessing your public repository
                data and activity through their official API
              </li>
              <li>
                Cloud hosting providers: For secure data storage and platform
                hosting
              </li>
              <li>
                Analytics services: For basic usage analytics to improve our
                platform
              </li>
              <li>
                Payment processors: For premium subscription billing (when
                applicable)
              </li>
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed mt-6">
              These services have their own privacy policies which govern their
              handling of your data.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Children's Privacy
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Our service is not intended for children under 13 years of age.
              Since we rely on GitHub authentication, users must meet GitHub's
              age requirements. We do not knowingly collect personal information
              from children under 13.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              International Data Transfers
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Your information may be stored and processed in countries where
              our hosting providers operate. We ensure that appropriate
              safeguards are in place to protect your information in accordance
              with this privacy policy.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Changes to This Policy
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              We may update this privacy policy periodically. Material changes
              will be communicated through our platform or via email. We
              encourage you to review this policy regularly to stay informed
              about how we protect your information.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 pt-6">
              Contact Information
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              If you have questions about this privacy policy or how we handle
              your data, please contact us through our support channels or via
              the contact information provided on our website.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
