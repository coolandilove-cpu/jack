import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle, HelpCircle, Bug, Lightbulb } from "lucide-react"

export default function Support() {
  return (
    <div className="w-full min-h-screen py-0 bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
            Support Center
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Need help with Jack's Meme Solutions? We're here to make your meme creation experience as smooth as possible!
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <HelpCircle className="h-8 w-8 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Find quick answers to common questions about using our platform.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <MessageCircle className="h-8 w-8 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Chat with our support team in real-time for immediate assistance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Bug className="h-8 w-8 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">Report Bug</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Found a bug? Let us know so we can fix it quickly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Lightbulb className="h-8 w-8 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">Feature Request</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Have an idea? We'd love to hear your suggestions!
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <Input id="subject" placeholder="What can we help you with?" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your question or issue..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Other Ways to Reach Us</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-accent" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    For general inquiries and support:
                  </p>
                  <a href="mailto:support@jackliam.fun" className="text-accent hover:underline">
                    support@jackliam.fun
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-accent" />
                    Technical Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    For technical problems and bugs:
                  </p>
                  <a href="mailto:tech@jackliam.fun" className="text-accent hover:underline">
                    tech@jackliam.fun
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    Business Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    For partnerships and business opportunities:
                  </p>
                  <a href="mailto:business@jackliam.fun" className="text-accent hover:underline">
                    business@jackliam.fun
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-card border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-3">Response Time</h3>
              <p className="text-muted-foreground">
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent technical issues, please mark your email as "URGENT" in the subject line.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


