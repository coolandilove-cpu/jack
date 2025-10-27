import Header from "@/components/header"
import Footer from "@/components/footer"
export default function PrivacyPolicy() {
  return (
    <div className="w-full min-h-screen py-0 bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Jack's Meme Solutions, we collect information you provide directly to us, such as when you create an account, 
              upload memes, or contact us for support. This may include your name, email address, and any content you choose to share.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our meme generation services, 
              communicate with you about your account, and ensure the security of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
              except as described in this policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your personal information. You may also opt out of certain 
              communications from us at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@jackliam.fun" className="text-accent hover:underline">
                privacy@jackliam.fun
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}


