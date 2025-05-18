"use client"

import { useState } from "react"
import { MessageCircleQuestionIcon as QuestionMarkCircle, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is NAPS?",
    answer:
      "NAPS (Navigate and Plan Smartly) is a financial education platform designed to help college students learn about personal finance, fraud protection, and money management in an engaging way.",
  },
  {
    question: "How do I earn gems?",
    answer:
      "You can earn gems by completing lessons, daily challenges, quizzes, participating in the community, and identifying fraudulent transactions. Gems track your progress and unlock advanced content.",
  },
  {
    question: "What is a streak?",
    answer:
      "A streak represents consecutive days of activity on the platform. Maintaining a streak by completing at least one activity daily earns you bonus gems and keeps your learning momentum going.",
  },
  {
    question: "How do I report suspicious activity?",
    answer:
      "If you notice suspicious activity in your account, select the transaction in the 'Spot the Fraud' challenge or contact our support team through the Virtual Assistant in the bottom right corner.",
  },
  {
    question: "Can I reset my progress?",
    answer:
      "Currently, there's no option to reset your progress. However, you can revisit any completed lessons or challenges to refresh your knowledge at any time.",
  },
  {
    question: "How do I create a budget?",
    answer:
      "Navigate to the Learn section and complete the 'Budgeting Basics' learning path. You'll find step-by-step guides and interactive tools to create and maintain your personal budget.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Yes, we take security seriously. All your financial data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the Virtual Assistant chat feature in the bottom right corner of the screen, or by emailing support@naps-finance.com.",
  },
  {
    question: "Can I suggest new features?",
    answer:
      "We welcome user feedback and suggestions. Use the feedback section at the bottom of the homepage or contact us through the Virtual Assistant.",
  },
  {
    question: "Are there mobile apps available?",
    answer:
      "We're currently developing mobile apps for iOS and Android. In the meantime, our website is fully responsive and works great on mobile browsers.",
  },
]

export function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <Button
        className="fixed bottom-6 left-6 h-14 w-14 rounded-full bg-cyber-primary text-black shadow-lg hover:bg-cyber-primary/90 z-50"
        onClick={() => setIsOpen(true)}
      >
        <QuestionMarkCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[80vh] bg-cyber-dark border border-cyber-primary/30 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-cyber-primary/20">
              <h3 className="text-xl font-bold text-cyber-primary">Help Guide & FAQs</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 border-b border-cyber-primary/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  className="pl-10 bg-black/50 border-cyber-primary/30 focus-visible:ring-cyber-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-cyber-primary/20 rounded-md overflow-hidden bg-black/30"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-cyber-primary/5 hover:no-underline">
                        <span className="text-left font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 text-muted-foreground border-t border-cyber-primary/10">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  <Button variant="link" className="text-cyber-primary mt-2" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-cyber-primary/20 bg-black/30">
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? Contact our support team through the Virtual Assistant.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
