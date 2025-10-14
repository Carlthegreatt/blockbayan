import StarRating from "@/components/ui/star-rating"
import { Marquee } from "@/components/marquee"

const testimonials = [
  {
    name: "Jhered Republica",
    username: "@red-sakai",
    body: "Blockbayan has revolutionized how I support causes I care about. The transparency of blockchain donations is a game-changer. I can see exactly where my contributions go.",
    img: "/red-sakai.jpg",
    rating: 4.8,
  },
  {
    name: "Carl Blancaflor",
    username: "@carlthegreatt",
    body: "I'm amazed by how easy and secure it is to donate with Blockbayan. Knowing my donations are tracked on the blockchain gives me complete peace of mind.",
    img: "/carlthegreatt.jpg",
    rating: 5,
  },
  {
    name: "Carl Erosa",
    username: "@CarlErosa",
    body: "Our organization started using Blockbayan for fundraising, and the trust it builds with donors is incredible. A must-have for any non-profit.",
    img: "/CarlErosa.jpg",
    rating: 4.9,
  },
  {
    name: "Ezekiel Bustamante",
    username: "@defzeke",
    body: "Blockbayan's platform is seamless. I donated to a local charity in seconds, and the low transaction fees mean more of my money goes to the cause.",
    img: "/defzeke.jpg",
    rating: 4.7,
  },
  {
    name: "Mary Relator",
    username: "@MaryRuth17",
    body: "I found a cause I'm passionate about on Blockbayan and donated instantly. The ability to track my donation's journey is something I've never seen before. Truly innovative.",
    img: "/MaryRuth17.jpg",
    rating: 4.5,
  },
  {
    name: "Marvin Erosa",
    username: "@marvinjameserosa",
    body: "Blockbayan is the future of charitable giving. It's transparent, efficient, and connects donors directly to the impact they're making.",
    img: "/marvinjameserosa.jpg",
    rating: 4.6,
  },
  {
    name: "Tony Stark",
    username: "@j4rv1555",
    body: "As an academic, I appreciate the integrity Blockbayan brings to philanthropy. Blockchain technology ensures every donation is accounted for, fostering a new level of trust.",
    img: "/j4rv1555.jpg",
    rating: 4.2,
  },
  {
    name: "James Doakes",
    username: "@doakes",
    body: "The engineering behind Blockbayan is impressive. It's a robust and secure platform that makes a real-world difference. Proud to be a user.",
    img: "/doakes.png",
    rating: 4.3,
  },
  {
    name: "Jackie Chan",
    username: "@jackie_ch4n",
    body: "Blockbayan makes it simple to support global and local initiatives. It's a powerful tool for anyone who wants to contribute to a better world with confidence.",
    img: "/jackie_ch4n.jpg",
    rating: 4.4,
  },
];
const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

const TestimonialCard = ({
  img,
  name,
  username,
  body,
  rating,
}: {
  img: string
  name: string
  username: string
  body: string
  rating: number
}) => {
  return (
    <div className="relative w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-10 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]">
      <div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-[#e78a53]/10 to-transparent blur-md"></div>

      <StarRating rating={rating} />

      <div className="mt-4 text-white/90 leading-relaxed">{body}</div>

      <div className="mt-5 flex items-center gap-2">
        <img src={img || "/placeholder.svg"} alt={name} height="40" width="40" className="h-10 w-10 rounded-full" />
        <div className="flex flex-col">
          <div className="leading-5 font-medium tracking-tight text-white">{name}</div>
          <div className="leading-5 tracking-tight text-white/60">{username}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="mb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-[540px]">
          <div className="flex justify-center">
            <button
              type="button"
              className="group relative z-[60] mx-auto rounded-full border border-white/20 bg-white/5 px-6 py-1 text-xs backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100 md:text-sm"
            >
              <div className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
              <div className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
              <span className="relative text-white">Testimonials</span>
            </button>
          </div>
          <h2 className="from-foreground/60 via-foreground to-foreground/60 dark:from-muted-foreground/55 dark:via-foreground dark:to-muted-foreground/55 mt-5 bg-gradient-to-r bg-clip-text text-center text-4xl font-semibold tracking-tighter text-transparent md:text-[54px] md:leading-[60px] __className_bb4e88 relative z-10">
            What our users say
          </h2>

          <p className="mt-5 relative z-10 text-center text-lg text-zinc-500">
            From intuitive design to powerful features, our app has become an essential tool for users around the world.
          </p>
        </div>

        <div className="my-16 flex max-h-[738px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <div>
            <Marquee pauseOnHover vertical className="[--duration:20s]">
              {firstColumn.map((testimonial) => (
                <TestimonialCard key={testimonial.username} {...testimonial} />
              ))}
            </Marquee>
          </div>

          <div className="hidden md:block">
            <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
              {secondColumn.map((testimonial) => (
                <TestimonialCard key={testimonial.username} {...testimonial} />
              ))}
            </Marquee>
          </div>

          <div className="hidden lg:block">
            <Marquee pauseOnHover vertical className="[--duration:30s]">
              {thirdColumn.map((testimonial) => (
                <TestimonialCard key={testimonial.username} {...testimonial} />
              ))}
            </Marquee>
          </div>
        </div>

        <div className="-mt-8 flex justify-center">
          <button className="group relative inline-flex items-center gap-2 rounded-full border border-[#e78a53]/30 bg-black/50 px-6 py-3 text-sm font-medium text-white transition-all hover:border-[#e78a53]/60 hover:bg-[#e78a53]/10 active:scale-95">
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-[#e78a53]/40 to-transparent"></div>
            <div className="absolute inset-x-0 -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-[#e78a53]/40 to-transparent"></div>
            <svg className="h-4 w-4 text-[#e78a53]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
            </svg>
            Share your experience
          </button>
        </div>
      </div>
    </section>
  )
}
