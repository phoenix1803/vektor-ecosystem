import { mockHospitals } from "@/lib/mock";

export function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function assignNearestHospital(lat: number, lng: number) {
  const nearest = mockHospitals
    .map((hospital) => ({
      ...hospital,
      distanceKm: distanceKm(lat, lng, hospital.lat, hospital.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  return {
    ...nearest,
    etaMinutes: Math.max(5, Math.round((nearest.distanceKm / 35) * 60)),
  };
}
