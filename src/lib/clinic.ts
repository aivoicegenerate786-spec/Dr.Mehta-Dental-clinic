export const CLINIC = {
  name: "Dr. Mehta's Dental Care",
  short: "Dr. Mehta's",
  phoneDisplay: "+91 94285 63659",
  phoneHref: "tel:+919428563659",
  whatsapp: "919428563659",
  email: "drmehtasdentalcare12@gmail.com",
  addressLines: [
    "C/106 Janpath Society, Ghodasar Canal Garden Road",
    "Near Aavkar Hall, Maninagar",
    "Ahmedabad, Gujarat 380050",
  ],
  mapsLink: "https://maps.app.goo.gl/gLAgJm7Dcf8kycdF9",
  mapsEmbed:
    "https://www.google.com/maps?q=Dr+Mehta%27s+Dental+Care,+Janpath+Society,+Maninagar,+Ahmedabad&output=embed",
  instagram: "https://www.instagram.com/drmehtadentalcare",
  facebook: "https://www.facebook.com/drmehtadentalcare",
  since: 2012,
};

export const STATS = [
  { value: 14, suffix: "", label: "Years of practice" },
  { value: 20000, suffix: "+", label: "Patients treated" },
  { value: 1000, suffix: "+", label: "Implants placed" },
  { value: 500, suffix: "+", label: "Smile designs" },
];

/** 0 = Sunday ... 6 = Saturday. Times in 24h "HH:MM". */
export const HOURS: { day: string; open?: string; close?: string }[] = [
  { day: "Sunday" },
  { day: "Monday", open: "09:00", close: "18:00" },
  { day: "Tuesday", open: "09:00", close: "18:00" },
  { day: "Wednesday", open: "09:00", close: "18:00" },
  { day: "Thursday", open: "09:00", close: "18:00" },
  { day: "Friday", open: "09:00", close: "18:00" },
  { day: "Saturday", open: "09:00", close: "14:00" },
];

export type Treatment = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  image: string;
  duration: string;
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "smile-design",
    title: "Smile Design",
    kicker: "Cosmetic",
    summary:
      "A smile planned around your face, not a template. We map proportions, shade and gum line digitally, then preview the result before a single tooth is touched.",
    points: ["Digital smile preview", "Porcelain veneers", "Gum contouring"],
    image: "/img/case-smile-makeover.webp",
    duration: "2 to 3 visits",
  },
  {
    slug: "dental-implants",
    title: "Dental Implants",
    kicker: "Restorative",
    summary:
      "Single tooth, full mouth or implant-supported dentures, placed by a FICOI (USA) fellow. Fixed teeth that look, feel and chew like your own.",
    points: ["Single tooth implants", "Full mouth rehabilitation", "Implant-supported dentures"],
    image: "/img/clinic-doctor-at-work.webp",
    duration: "Planned in stages",
  },
  {
    slug: "root-canal",
    title: "Root Canal Treatment",
    kicker: "Endodontics",
    summary:
      "Single and multiple canal treatments, and re-treatments, done under local anaesthesia so the tooth is saved and the pain stops, often in a single sitting.",
    points: ["Single sitting options", "Re-treatment of old RCTs", "Zirconia crowns"],
    image: "/img/clinic-treatment.webp",
    duration: "1 to 2 visits",
  },
  {
    slug: "aligners-braces",
    title: "Aligners and Braces",
    kicker: "Orthodontics",
    summary:
      "Clear aligners for adults who want straighter teeth without metal, and traditional braces when they are the better choice. You get an honest recommendation.",
    points: ["Clear aligners", "Ceramic and metal braces", "Retainers"],
    image: "/img/case-alignment.webp",
    duration: "6 to 18 months",
  },
  {
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    kicker: "Cosmetic",
    summary:
      "Professional in-clinic whitening that lifts years of tea, coffee and tobacco stains safely, with shade checks before and after.",
    points: ["In-clinic whitening", "Bonding for chipped teeth", "Stain removal"],
    image: "/img/case-whitening.webp",
    duration: "Single visit",
  },
  {
    slug: "children-dentistry",
    title: "Children's Dentistry",
    kicker: "Paediatric",
    summary:
      "Gentle, unhurried visits that teach children dentists are nothing to fear. Preventive care, fillings and habit guidance for every stage of growth.",
    points: ["Kid-friendly environment", "Painless treatment", "Preventive sealants"],
    image: "/img/patient-young.webp",
    duration: "30 to 45 minutes",
  },
  {
    slug: "oral-surgery",
    title: "Oral Surgery",
    kicker: "Surgical",
    summary:
      "Wisdom tooth removal, painless extractions and prosthetic correction of cleft palate, performed in a sterile surgical setting with clear aftercare.",
    points: ["Wisdom tooth extraction", "Painless extraction", "Cleft palate prosthetics"],
    image: "/img/clinic-consultation.webp",
    duration: "Varies by case",
  },
  {
    slug: "general-care",
    title: "Check-ups and Cleaning",
    kicker: "Preventive",
    summary:
      "A thorough examination, digital X-rays where needed and professional scaling. The simplest way to avoid every other treatment on this list.",
    points: ["Comprehensive examination", "Digital X-rays", "Scaling and polishing"],
    image: "/img/clinic-operatory.webp",
    duration: "45 minutes",
  },
];

export const BOOKING_TREATMENTS = [
  "Consultation and Check-up",
  "Smile Design",
  "Dental Implants",
  "Root Canal Treatment",
  "Aligners and Braces",
  "Teeth Whitening",
  "Children's Dentistry",
  "Wisdom Tooth or Extraction",
  "Tooth Pain or Emergency",
  "Something else",
];

export const TREATMENT_TO_BOOKING: Record<string, string> = {
  "smile-design": "Smile Design",
  "dental-implants": "Dental Implants",
  "root-canal": "Root Canal Treatment",
  "aligners-braces": "Aligners and Braces",
  "teeth-whitening": "Teeth Whitening",
  "children-dentistry": "Children's Dentistry",
  "oral-surgery": "Wisdom Tooth or Extraction",
  "general-care": "Consultation and Check-up",
};

export const CASES = [
  {
    image: "/img/case-smile-makeover.webp",
    title: "Full smile makeover",
    detail: "Crowded, uneven front teeth rebuilt into a balanced, natural smile.",
    tag: "Smile Design",
  },
  {
    image: "/img/case-veneers.webp",
    title: "Gap closure with veneers",
    detail: "Spacing and worn edges corrected with thin, hand-finished porcelain veneers.",
    tag: "Veneers",
  },
  {
    image: "/img/case-alignment.webp",
    title: "Broken and decayed teeth restored",
    detail: "Fractured, stained teeth restored to full shape, shade and bite.",
    tag: "Restoration",
  },
  {
    image: "/img/case-whitening.webp",
    title: "Stain removal and whitening",
    detail: "Deep surface staining lifted to a brighter, even shade in one sitting.",
    tag: "Whitening",
  },
];

export const PATIENT_STORIES = [
  {
    image: "/img/patient-child-smile.webp",
    quote:
      "My son used to cry at the word dentist. Dr. Priyank spoke to him like a friend, and now he reminds me when his check-up is due.",
    who: "Parent of a young patient",
    treatment: "Children's Dentistry",
  },
  {
    image: "/img/patient-happy.webp",
    quote:
      "I had avoided my broken teeth for years. Everything was explained before it was done, nothing hurt, and I finally smile in photographs.",
    who: "Restorative patient, Maninagar",
    treatment: "Full Mouth Restoration",
  },
  {
    image: "/img/patient-visit.webp",
    quote:
      "Clean clinic, on time, and no unnecessary treatment pushed on me. That honesty is why my whole family comes here now.",
    who: "Family patient, Ahmedabad",
    treatment: "Root Canal and Crown",
  },
  {
    image: "/img/patient-young.webp",
    quote:
      "The staff made it fun. He walked out with a thumbs up and asked when he could come back.",
    who: "Parent of a young patient",
    treatment: "Preventive Care",
  },
  {
    image: "/img/patient-gift.webp",
    quote:
      "Dr. Rujuta was patient with every question I had. The result looks completely natural, and nobody can tell which teeth were treated.",
    who: "Cosmetic patient, Ahmedabad",
    treatment: "Smile Design",
  },
];

export const DOCTORS = [
  {
    name: "Dr. Priyank Mehta",
    credentials: "BDS, FICOI (USA)",
    role: "Implantologist and Smile Designer",
    bio: "Fellow of the International Congress of Oral Implantologists. Leads implant and full mouth rehabilitation cases at the clinic.",
    image: "/img/dr-priyank.webp",
  },
  {
    name: "Dr. Rujuta Mehta",
    credentials: "BDS, MDS",
    role: "Specialist Dental Surgeon",
    bio: "Postgraduate specialist focused on precise, conservative treatment and long-term oral health for every age.",
    image: "/img/dr-rujuta.webp",
  },
  {
    name: "Dr. Samika Mehta",
    credentials: "BDS",
    role: "Dental Surgeon",
    bio: "Handles general and preventive dentistry with a calm, reassuring chairside manner that patients remember.",
    image: "/img/dr-samika.webp",
  },
];

export const FAQS = [
  {
    q: "Where exactly is the clinic?",
    a: "We are at C/106 Janpath Society, Ghodasar Canal Garden Road, near Aavkar Hall, Maninagar, Ahmedabad 380050. Tap the directions link in the contact section for live navigation.",
  },
  {
    q: "What happens at my first visit?",
    a: "A complete examination, digital X-rays if needed, and a clear conversation about what we see. You leave with a written treatment plan and estimate. Nothing is started without your consent.",
  },
  {
    q: "Is treatment painful?",
    a: "Almost all procedures are done under effective local anaesthesia. Most patients tell us a root canal felt like a long filling. We pause whenever you need to.",
  },
  {
    q: "Which implants do you offer?",
    a: "Single tooth implants, full mouth implants and implant-supported dentures. Your plan is made after a scan of the available bone, so the option we suggest is the one that will last.",
  },
  {
    q: "Can I get a root canal re-done?",
    a: "Yes. We treat single and multiple canals and also re-treat older root canals that have become painful or infected.",
  },
  {
    q: "Do you see dental emergencies?",
    a: "Yes. Choose 'Tooth Pain or Emergency' while booking, or call us directly and we will fit you in as early as possible on the same day.",
  },
];
