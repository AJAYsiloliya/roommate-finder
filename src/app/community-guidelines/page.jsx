export default function CommunityGuidelines() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            Community & Safety
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Community Guidelines
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-6">

          <GuidelineSection title="1. Treat Everyone With Respect">
            <p>
              RoommateFinder is intended to help people connect and
              communicate about shared living. Treat other users with
              respect and communicate politely.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Be respectful during conversations.</li>
              <li>Avoid insulting or abusive language.</li>
              <li>Respect other users' boundaries.</li>
              <li>Do not harass or threaten other users.</li>
            </ul>
          </GuidelineSection>

          <GuidelineSection title="2. Use Real and Accurate Information">
            <p>
              Profiles should represent the person using the account.
              Providing accurate information helps create a more reliable
              roommate community.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Do not impersonate another person.</li>
              <li>Do not create misleading profiles.</li>
              <li>Use an appropriate profile photo.</li>
              <li>
                Keep important profile information reasonably accurate.
              </li>
            </ul>
          </GuidelineSection>

          <GuidelineSection title="3. No Harassment or Abuse">
            <p>
              Harassment, intimidation, threats, bullying, or repeated
              unwanted communication are not allowed on RoommateFinder.
            </p>
          </GuidelineSection>

          <GuidelineSection title="4. No Scams or Fraud">
            <p>
              Do not use RoommateFinder to deceive other users or request
              money through fraudulent schemes.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Do not create fake accommodation listings.</li>
              <li>Do not impersonate landlords or other individuals.</li>
              <li>Do not send fraudulent payment requests.</li>
              <li>Do not use the platform for scams.</li>
            </ul>
          </GuidelineSection>

          <GuidelineSection title="5. Protect Your Personal Information">
            <p>
              Be careful about the information you share with other users.
              Avoid publicly sharing passwords, financial information,
              government identification numbers, or other sensitive data.
            </p>
          </GuidelineSection>

          <GuidelineSection title="6. Responsible Communication">
            <p>
              Use messaging features for genuine roommate-related
              conversations.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Do not send spam.</li>
              <li>
                Do not repeatedly contact someone who does not want to
                communicate.
              </li>
              <li>Do not send misleading or deceptive messages.</li>
              <li>Keep conversations relevant and respectful.</li>
            </ul>
          </GuidelineSection>

          <GuidelineSection title="7. Respectful Roommate Matching">
            <p>
              Roommate preferences can differ from person to person. Use the
              available profile information responsibly and communicate
              respectfully when preferences do not match.
            </p>
          </GuidelineSection>

          <GuidelineSection title="8. Report Problems">
            <p>
              If you encounter a profile, message, or behaviour that appears
              to violate these guidelines, use the available reporting or
              contact options to notify RoommateFinder.
            </p>
          </GuidelineSection>

          <GuidelineSection title="9. Account Actions">
            <p>
              Accounts or content that violate these Community Guidelines,
              the Terms & Conditions, or applicable law may be restricted,
              suspended, or removed.
            </p>
          </GuidelineSection>

          <GuidelineSection title="10. Stay Safe">
            <p>
              When communicating with someone you do not know, use good
              judgment and protect your personal information. Before making
              any housing or financial arrangement, independently verify the
              relevant details.
            </p>
          </GuidelineSection>

          <GuidelineSection title="11. Updates to These Guidelines">
            <p>
              These Community Guidelines may be updated as RoommateFinder
              grows and platform policies change. Updated guidelines will be
              published on this page.
            </p>
          </GuidelineSection>

        </div>
      </div>
    </main>
  );
}

function GuidelineSection({ title, children }) {
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