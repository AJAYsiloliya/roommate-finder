export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-4xl">

        <div className="mb-10">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            Privacy & Security
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-6">

          <PolicySection title="1. Introduction">
            <p>
              Welcome to RoommateFinder. This Privacy Policy explains how
              information may be collected, used, stored, and protected when
              you use our platform to find roommates and flatmates.
            </p>

            <p className="mt-3">
              By using RoommateFinder, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p>
              Depending on how you use RoommateFinder, we may collect
              information such as:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Name and account information</li>
              <li>Email address</li>
              <li>Age and gender information provided in your profile</li>
              <li>City and area</li>
              <li>Budget and occupation</li>
              <li>Food and lifestyle preferences</li>
              <li>Profile photo, if provided</li>
              <li>Messages sent through the platform</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Use Information">
            <p>
              Information may be used to provide and improve RoommateFinder's
              features, including:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Creating and managing your account</li>
              <li>Displaying your roommate profile</li>
              <li>Helping users search for potential roommates</li>
              <li>Providing messaging functionality</li>
              <li>Improving platform functionality and user experience</li>
              <li>Maintaining platform security</li>
              <li>Responding to support requests</li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Profile Information">
            <p>
              Information that you add to your roommate profile may be visible
              to other users of RoommateFinder. Only add information that you
              are comfortable sharing with other users.
            </p>

            <p className="mt-3">
              Avoid sharing sensitive personal information such as passwords,
              financial information, government identification numbers, or
              private contact details in your public profile.
            </p>
          </PolicySection>

          <PolicySection title="5. Messages">
            <p>
              RoommateFinder provides messaging features that allow users to
              communicate with potential roommates. Messages may be stored as
              part of the platform's messaging functionality.
            </p>

            <p className="mt-3">
              Do not share passwords, financial information, or other highly
              sensitive information through messages.
            </p>
          </PolicySection>

          <PolicySection title="6. Authentication and Service Providers">
            <p>
              RoommateFinder may use third-party services to provide features
              such as authentication, database storage, and image hosting.
            </p>

            <p className="mt-3">
              These services may process information according to their own
              privacy policies and terms.
            </p>
          </PolicySection>

          <PolicySection title="7. Data Security">
            <p>
              We take reasonable steps to protect information handled through
              RoommateFinder. However, no internet-based service can guarantee
              complete security of information.
            </p>

            <p className="mt-3">
              Users should also take appropriate precautions when sharing
              information online.
            </p>
          </PolicySection>

          <PolicySection title="8. Data Retention">
            <p>
              Information may be retained for as long as necessary to provide
              the platform's services, maintain accounts, meet legal
              requirements, resolve disputes, and protect the platform.
            </p>
          </PolicySection>

          <PolicySection title="9. Your Choices">
            <p>
              Depending on the available features, you may be able to update
              or remove information from your profile through your account.
            </p>

            <p className="mt-3">
              If you need help with your account or personal information, you
              can contact RoommateFinder through the Contact page.
            </p>
          </PolicySection>

          <PolicySection title="10. Children's Privacy">
            <p>
              RoommateFinder is intended for users who meet the minimum age
              requirements applicable to the service. We do not knowingly
              collect personal information from children who are not permitted
              to use the platform.
            </p>
          </PolicySection>

          <PolicySection title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be reflected on this page along with an updated revision date.
            </p>
          </PolicySection>

          <PolicySection title="12. Contact Us">
            <p>
              If you have questions about this Privacy Policy or how
              information is handled, please contact us through the
              RoommateFinder Contact page.
            </p>
          </PolicySection>

        </div>
      </div>
    </main>
  );
}

function PolicySection({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      <div className="mt-4 text-sm leading-7 text-slate-600">
        {children}
      </div>
    </section>
  );
}