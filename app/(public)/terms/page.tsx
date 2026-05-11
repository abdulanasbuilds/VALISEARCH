export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
        <p className="mb-4 text-sm text-muted-foreground">Last updated: May 11, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using ValiSearch, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">2. Use License</h2>
            <p className="mb-4 text-muted-foreground">
              Permission is granted to temporarily use ValiSearch for personal, non-commercial use only.
            </p>
            <p className="text-muted-foreground">
              You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information obtained from ValiSearch.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">3. User Account</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">4. Subscription and Payments</h2>
            <p className="mb-4 text-muted-foreground">
              Subscriptions are billed monthly. You can cancel at any time. Credits are non-refundable.
            </p>
            <p className="text-muted-foreground">
              We accept payments through Stripe, Flutterwave, Paystack, and Lemon Squeezy. All transactions are processed securely.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">5. Disclaimer</h2>
            <p className="text-muted-foreground">
              ValiSearch provides AI-generated insights for informational purposes only. These insights should not be considered professional advice. Always conduct your own due diligence before making business decisions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              ValiSearch shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">7. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these terms? Email us at hello@valisearch.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}