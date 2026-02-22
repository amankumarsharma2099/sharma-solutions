// Single source of truth for Sharma Solutions services (UI + fallback when DB not seeded)

export type ServiceItem = {
  slug: string;
  name: string;
  description: string;
  price: number;
  time: string;
  documentsRequired: string[];
  icon: string;
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    slug: "aadhaar-update",
    name: "Aadhaar Update",
    description:
      "Mobile number update and HOF address-based address correction",
    price: 150,
    time: "1–2 days",
    documentsRequired: [
      "Aadhaar copy",
      "Update form",
      "Mobile OTP",
      "Resident biometric",
    ],
    icon: "id-card",
  },
  {
    slug: "voter-card-services",
    name: "Voter Card Services",
    description:
      "New voter card apply, correction of address, name, father name, mobile number, relation, date of birth",
    price: 200,
    time: "20–30 days",
    documentsRequired: [
      "Voter card copy (for correction only)",
      "Aadhaar card copy",
      "Mobile OTP",
    ],
    icon: "vote",
  },
  {
    slug: "caste-income-residential-certificate",
    name: "Caste, Income & Residential Certificate",
    description:
      "Caste certificate, income certificate, residential certificate etc.",
    price: 200,
    time: "7–25 days",
    documentsRequired: [
      "Sapath patra",
      "Aadhaar copy",
      "Khatiyan copy",
      "Form",
    ],
    icon: "file-text",
  },
  {
    slug: "police-verification",
    name: "Police Verification",
    description: "Police verification certificate",
    price: 200,
    time: "7–15 days",
    documentsRequired: ["Aadhaar copy", "Photo", "Mobile OTP"],
    icon: "shield-check",
  },
  {
    slug: "character-certificate-challan",
    name: "Character Certificate Challan",
    description: "Challan for character certificate",
    price: 150,
    time: "Same day",
    documentsRequired: ["Aadhaar copy", "Mobile number"],
    icon: "award",
  },
  {
    slug: "driving-license-services",
    name: "Driving License Services",
    description:
      "Learner license, driving license, renewal, correction etc.",
    price: 200,
    time: "0–60 days",
    documentsRequired: [
      "Aadhaar copy",
      "Mobile number",
      "Email ID",
      "Blood group",
      "Photo",
      "Signature",
      "Doctor attestation",
    ],
    icon: "car",
  },
  {
    slug: "ration-card-services",
    name: "Ration Card Services",
    description:
      "New ration card, correction, add member, delete member, dealer change etc.",
    price: 200,
    time: "30 days",
    documentsRequired: [
      "Ration card copy",
      "Aadhaar card copy",
      "Mobile OTP",
      "Form",
    ],
    icon: "credit-card",
  },
];

export const FEATURED_SERVICES = [
  SERVICES_LIST[0], // Aadhaar Update
  SERVICES_LIST[1], // Voter Card Services
  SERVICES_LIST[3], // Police Verification
  SERVICES_LIST[5], // Driving License Services
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES_LIST.find((s) => s.slug === slug);
}

export const CSC_CONTACT = {
  phones: ["9304327456", "7488318773"],
  get phone() {
    return this.phones[0];
  },
  email: "digitalshop9877@gmail.com",
  address: "Near DSP HQ, Tata Kandra Main Road, Guest House, Seraikella",
};
