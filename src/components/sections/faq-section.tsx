"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FAQSection() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem((prev) => (prev === index ? null : index))
  }

  const faqs = [
    {
      question: "What is blockchain?",
      answer:
        "Blockchain is a digital ledger technology that records transactions in a secure, transparent, and tamper-proof way. Think of it as a shared notebook that everyone can read, but no one can erase or modify past entries. Each transaction is permanently recorded and verified by multiple computers, making it impossible to fake or manipulate donation records.",
    },
    {
      question: "What is BlockBayan?",
      answer:
        "BlockBayan is a blockchain-powered disaster donation platform that eliminates intermediaries and delivers aid to Filipino disaster victims in real-time. It embeds the bayanihan spirit of communal accountability into every transaction, ensuring transparency and efficiency in disaster relief operations.",
    },
    {
      question: "How does blockchain technology help with disaster relief?",
      answer:
        "Blockchain creates immutable, transparent records of every donation. This means you can track exactly where your money goes in real-time, see GPS-tagged proof of aid delivery, and ensure funds reach victims within 24-48 hours instead of 7-21 days. It eliminates corruption and reduces administrative costs by 70%.",
    },
    {
      question: "How can I track my donations?",
      answer:
        "Every donation generates a timestamped ledger entry on the blockchain. Through our mobile and web dashboard, you can trace your peso flows, view GPS-tagged proof of aid, and receive push notifications as funds reach each beneficiary wallet. Complete transparency from donation to delivery.",
    },
    {
      question: "Is my donation secure and transparent?",
      answer:
        "Absolutely. BlockBayan uses blockchain technology to create immutable audit trails that prevent fraud. Every transaction is publicly verifiable, with smart contracts automating fund distribution based on predefined conditions. This addresses the PHP 1 trillion corruption problem through continuous real-time monitoring.",
    },
    {
      question: "How does the community voting system work?",
      answer:
        "Local barangay councils, volunteers, and affected residents join our blockchain-powered voting system to propose and vote on aid allocation priorities. This ensures decisions are made by those on the ground who understand actual needs, preventing centralized mismanagement and embodying true bayanihan spirit.",
    },
    {
      question: "Can overseas Filipinos donate easily?",
      answer:
        "Yes! Overseas Filipino workers can send USDC stablecoins that convert to PHP within minutes, eliminating 5-15% transfer fees and delays. BlockBayan enables instant cross-border transfers, allowing your loved ones back home to receive help immediately during disasters.",
    },
  ]

  return (
    <section id="faq" className="relative overflow-hidden pb-120 pt-24">
      {/* Background blur effects */}
      <div className="bg-primary/20 absolute top-1/2 -right-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>
      <div className="bg-primary/20 absolute top-1/2 -left-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>

      <div className="z-10 container mx-auto px-4">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="border-primary/40 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 uppercase">
            <span>✶</span>
            <span className="text-sm">Faqs</span>
          </div>
        </motion.div>

        <motion.h2
          className="mx-auto mt-6 max-w-xl text-center text-4xl font-medium md:text-[54px] md:leading-[60px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Questions? We've got{" "}
          <span className="bg-gradient-to-b from-foreground via-rose-200 to-primary bg-clip-text text-transparent">
            answers
          </span>
        </motion.h2>

        <div className="mx-auto mt-12 flex max-w-xl flex-col gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="from-secondary/40 to-secondary/10 rounded-2xl border border-white/10 bg-gradient-to-b p-6 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset] transition-all duration-300 hover:border-white/20 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleItem(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggleItem(index)
                }
              }}
              {...(index === faqs.length - 1 && { "data-faq": faq.question })}
            >
              <div className="flex items-start justify-between">
                <h3 className="m-0 font-medium pr-4">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openItem === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className=""
                >
                  {openItem === index ? (
                    <Minus className="text-primary flex-shrink-0 transition duration-300" size={24} />
                  ) : (
                    <Plus className="text-primary flex-shrink-0 transition duration-300" size={24} />
                  )}
                </motion.div>
              </div>
              <AnimatePresence>
                {openItem === index && (
                  <motion.div
                    className="mt-4 text-muted-foreground leading-relaxed overflow-hidden"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                      opacity: { duration: 0.2 },
                    }}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
