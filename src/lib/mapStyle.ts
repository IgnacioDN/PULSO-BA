export const darkMapStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1c1612" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1c1612" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a7f74" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#3a2f28" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#22301f" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a221c" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1c1612" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3a2f28" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#12100e" }] },
];