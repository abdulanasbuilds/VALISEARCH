export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-4 text-sm text-muted-foreground">Last updated: May 11, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">1. Information We Collect</h2>
            <p className="mb-4 text-muted-foreground">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Account information (email, name)</li>
              <li>Startup ideas you submit for analysis</li>
              <li>Payment information (processed by third parties)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">2. How We Use Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">3. Data Storage</h2>
            <p className="text-muted-foreground">
              Your data is stored securely using Supabase. We implement appropriate technical and organizational measures to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">4. Third-Party Services</h2>
            <p className="mb-4 text-muted-foreground">
              We use third-party services for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Payment processing (Stripe, Flutterwave, Paystack, Lemon Squeezy)</li>
              <li>AI model access (OpenRouter)</li>
              <li>Web search (Jina AI)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">5. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information. Contact us at hello@valisearch.ai to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">6. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">7. Contact</h2>
            <p className="text-muted-foreground">
              Questions about this privacy policy? Email us at hello@valisearch.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}