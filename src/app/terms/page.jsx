export default function Terms() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            Terms & Rules
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-6">

          <TermsSection title="1. Introduction">
            <p>
              These Terms & Conditions govern your use of RoommateFinder.
              By accessing or using the platform, you agree to follow these
              terms.
            </p>

            <p className="mt-3">
              If you do not agree with these terms, please do not use
              RoommateFinder.
            </p>
          </TermsSection>

          <TermsSection title="2. Using RoommateFinder">
            <p>
              RoommateFinder is a platform that helps users discover potential
              roommates and flatmates based on information and preferences
              provided by users.
            </p>

            <p className="mt-3">
              RoommateFinder does not guarantee that a particular roommate,
              property, accommodation, or connection will be suitable for you.
            </p>
          </TermsSection>

          <TermsSection title="3. User Accounts">
            <p>
              You are responsible for maintaining the security of your account
              and for the information you provide.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Provide accurate information when creating your account.</li>
              <li>Do not create accounts using someone else's identity.</li>
              <li>Do not share your account password with others.</li>
              <li>
                Notify us if you believe your account has been misused.
              </li>
            </ul>
          </TermsSection>

          <TermsSection title="4. Profiles and User Content">
            <p>
              You are responsible for the information, photos, descriptions,
              and other content you add to your profile.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Do not intentionally provide misleading information.</li>
              <li>Do not upload content that violates applicable laws.</li>
              <li>Do not impersonate another person.</li>
              <li>Do not upload another person's private information.</li>
            </ul>
          </TermsSection>

          <TermsSection title="5. Messaging and Communication">
            <p>
              RoommateFinder may provide messaging features so users can
              communicate with potential roommates.
            </p>

            <p className="mt-3">
              Users are responsible for their own conversations and should
              avoid sharing passwords, financial information, or other
              sensitive personal information.
            </p>
          </TermsSection>

          <TermsSection title="6. Prohibited Activities">
            <p>
              You must not use RoommateFinder to:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Harass, threaten, or abuse other users.</li>
              <li>Send spam or misleading messages.</li>
              <li>Operate scams or fraudulent schemes.</li>
              <li>Create fake or misleading profiles.</li>
              <li>Attempt to access another user's account.</li>
              <li>
                Interfere with the security or operation of the platform.
              </li>
              <li>Use the platform for unlawful purposes.</li>
            </ul>
          </TermsSection>

          <TermsSection title="7. Roommates and Accommodation">
            <p>
              Information provided by users about locations, budgets,
              accommodation, or living arrangements may not always be
              accurate or up to date.
            </p>

            <p className="mt-3">
              Users should independently verify important information before
              making decisions or entering into any rental or living
              arrangement.
            </p>
          </TermsSection>

          <TermsSection title="8. Platform Availability">
            <p>
              We may modify, update, suspend, or discontinue parts of
              RoommateFinder from time to time for maintenance, security,
              improvements, or other reasons.
            </p>

            <p className="mt-3">
              We do not guarantee that the platform will always be available
              without interruption or errors.
            </p>
          </TermsSection>

          <TermsSection title="9. Account Restrictions">
            <p>
              We may restrict or suspend an account when there is a violation
              of these Terms & Conditions, Community Guidelines, or applicable
              law.
            </p>
          </TermsSection>

          <TermsSection title="10. Third-Party Services">
            <p>
              RoommateFinder may rely on third-party services for features such
              as authentication, data storage, and image hosting. Their own
              terms and policies may also apply when you use those services.
            </p>
          </TermsSection>

          <TermsSection title="11. Limitation of Responsibility">
            <p>
              RoommateFinder provides a platform for users to discover and
              communicate with potential roommates. Users are responsible for
              evaluating information and making their own decisions about
              roommates, accommodation, and arrangements.
            </p>
          </TermsSection>

          <TermsSection title="12. Changes to These Terms">
            <p>
              We may update these Terms & Conditions from time to time.
              Updated terms will be published on this page with a revised
              date.
            </p>
          </TermsSection>

          <TermsSection title="13. Contact Us">
            <p>
              If you have questions about these Terms & Conditions, please
              contact RoommateFinder through the Contact page.
            </p>
          </TermsSection>

        </div>
      </div>
    </main>
  );
}

function TermsSection({ title, children }) {
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