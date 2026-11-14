/**
 * Section 9: Verified Customer Testimonials
 */
import { Star, ShieldCheck, Quote, Building2, Home, Users } from "lucide-react"

const testimonials = [
  {
    name: "Rajesh K. Sharma",
    role: "Homeowner, Jaipur",
    category: "Residential Solar",
    capacity: "5 kW Rooftop System",
    savings: "85% Bill Reduction",
    icon: Home,
    quote:
      "Our summer electricity bills used to touch ₹11,000 every month due to AC usage. After AG POWER installed our 5kW Mono PERC system with net-metering, our monthly bill dropped under ₹1,400. The subsidy processing was smooth and completely handled by their team.",
  },
  {
    name: "Vikram Singhania",
    role: "Managing Director, Apex Plastics",
    category: "Commercial Solar",
    capacity: "45 kW Industrial Plant",
    savings: "₹52,000/month saved",
    icon: Building2,
    quote:
      "We were concerned about rooftop structural load and production downtime during installation. AG POWER's structural engineers completed the entire 45kW installation without interrupting our factory operations. Excellent engineering and clear ROI.",
  },
  {
    name: "Ashok Vardhan",
    role: "President, Silver Crest RWA",
    category: "Housing Society Solar",
    capacity: "25 kW Society Setup",
    savings: "Common Maintenance Slashed",
    icon: Users,
    quote:
      "Running lifts, water pumps, and corridor lights was a huge drain on our society maintenance fund. AG POWER provided a clear presentation to our committee, handled DISCOM sanctions, and delivered our 25kW system on schedule.",
  },
]

export default function Testimonials() {
  return (
    <section className="bg-sage-mist/60 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-forest sm:text-[42px]">
            Trusted by Homeowners & Businesses
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            Real results from verified rooftop solar installations across residential, commercial, and housing society projects.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((test, idx) => {
            const Icon = test.icon
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-forest/20" />
                  </div>

                  {/* Project Tag */}
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-ivory px-2.5 py-1 text-[11px] font-bold text-forest">
                    <Icon className="h-3 w-3" />
                    <span>{test.category} · {test.capacity}</span>
                  </div>

                  {/* Quote Body */}
                  <p className="mt-4 text-[14px] leading-relaxed text-charcoal/90 italic">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                {/* Footer Info */}
                <div className="mt-6 border-t border-charcoal/8 pt-4">
                  <p className="font-manrope text-[15px] font-bold text-forest">
                    {test.name}
                  </p>
                  <p className="text-[12px] text-charcoal-muted">
                    {test.role}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-forest">
                    <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                    <span>Result: {test.savings}</span>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
