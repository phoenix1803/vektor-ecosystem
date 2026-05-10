export const mockHospitals = [
  { id: "hsp_apollo_north", name: "Apollo North Campus", lat: 12.9539, lng: 77.4902 },
  { id: "hsp_city_care", name: "City Care Hospital", lat: 12.9718, lng: 77.5937 },
  { id: "hsp_greenline", name: "Greenline Multispecialty", lat: 12.9091, lng: 77.6476 },
  { id: "hsp_skyline", name: "Skyline Critical Care", lat: 12.9984, lng: 77.6358 },
  { id: "hsp_meridian", name: "Meridian Heart Institute", lat: 12.9412, lng: 77.6124 },
];

export const mockPatients = [
  { id: "UHID-12091", name: "Arjun Mehta", phone: "+91-9820001122", primaryCondition: "Type 2 Diabetes" },
  { id: "UHID-12092", name: "Neha Shah", phone: "+91-9820001133", primaryCondition: "Asthma" },
  { id: "UHID-12093", name: "Rakesh Saini", phone: "+91-9820001144", primaryCondition: "Post-op follow-up" },
  { id: "UHID-12094", name: "Maya Nambiar", phone: "+91-9820001155", primaryCondition: "Acute coronary syndrome" },
];

export function jsonOk<T>(data: T, status = 200) {
  return Response.json(data, { status });
}
