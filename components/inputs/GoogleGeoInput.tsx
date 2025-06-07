import { TextField, Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";

const InterFont = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: "500",
});

export const GooglePlacesAutocompleteInput = ({
    onSelect,
    placeholder,
}: {
    onSelect: Function;
    placeholder?: string;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    // ✅ Detectar URL con lat/lng y geocodificar
    const resolveUrlToLocation = (url: string) => {
        if (!geocoderRef.current || !mapRef.current) return;

        const latLngMatch =
            url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
            url.match(/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);

        if (latLngMatch) {
            const lat = parseFloat(latLngMatch[1]);
            const lng = parseFloat(latLngMatch[2]);
            const position = new google.maps.LatLng(lat, lng);

            geocoderRef.current.geocode({ location: position }, (results, status) => {
                if (status === "OK" && results && results.length > 0) {
                    const result = results[0];
                    const components = result.address_components;


                    const getComponent = (type: string) =>
                        components.find((c: any) => c.types.includes(type))?.long_name || "";

                    const address = result.formatted_address || "";
                    const zipCode = getComponent("postal_code");
                    const country = getComponent("country");
                    const url = `https://www.google.com/maps/place/?q=${lat},${lng}`;
                    const city = getComponent("locality") || getComponent("administrative_area_level_2"); // fallback

                    const data = { address, zipCode, country, city, lat, lng, url };

                    if (inputRef.current) {
                        inputRef.current.value = address;
                    }

                    if (markerRef.current) markerRef.current.setPosition(position);
                    if (mapRef.current) {
                        mapRef.current.panTo(position);
                        mapRef.current.setZoom(16);
                    }

                    onSelect(data);
                }
            });
        }
    };

    useEffect(() => {
        if (
            typeof window === "undefined" ||
            !window.google ||
            !inputRef.current
        )
            return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["establishment"],
            componentRestrictions: { country: "DO" },
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.address_components) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const components = place.address_components;

            const getComponent = (type: string) =>
                components.find((c: any) => c.types.includes(type))?.long_name || "";

            const address = place.formatted_address || "";
            const zipCode = getComponent("postal_code");
            const city = getComponent("locality") || getComponent("administrative_area_level_2"); // fallback

            const url = place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

            const selectedData = { address, zipCode, city, lat, lng, url, place_id: place.place_id };

            const position = new window.google.maps.LatLng(lat, lng);

            if (markerRef.current && mapRef.current) {
                markerRef.current.setPosition(position);
                mapRef.current.panTo(position);
                mapRef.current.setZoom(16);
            }

            onSelect(selectedData);
        });

        const style = document.createElement("style");
        style.innerHTML = `.pac-container { z-index: 1500 !important; }`;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            window.google &&
            mapContainerRef.current &&
            !mapRef.current
        ) {
            const initialLatLng = { lat: 18.4861, lng: -69.9312 };

            navigator.geolocation.getCurrentPosition((position) => {
                initialLatLng.lat = position.coords.latitude;
                initialLatLng.lng = position.coords.longitude;
            });

            const map = new window.google.maps.Map(mapContainerRef.current, {
                center: initialLatLng,
                zoom: 13,
            });

            const marker = new window.google.maps.Marker({
                map,
                position: initialLatLng,
            });

            mapRef.current = map;
            markerRef.current = marker;
            geocoderRef.current = new window.google.maps.Geocoder();

            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const latLng = e.latLng;
                if (!latLng || !geocoderRef.current) return;

                geocoderRef.current.geocode({ location: latLng }, (results, status) => {
                    if (status === "OK" && results && results.length > 0) {
                        const result = results[0];
                        const components = result.address_components;

                        const getComponent = (type: string) =>
                            components.find((c: any) => c.types.includes(type))?.long_name || "";

                        const address = result.formatted_address || "";
                        const zipCode = getComponent("postal_code");
                        const city = getComponent("locality") || getComponent("administrative_area_level_2");
                        const county = getComponent("administrative_area_level_2") ||
                        getComponent("sublocality_level_1") ||
                            getComponent("sublocality") ||
                            getComponent("neighborhood");

                        const lat = latLng.lat();
                        const lng = latLng.lng();
                        const url = `https://www.google.com/maps/place/?q=${lat},${lng}`;

                        const data = { address, zipCode, lat, lng, url, city, place_id: result.place_id,county };

                        if (inputRef.current) {
                            inputRef.current.value = address;
                        }

                        if (markerRef.current) markerRef.current.setPosition(latLng);
                        if (mapRef.current) {
                            mapRef.current.panTo(latLng);
                            mapRef.current.setZoom(16);
                        }

                        onSelect(data);
                    }
                });
            });
        }
    }, []);

    return (
        <Box>
            <TextField
                fullWidth
                inputRef={inputRef}
                variant="outlined"
                size="small"
                placeholder={placeholder}
                onBlur={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("http")) {
                        resolveUrlToLocation(value);
                    }
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "52px",
                        "& fieldset": { border: "none" },
                        "&:hover fieldset": { border: "none" },
                        "&.Mui-focused fieldset": { border: "none" },
                    },
                }}
                InputProps={{
                    style: {
                        height: "52px",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "16px",
                        fontFamily: InterFont.style.fontFamily,
                        color: "#ABAFB1",
                        backgroundColor: "#EFF1F999",
                    },
                }}
            />

            <Box
                ref={mapContainerRef}
                sx={{
                    width: "100%",
                    height: "400px",
                    marginTop: "16px",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            />
        </Box>
    );
};
