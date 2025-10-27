import Header from "@/components/header"
import Footer from "@/components/footer"
export default function TermsOfService() {
  return (
    <div className="w-full min-h-screen py-0 bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Jack's Meme Solutions, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily use Jack's Meme Solutions for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for any content you upload, create, or share through our platform. You agree not to upload 
              content that is illegal, harmful, threatening, abusive, or violates any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prohibited Uses</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. 
              You may not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The service and its original content, features, and functionality are and will remain the exclusive property 
              of Jack's Meme Solutions and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
              Jack's Meme Solutions excludes all representations, warranties, conditions and terms relating to our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@jackliam.fun" className="text-accent hover:underline">
                legal@jackliam.fun
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}


