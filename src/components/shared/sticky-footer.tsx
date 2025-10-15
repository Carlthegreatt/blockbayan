"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function StickyFooter() {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const isNearBottom = scrollTop + windowHeight >= documentHeight - 100

          setIsAtBottom(isNearBottom)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isAtBottom && (
        <motion.footer
          className="fixed z-50 bottom-0 left-0 w-full"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="bg-[#e78a53]/80 backdrop-blur-sm text-[#121113] py-12 px-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-3xl font-bold mb-4">Blockbayan</h2>
                <p className="text-black/80 max-w-md">
                  Revolutionizing charitable giving through the power of blockchain. Transparent, secure, and global.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="hover:text-black/80 transition-colors">Features</a></li>
                  <li><a href="#testimonials" className="hover:text-black/80 transition-colors">Testimonials</a></li>
                  <li><a href="#faq" className="hover:text-black/80 transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-black/80 transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-black/80 transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-black/80 transition-colors">Facebook</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-black/20 pt-6 text-center text-black/70">
              <p>&copy; {new Date().getFullYear()} Blockbayan. All rights reserved.</p>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  )
}
