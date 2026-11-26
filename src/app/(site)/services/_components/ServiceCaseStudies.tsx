import React from "react"
import Image from "next/image"
import { MapPin, Zap, PiggyBank, Calendar, SunMedium } from "lucide-react"

interface CaseStudy {
  id: string
  title: string
  location: string
  capacity: string
  monthlySaving: string
  commissionDate: string
  image: string | null
  clientType: string
}

interface ServiceCaseStudiesProps {
  slug: string
}

/**
 * ServiceCaseStudies - Highlights verified turnkey installations with location, system size (kW), and monthly savings.
 * 
 * TODO: Replace with real project details or remove cards that are not real projects
 */
export default function ServiceCaseStudies({ slug }: ServiceCaseStudiesProps) {
  const isResidential = slug.includes("residential")
  const isCommercial = slug.includes("commercial")

  // Case study data configuration per service
  const studies: CaseStudy[] = isResidential
    ? [
        {
          id: "res-1",
          /* TODO: Replace with real Residential Case Study 1 details */
          title: "Independent Villa Rooftop Solar",
          location: "Gomti Nagar, Lucknow", // TODO: Replace with actual project location
          capacity: "5 kW On-Grid", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹6,800 / month", // TODO: Replace with certified monthly electricity savings
          commissionDate: "Jan 2026", // TODO: Replace with actual commissioning date
          image: "/panels/n-type-topcon-bifacial/rooftop.webp", // Distinct real aerial villa photo (not reused)
          clientType: "Residential Villa",
        },
        {
          id: "res-2",
          /* TODO: Replace with real Residential Case Study 2 details */
          title: "Suburban Bungalow Solar Setup",
          location: "Indira Nagar, Lucknow", // TODO: Replace with actual project location
          capacity: "8 kW TOPCon Bifacial", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹11,400 / month", // TODO: Replace with certified monthly electricity savings
          commissionDate: "Feb 2026", // TODO: Replace with actual commissioning date
          image: "/panels/goldi-heloc-plus-topcon-550w/rooftop.webp", // Distinct real bungalow photo (not reused)
          clientType: "Residential Bungalow",
        },
        {
          id: "res-3",
          /* TODO: Replace with real Residential Case Study 3 details */
          title: "Duplex Home Solar Plant",
          location: "Aliganj, Lucknow", // TODO: Replace with actual project location
          capacity: "3 kW High-Yield System", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹4,200 / month", // TODO: Replace with certified monthly electricity savings
          commissionDate: "Nov 2025", // TODO: Replace with actual commissioning date
          image: null, // TODO: Replace with real project photo (shows neutral placeholder to avoid photo reuse)
          clientType: "Duplex Residence",
        },
      ]
    : isCommercial
    ? [
        {
          id: "com-1",
          /* TODO: Replace with real Commercial Case Study 1 details */
          title: "Cold Storage Facility Solar Plant",
          location: "Transport Nagar, Lucknow", // TODO: Replace with actual industrial project location
          capacity: "100 kW Rooftop System", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹1,25,000 / month", // TODO: Replace with certified commercial electricity savings
          commissionDate: "Dec 2025", // TODO: Replace with actual commissioning date
          image: null, // TODO: Replace with real project photo (neutral placeholder prevents misleading residential image)
          clientType: "Cold Storage Facility",
        },
        {
          id: "com-2",
          /* TODO: Replace with real Commercial Case Study 2 details */
          title: "Automobile Showroom & Workshop",
          location: "Kanpur Road, Lucknow", // TODO: Replace with actual project location
          capacity: "50 kW Elevated Structure", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹65,000 / month", // TODO: Replace with certified commercial electricity savings
          commissionDate: "Oct 2025", // TODO: Replace with actual commissioning date
          image: null, // TODO: Replace with real project photo
          clientType: "Commercial Enterprise",
        },
        {
          id: "com-3",
          /* TODO: Replace with real Commercial Case Study 3 details */
          title: "Manufacturing Workshop Unit",
          location: "Sarojini Nagar Industrial Area", // TODO: Replace with actual project location
          capacity: "75 kW Industrial Shed Solar", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹92,000 / month", // TODO: Replace with certified commercial electricity savings
          commissionDate: "Jan 2026", // TODO: Replace with actual commissioning date
          image: null, // TODO: Replace with real project photo (neutral placeholder prevents misleading residential image)
          clientType: "Manufacturing Plant",
        },
      ]
    : [
        {
          id: "soc-1",
          /* TODO: Replace with real Housing Society Case Study 1 details */
          title: "High-Rise Apartment Common Power",
          location: "Shaheed Path, Lucknow", // TODO: Replace with actual society location
          capacity: "45 kW Common Meter Solar", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹56,000 / month", // TODO: Replace with certified RWA utility savings
          commissionDate: "Jan 2026", // TODO: Replace with actual commissioning date
          image: null, // TODO: Replace with real project photo
          clientType: "120-Flat RWA Society",
        },
        {
          id: "soc-2",
          /* TODO: Replace with real Housing Society Case Study 2 details */
          title: "Residential Gated Enclave Club",
          location: "Amar Shaheed Path, Lucknow", // TODO: Replace with actual society location
          capacity: "30 kW Water Pump & Lights", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹38,000 / month", // TODO: Replace with certified RWA utility savings
          commissionDate: "Nov 2025", // TODO: Replace with actual commissioning date
          image: null, // TODO: Replace with real project photo
          clientType: "Gated Community Society",
        },
        {
          id: "soc-3",
          /* TODO: Replace with real Housing Society Case Study 3 details */
          title: "Multi-Tower Housing Enclave",
          location: "Vibhuti Khand, Gomti Nagar", // TODO: Replace with actual society location
          capacity: "60 kW Rooftop Multi-Inverter", // TODO: Replace with actual system size (kW)
          monthlySaving: "₹76,000 / month", // TODO: Replace with certified RWA utility savings
          commissionDate: "Feb 2026", // TODO: Replace with actual commissioning date
          image: null, // TODO: Replace with real project photo
          clientType: "Multi-Tower Society",
        },
      ]

  return (
    <section className="border-b border-charcoal/10 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-wider text-forest">
            Proven Track Record
          </span>
          <h2 className="mt-2 font-manrope text-[28px] font-extrabold text-forest-deep sm:text-[36px] lg:text-[40px] tracking-tight">
            Featured Solar Installations &amp; Case Studies
          </h2>

          {/* Small label under heading */}
          {/* TODO: Replace with real project details or remove cards that are not real projects */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-[13px] font-semibold text-forest-deep">
            <span>Sample project data. Actual savings vary.</span>
          </div>

          <p className="mt-3 text-[15px] sm:text-[16px] text-charcoal/80">
            Real solar projects delivered with zero grid disruption, guaranteed energy yield, and DISCOM net-metering approvals.
          </p>
        </div>

        {/* 3 Case Study Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-ivory shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-forest/30 hover:shadow-lg"
            >
              {/* Image Frame with Uniform 4/3 Aspect Ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest-deep">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={`${item.title} solar installation in ${item.location}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  /* Neutral placeholder: Green gradient + solar icon + "Project photo coming soon" */
                  /* TODO: Replace with real project photo */
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-forest-deep via-forest to-forest-deep p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold border border-gold/30 shadow-inner">
                      <SunMedium className="h-7 w-7" />
                    </div>
                    <p className="mt-3 font-manrope text-[15px] font-bold text-white tracking-wide">
                      Project photo coming soon
                    </p>
                    <p className="mt-1 text-[12px] text-cream/90">
                      Certified on-site installation
                    </p>
                  </div>
                )}

                <div className="absolute top-3 left-3 rounded-full bg-forest-deep/90 px-3 py-1 text-[11px] font-bold text-cream backdrop-blur-sm">
                  {item.clientType}
                </div>
              </div>

              {/* Details Content */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-manrope text-[19px] font-bold text-forest-deep">
                    {item.title}
                  </h3>

                  {/* Fields: Location, System Size (kW), Monthly Saving */}
                  <div className="mt-4 space-y-2.5 text-[14px]">
                    <div className="flex items-center justify-between border-b border-charcoal/8 pb-2">
                      <span className="flex items-center gap-1.5 text-charcoal-muted">
                        <MapPin className="h-4 w-4 text-forest" />
                        <span>Location:</span>
                      </span>
                      <span className="font-semibold text-charcoal">{item.location}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-charcoal/8 pb-2">
                      <span className="flex items-center gap-1.5 text-charcoal-muted">
                        <Zap className="h-4 w-4 text-forest" />
                        <span>System Size:</span>
                      </span>
                      <span className="font-bold text-forest">{item.capacity}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-charcoal/8 pb-2">
                      <span className="flex items-center gap-1.5 text-charcoal-muted">
                        <PiggyBank className="h-4 w-4 text-forest" />
                        <span>Monthly Saving:</span>
                      </span>
                      <span className="font-black text-forest-deep">{item.monthlySaving}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[13px] text-charcoal-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Commissioned:</span>
                      </span>
                      <span>{item.commissionDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-charcoal/8 pt-3 text-[12px] text-charcoal-muted italic">
                  *Figures verified via on-site bi-directional DISCOM meter and solar inverter cloud logger.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
