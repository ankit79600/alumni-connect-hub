import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import "@/types/google.d";

// Alumni location data for demonstration
const alumniLocations = [
  { lat: 40.7128, lng: -74.006, city: "New York", count: 2500 },
  { lat: 51.5074, lng: -0.1278, city: "London", count: 1800 },
  { lat: 35.6762, lng: 139.6503, city: "Tokyo", count: 1200 },
  { lat: 37.7749, lng: -122.4194, city: "San Francisco", count: 2100 },
  { lat: 48.8566, lng: 2.3522, city: "Paris", count: 950 },
  { lat: 52.52, lng: 13.405, city: "Berlin", count: 780 },
  { lat: 1.3521, lng: 103.8198, city: "Singapore", count: 1500 },
  { lat: -33.8688, lng: 151.2093, city: "Sydney", count: 890 },
  { lat: 19.076, lng: 72.8777, city: "Mumbai", count: 2200 },
  { lat: 55.7558, lng: 37.6173, city: "Moscow", count: 420 },
  { lat: 31.2304, lng: 121.4737, city: "Shanghai", count: 1650 },
  { lat: 25.2048, lng: 55.2708, city: "Dubai", count: 980 },
  { lat: -23.5505, lng: -46.6333, city: "São Paulo", count: 1100 },
  { lat: 49.2827, lng: -123.1207, city: "Vancouver", count: 750 },
  { lat: 41.9028, lng: 12.4964, city: "Rome", count: 380 },
];

interface GoogleMapsAlumniProps {
  className?: string;
}

export function GoogleMapsAlumni({ className = "" }: GoogleMapsAlumniProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      try {
        // Create the map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#1a1a2e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#1a1a2e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#0f172a" }],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#4a4a6a" }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        });

        mapInstanceRef.current = map;

        // Add markers for alumni locations
        alumniLocations.forEach((location) => {
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: Math.min(20, Math.max(8, location.count / 200)),
              fillColor: "#8b5cf6",
              fillOpacity: 0.8,
              strokeColor: "#c4b5fd",
              strokeWeight: 2,
            },
            title: `${location.city}: ${location.count} alumni`,
          });

          // Info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: 'Google Sans', sans-serif;">
                <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1a1a2e;">${location.city}</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">${location.count.toLocaleString()} Alumni</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });

        setIsLoaded(true);
      } catch (err) {
        console.error("Google Maps error:", err);
        setError("Failed to load map");
      }
    };

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      initializeMap();
    } else {
      // Listen for the custom event
      const handleMapsLoaded = () => initializeMap();
      document.addEventListener("google-maps-loaded", handleMapsLoaded);
      
      // Fallback timeout
      const timeout = setTimeout(() => {
        if (!window.google?.maps) {
          setError("Google Maps failed to load. Please check your API key.");
        }
      }, 10000);

      return () => {
        document.removeEventListener("google-maps-loaded", handleMapsLoaded);
        clearTimeout(timeout);
      };
    }
  }, []);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-card border border-border rounded-xl p-8 ${className}`}>
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">{error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Configure your Google Maps API key to enable the map
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      
      {/* Powered by Google badge */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-xs font-medium">Powered by Google Maps</span>
      </div>
    </div>
  );
}
