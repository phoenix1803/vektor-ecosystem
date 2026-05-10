export type DemoDoctor = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  hospitalId: string;
  status: "available" | "busy" | "on_case";
  currentstatus: string;
  currentIncidentId: string | null;
};

export const demoDoctors: DemoDoctor[] = [
  // ========== Apollo North Campus (hsp_apollo_north) - 9 Doctors ==========
  // Cardiac Specialists
  {
    id: "doc-000-sana-iyer",
    name: "Dr. Sana Iyer",
    email: "sana.iyer@apollo.health",
    specialty: "cardiac",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-vikram-singh",
    name: "Dr. Vikram Singh",
    email: "vikram.singh@apollo.health",
    specialty: "cardiac",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-anjali-kapoor",
    name: "Dr. Anjali Kapoor",
    email: "anjali.kapoor@apollo.health",
    specialty: "cardiac",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  // Respiratory Specialists
  {
    id: "doc-rajesh-kumar",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@apollo.health",
    specialty: "respiratory",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-meera-bhatt",
    name: "Dr. Meera Bhatt",
    email: "meera.bhatt@apollo.health",
    specialty: "respiratory",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-ravi-patel",
    name: "Dr. Ravi Patel",
    email: "ravi.patel@apollo.health",
    specialty: "respiratory",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  // Trauma Specialists
  {
    id: "doc-priya-nair",
    name: "Dr. Priya Nair",
    email: "priya.nair@apollo.health",
    specialty: "trauma",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-arun-verma",
    name: "Dr. Arun Verma",
    email: "arun.verma@apollo.health",
    specialty: "trauma",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-pooja-desai",
    name: "Dr. Pooja Desai",
    email: "pooja.desai@apollo.health",
    specialty: "trauma",
    hospitalId: "hsp_apollo_north",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },

  // ========== City Care Hospital (hsp_city_care) - 6 Doctors ==========
  // Cardiac Specialists
  {
    id: "doc-amit-singh",
    name: "Dr. Amit Singh",
    email: "amit.singh@citycare.health",
    specialty: "cardiac",
    hospitalId: "hsp_city_care",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-deepak-malhotra",
    name: "Dr. Deepak Malhotra",
    email: "deepak.malhotra@citycare.health",
    specialty: "cardiac",
    hospitalId: "hsp_city_care",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  // General Practitioners
  {
    id: "doc-neha-sharma",
    name: "Dr. Neha Sharma",
    email: "neha.sharma@citycare.health",
    specialty: "general",
    hospitalId: "hsp_city_care",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-rohit-gupta",
    name: "Dr. Rohit Gupta",
    email: "rohit.gupta@citycare.health",
    specialty: "general",
    hospitalId: "hsp_city_care",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-priya-mishra",
    name: "Dr. Priya Mishra",
    email: "priya.mishra@citycare.health",
    specialty: "general",
    hospitalId: "hsp_city_care",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-sunil-rao",
    name: "Dr. Sunil Rao",
    email: "sunil.rao@citycare.health",
    specialty: "general",
    hospitalId: "hsp_city_care",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },

  // ========== Greenline Multispecialty (hsp_greenline) - 6 Doctors ==========
  // General Practitioners
  {
    id: "doc-arjun-verma",
    name: "Dr. Arjun Verma",
    email: "arjun.verma@greenline.health",
    specialty: "general",
    hospitalId: "hsp_greenline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-sunita-yadav",
    name: "Dr. Sunita Yadav",
    email: "sunita.yadav@greenline.health",
    specialty: "general",
    hospitalId: "hsp_greenline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  // Respiratory Specialists
  {
    id: "doc-meera-patel",
    name: "Dr. Meera Patel",
    email: "meera.patel@greenline.health",
    specialty: "respiratory",
    hospitalId: "hsp_greenline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-manish-joshi",
    name: "Dr. Manish Joshi",
    email: "manish.joshi@greenline.health",
    specialty: "respiratory",
    hospitalId: "hsp_greenline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-kavita-shah",
    name: "Dr. Kavita Shah",
    email: "kavita.shah@greenline.health",
    specialty: "respiratory",
    hospitalId: "hsp_greenline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-nikhil-desai",
    name: "Dr. Nikhil Desai",
    email: "nikhil.desai@greenline.health",
    specialty: "respiratory",
    hospitalId: "hsp_greenline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },

  // ========== Skyline Critical Care (hsp_skyline) - 7 Doctors ==========
  // Trauma Specialists
  {
    id: "doc-vikram-reddy",
    name: "Dr. Vikram Reddy",
    email: "vikram.reddy@skyline.health",
    specialty: "trauma",
    hospitalId: "hsp_skyline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-sandeep-nair",
    name: "Dr. Sandeep Nair",
    email: "sandeep.nair@skyline.health",
    specialty: "trauma",
    hospitalId: "hsp_skyline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-neha-bhat",
    name: "Dr. Neha Bhat",
    email: "neha.bhat@skyline.health",
    specialty: "trauma",
    hospitalId: "hsp_skyline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  // Critical Care Specialists
  {
    id: "doc-rashmi-gupta",
    name: "Dr. Rashmi Gupta",
    email: "rashmi.gupta@skyline.health",
    specialty: "critical-care",
    hospitalId: "hsp_skyline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-arjun-joshi",
    name: "Dr. Arjun Joshi",
    email: "arjun.joshi@skyline.health",
    specialty: "critical-care",
    hospitalId: "hsp_skyline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-isha-patel",
    name: "Dr. Isha Patel",
    email: "isha.patel@skyline.health",
    specialty: "critical-care",
    hospitalId: "hsp_skyline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-kumar-roy",
    name: "Dr. Kumar Roy",
    email: "kumar.roy@skyline.health",
    specialty: "critical-care",
    hospitalId: "hsp_skyline",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },

  // ========== Meridian Heart Institute (hsp_meridian) - 5 Doctors ==========
  // Cardiac Specialists
  {
    id: "doc-suresh-nair",
    name: "Dr. Suresh Nair",
    email: "suresh.nair@meridian.health",
    specialty: "cardiac",
    hospitalId: "hsp_meridian",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-divya-sharma",
    name: "Dr. Divya Sharma",
    email: "divya.sharma@meridian.health",
    specialty: "cardiac",
    hospitalId: "hsp_meridian",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-rishi-kumar",
    name: "Dr. Rishi Kumar",
    email: "rishi.kumar@meridian.health",
    specialty: "cardiac",
    hospitalId: "hsp_meridian",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  // Neurology Specialists
  {
    id: "doc-anjali-desai",
    name: "Dr. Anjali Desai",
    email: "anjali.desai@meridian.health",
    specialty: "neurology",
    hospitalId: "hsp_meridian",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
  {
    id: "doc-shweta-roy",
    name: "Dr. Shweta Roy",
    email: "shweta.roy@meridian.health",
    specialty: "neurology",
    hospitalId: "hsp_meridian",
    status: "available",
    currentstatus: "available",
    currentIncidentId: null,
  },
];

export function findDoctor(doctorId: string) {
  return demoDoctors.find((doctor) => doctor.id === doctorId);
}

export function findDoctorsInHospital(hospitalId: string) {
  return demoDoctors.filter((doctor) => doctor.hospitalId === hospitalId);
}

export function findAvailableDoctors(hospitalId: string, specialty?: string) {
  return demoDoctors.filter(
    (doctor) =>
      doctor.hospitalId === hospitalId &&
      doctor.status === "available" &&
      (!specialty || doctor.specialty === specialty)
  );
}
