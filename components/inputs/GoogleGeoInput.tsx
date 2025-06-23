import { TextField, Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";

const InterFont = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: "500",
});

export const GooglePlacesAutocompleteInput = ({
    onSelect,
    placeholder,
    comingCords
}: {
    onSelect: Function;
    comingCords?: any 
    placeholder?: string;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const [cords, setCords] = useState<any>(comingCords)

    useEffect(() => {
        if (
            typeof window === "undefined" ||
            !window.google ||
            !geocoderRef.current ||
            !mapRef.current ||
            !markerRef.current
        ) return;
    
        const { lat, lng } = cords;
        if (!lat || !lng) return;
    
        const latLng = new window.google.maps.LatLng(lat, lng);
    
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
    
                const url = `https://www.google.com/maps/place/?q=${lat},${lng}`;
    
                const data = {
                    address,
                    zipCode,
                    lat,
                    lng,
                    url,
                    city,
                    place_id: result.place_id,
                    county,
                };
    
                if (inputRef.current) inputRef.current.value = address;
                markerRef.current!.setPosition(latLng);
                mapRef.current!.panTo(latLng);
                mapRef.current!.setZoom(16);
                onSelect(data);
            }
        });
    }, [cords]);

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

            const lat = place?.geometry?.location?.lat();
            const lng = place?.geometry?.location?.lng();

            const components = place.address_components;

            const getComponent = (type: string) =>
                components.find((c: any) => c.types.includes(type))?.long_name || "";

            const address = place.formatted_address || "";
            const zipCode = getComponent("postal_code");
            const city = getComponent("locality") || getComponent("administrative_area_level_2"); // fallback

            const url = place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

            const selectedData = { address, zipCode, city, lat, lng, url, place_id: place.place_id };

            const position = new window.google.maps.LatLng(lat!, lng!);

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
    }, [onSelect, cords]);

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            window.google &&
            mapContainerRef.current &&
            !mapRef.current
        ) {
            const initialLatLng = { lat: cords.lat || 18.4861, lng:  cords.lng || -69.9312 };

            navigator.geolocation.getCurrentPosition((position) => {
                initialLatLng.lat = cords.lat || position.coords.latitude;
                initialLatLng.lng = cords.lng || position.coords.longitude;
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

                        const data = { address, zipCode, lat, lng, url, city, place_id: result.place_id, county };

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
    }, [onSelect, cords]);


    const parseCoordinates = (input:string) => {
        if (typeof input !== 'string') return {};

        const parts = input.split(',').map(part => part.trim());

        if (parts.length !== 2) return {};

        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);

        if (isNaN(lat) || isNaN(lng)) return {};

        return { lat, lng };
    }

    return (
        <Box>
            <TextField
                fullWidth
                inputRef={inputRef}
                variant="outlined"
                size="small"
                placeholder={placeholder}
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

            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder={"Coordenadas Ej: 19,03465, -69.9312"}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        height: "52px",
                        "& fieldset": { border: "none" },
                        "&:hover fieldset": { border: "none" },
                        "&.Mui-focused fieldset": { border: "none" },
                    },
                    mt: 1
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
                value={`${cords.lat ? cords.lat : ""}, ${cords.lng ? cords.lng : ""}`}
                onChange={(e) => {
                    const value = e.target.value;
                    setCords(parseCoordinates(value));
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
