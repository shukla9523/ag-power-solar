/**
 * Central Configuration for Solar Calculator & PM Surya Ghar Subsidy
 * 
 * All tariff rates, generation assumptions, and government subsidy slabs are
 * centrally configured here. Modify these values when DISCOM tariffs or MNRE
 * guidelines update.
 */

export interface SubsidyTier {
  minKw: number
  maxKw?: number
  subsidyInr: number
}

export const CALCULATOR_CONFIG = {
  // Default geographic location
  defaultCity: "Jaipur",
  defaultState: "Rajasthan",
  defaultPincode: "302020",

  // Electricity Tariff Defaults (INR per kWh)
  tariffDefaults: {
    residential: 7.5,
    commercial: 10.5,
    society: 8.5,
  },

  // Daily and monthly solar generation per installed kW in India
  generation: {
    dailyUnitsPerKw: 4.16,      // 4.16 kWh / day / kW
    monthlyUnitsPerKw: 125,     // ~125 kWh / month / kW
    annualDegradationRate: 0.007, // 0.7% annual solar panel degradation
    tariffInflationRate: 0.03,    // 3% annual electricity tariff inflation
  },

  // Turnkey EPC Capital Cost benchmark per kW (INR)
  costPerKw: {
    residential: 58000,
    commercial: 50000,
    society: 53000,
  },

  // High-efficiency module specifications
  standardPanelWattage: 550, // 550W N-Type TOPCon / Mono PERC
  sqFtPerKw: {
    flat_rcc: 85,
    slanted_metal: 75,
    tiled: 90,
  },

  // PM Surya Ghar Muft Bijli Yojana Central Financial Assistance (Subsidy)
  pmSuryaGharSubsidy: {
    residential: [
      { minKw: 1, maxKw: 1.99, subsidyInr: 30000 },
      { minKw: 2, maxKw: 2.99, subsidyInr: 60000 },
      { minKw: 3, maxKw: Infinity, subsidyInr: 78000 },
    ] as SubsidyTier[],
    societyPerKw: 18000, // Up to 500 kW for common utility
  },

  // Disclaimer text in Hindi & English
  disclaimers: {
    hi: "यह गणना केवल एक सांकेतिक अनुमान (indicative estimate) है। वास्तविक क्षमता, सब्सिडी और बचत फिजिकल साइट सर्वे और DISCOM नेट-मीटरिंग अप्रूवल के बाद अंतिम रूप से तय होती है।",
    en: "This calculation is an indicative estimate based on typical solar irradiance and DISCOM norms. Final plant capacity, subsidy sanction, and savings depend on physical roof inspection and net-metering approvals.",
  },
}
