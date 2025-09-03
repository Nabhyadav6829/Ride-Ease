// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Debounce hook to prevent excessive API calls
// function useDebounce(value, delay) {
//     const [debouncedValue, setDebouncedValue] = useState(value);
//     useEffect(() => {
//         const handler = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);
//         return () => {
//             clearTimeout(handler);
//         };
//     }, [value, delay]);
//     return debouncedValue;
// }

// // Default Leaflet icon setup
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: iconRetinaUrl,
//     iconUrl: iconUrl,
//     shadowUrl: shadowUrl,
// });

// // Helper to create custom SVG icons for map markers
// const createSvgIcon = (color, svgPath) => {
//     const defaultPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
//     const svgTemplate = `
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
//             <path
//                 fill="${color}"
//                 stroke="#fff"
//                 stroke-width="1"
//                 d="${svgPath || defaultPath}"
//             />
//         </svg>`;
//     return new L.DivIcon({
//         html: svgTemplate,
//         className: '',
//         iconSize: [36, 36],
//         iconAnchor: [18, 36],
//         popupAnchor: [0, -36]
//     });
// };

// const greenIcon = createSvgIcon('#4CAF50');
// const redIcon = createSvgIcon('#F44336');
// const yellowIcon = createSvgIcon('#FFC107');
// // New icon for the driver
// const driverIcon = createSvgIcon('#0284c7', 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z');

// // Component to control map view (pan, zoom, fit bounds)
// function MapController({ route, center, draggableMarkerPosition }) {
//     const map = useMap();
//     useEffect(() => {
//         if (route && route.length > 0) {
//             const bounds = L.latLngBounds(route);
//             map.fitBounds(bounds, { padding: [50, 50] });
//         } else if (draggableMarkerPosition) {
//             map.flyTo(draggableMarkerPosition, 16);
//         } else if (center) {
//             map.flyTo(center, 14);
//         }
//     }, [route, center, draggableMarkerPosition, map]);
//     return null;
// }

// const defaultPosition = [28.67, 77.42];

// // Main map component, now with driverPosition prop
// function OpenSourceRouteMap({ pickups, drops, draggableMarkerPosition, onMarkerDragEnd, setRouteDistance, driverPosition }) {
//     const [route, setRoute] = useState([]);
//     const [markers, setMarkers] = useState([]);
//     const [mapCenter, setMapCenter] = useState(defaultPosition);

//     const debouncedPickups = useDebounce(pickups, 500);
//     const debouncedDrops = useDebounce(drops, 500);

//     useEffect(() => {
//         const fetchMapData = async () => {
//             const locationsToGeocode = [
//                 ...debouncedPickups.map(loc => ({ address: loc, type: 'pickup' })),
//                 ...debouncedDrops.map(loc => ({ address: loc, type: 'drop' }))
//             ].filter(loc =>
//                 loc.address && loc.address.trim() !== '' && loc.address.trim() !== 'Fetching your location...'
//             );

//             if (locationsToGeocode.length === 0) {
//                 setRoute([]);
//                 setMarkers([]);
//                 if(setRouteDistance) setRouteDistance(0);
//                 if (!draggableMarkerPosition) setMapCenter(defaultPosition);
//                 return;
//             }

//             const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
//             if (!apiKey) {
//                 console.error("API Key is missing!");
//                 return;
//             }

//             try {
//                 const coordsPromises = locationsToGeocode.map(loc =>
//                     fetch(`https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(loc.address)}`)
//                         .then(res => res.ok ? res.json() : Promise.reject(`Geocoding failed for ${loc.address}`))
//                         .then(data => {
//                             if (data.features && data.features.length > 0) {
//                                 const { coordinates } = data.features[0].geometry;
//                                 return { coord: coordinates, pos: [coordinates[1], coordinates[0]], text: loc.address, type: loc.type };
//                             }
//                             return null;
//                         })
//                 );

//                 let resolvedLocations = (await Promise.all(coordsPromises)).filter(loc => loc !== null);
//                 setMarkers(resolvedLocations);

//                 if (resolvedLocations.length > 0 && !draggableMarkerPosition) {
//                     setMapCenter(resolvedLocations[0].pos);
//                 }

//                 if (resolvedLocations.length >= 2) {
//                     const coordinatesForRoute = resolvedLocations.map(loc => loc.coord);
//                     const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
//                         method: 'POST',
//                         headers: {
//                             'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
//                             'Content-Type': 'application/json; charset=utf-8',
//                             'Authorization': apiKey,
//                         },
//                         body: JSON.stringify({ coordinates: coordinatesForRoute }),
//                     });
//                     if (!response.ok) throw new Error(`Directions request failed!`);
//                     const data = await response.json();
//                     const routeCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
//                     const distance = data.features[0].properties.segments.reduce((sum, segment) => sum + segment.distance, 0) / 1000;
//                     setRoute(routeCoords);
//                     if(setRouteDistance) setRouteDistance(distance);
//                 } else {
//                     setRoute([]);
//                     if(setRouteDistance) setRouteDistance(0);
//                 }
//             } catch (error) {
//                 console.error("Error fetching map data:", error);
//                 setRoute([]);
//                 if(setRouteDistance) setRouteDistance(0);
//             }
//         };
//         fetchMapData();
//     }, [debouncedPickups, debouncedDrops]);

//     useEffect(() => {
//         if (draggableMarkerPosition) {
//             setMapCenter(draggableMarkerPosition);
//         }
//     }, [draggableMarkerPosition]);

//     return (
//         <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
//             <MapController route={route} center={mapCenter} draggableMarkerPosition={draggableMarkerPosition} />
//             <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             {route.length > 0 && <Polyline pathOptions={{ color: '#0055ff', weight: 5 }} positions={route} />}
//             {markers.map((marker, index) => (
//                 <Marker key={index} position={marker.pos} icon={marker.type === 'pickup' ? greenIcon : redIcon}>
//                     <Popup>{marker.text}</Popup>
//                 </Marker>
//             ))}
            
//             {/* Renders the moving driver icon on the map */}
//             {driverPosition && (
//                 <Marker position={driverPosition} icon={driverIcon}>
//                     <Popup>Driver's current location</Popup>
//                 </Marker>
//             )}

//             {draggableMarkerPosition && (
//                 <Marker
//                     draggable={true}
//                     eventHandlers={{ dragend(e) { onMarkerDragEnd(e.target.getLatLng()); } }}
//                     position={draggableMarkerPosition}
//                     icon={yellowIcon}
//                 >
//                     <Popup>Drag me to the correct location!</Popup>
//                 </Marker>
//             )}
//         </MapContainer>
//     );
// }

// export default OpenSourceRouteMap;

















import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Debounce hook to prevent excessive API calls
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// Default Leaflet icon setup (keep default markers working)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

// Helper to create custom SVG icons for map markers
const createSvgIcon = (color, svgPath) => {
    const defaultPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
    const svgTemplate = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="38">
            <path
                fill="${color}"
                stroke="#fff"
                stroke-width="1"
                d="${svgPath || defaultPath}"
            />
        </svg>`;
    return new L.DivIcon({
        html: svgTemplate,
        className: '',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });
};

const greenIcon = createSvgIcon('#4CAF50');
const redIcon = createSvgIcon('#F44336');
const yellowIcon = createSvgIcon('#FFC107');
// Car icon for the driver
const carSvgPath = "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z";
const driverIcon = createSvgIcon('#0284c7', carSvgPath);

// Animated marker component for smooth transitions
function AnimatedDriverMarker({ position, icon }) {
    const [displayedPosition, setDisplayedPosition] = useState(position);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!position) return;

        const start = displayedPosition || position;
        const end = position;

        // if same, just set and exit
        if (start && start[0] === end[0] && start[1] === end[1]) {
            setDisplayedPosition(end);
            return;
        }

        clearInterval(animationRef.current);

        const duration = 1500; // ms
        const interval = 40;   // ms
        const steps = Math.max(1, Math.floor(duration / interval));
        let step = 0;

        animationRef.current = setInterval(() => {
            step++;
            const t = step / steps;
            const lat = start[0] + (end[0] - start[0]) * t;
            const lng = start[1] + (end[1] - start[1]) * t;
            setDisplayedPosition([lat, lng]);

            if (step >= steps) {
                clearInterval(animationRef.current);
            }
        }, interval);

        return () => clearInterval(animationRef.current);
    }, [position]);

    if (!displayedPosition) return null;

    return (
        <Marker position={displayedPosition} icon={icon}>
            <Popup>Driver's current location</Popup>
        </Marker>
    );
}

// MapController to fit map to route or center
function MapController({ route, center, driverPosition }) {
    const map = useMap();
    useEffect(() => {
        if (route && route.length > 0) {
            const bounds = L.latLngBounds(route);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (driverPosition) {
            map.flyTo(driverPosition, 14);
        } else if (center) {
            map.flyTo(center, 13);
        }
    }, [route, center, driverPosition, map]);
    return null;
}

const defaultPosition = [28.67, 77.42];

function OpenSourceRouteMap({ pickups = [], drops = [], draggableMarkerPosition, onMarkerDragEnd, setRouteDistance, driverPosition, tripPhase }) {
    const [route, setRoute] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultPosition);

    const debouncedPickups = useDebounce(pickups, 600);
    const debouncedDrops = useDebounce(drops, 600);

    useEffect(() => {
        const fetchMapData = async () => {
            const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
            if (!apiKey) {
                console.error("OPENROUTESERVICE_API_KEY is missing!");
                setRoute([]); setMarkers([]); if (setRouteDistance) setRouteDistance(0); return;
            }

            try {
                // PHASE 1: arriving -> route from driverPosition -> pickup (only first pickup)
                if (tripPhase === 'arriving' && driverPosition && debouncedPickups && debouncedPickups.length > 0) {
                    const pickupAddress = debouncedPickups[0];
                    if (!pickupAddress || pickupAddress.trim() === '' || pickupAddress.trim() === 'Fetching your location...') {
                        setRoute([]); setMarkers([]); if (setRouteDistance) setRouteDistance(0); return;
                    }

                    // Geocode pickup
                    const geocodeRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(pickupAddress)}`);
                    if (!geocodeRes.ok) throw new Error('Geocoding failed.');
                    const geocodeData = await geocodeRes.json();
                    if (geocodeData.features && geocodeData.features.length > 0) {
                        const pickupCoord = geocodeData.features[0].geometry.coordinates; // [lng, lat]
                        const pickupPos = [pickupCoord[1], pickupCoord[0]];
                        setMarkers([{ coord: pickupCoord, pos: pickupPos, text: pickupAddress, type: 'pickup' }]);
                        setMapCenter(pickupPos);

                        // route: driverPosition([lat,lng]) -> pickupCoord([lng,lat])
                        const routePoints = [[driverPosition[1], driverPosition[0]], pickupCoord];
                        const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json, application/geo+json',
                                'Content-Type': 'application/json; charset=utf-8',
                                'Authorization': apiKey,
                            },
                            body: JSON.stringify({ coordinates: routePoints }),
                        });
                        if (!response.ok) throw new Error('Directions request failed for arriving phase');
                        const data = await response.json();
                        const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
                        const distance = data.features[0].properties.segments.reduce((sum, s) => sum + s.distance, 0) / 1000;
                        setRoute(coords);
                        if (setRouteDistance) setRouteDistance(distance);
                        return;
                    }
                }

                // PHASE 2: enroute or default -> route across all pickups & drops
                const locationsToGeocode = [
                    ...debouncedPickups.map(loc => ({ address: loc, type: 'pickup' })),
                    ...debouncedDrops.map(loc => ({ address: loc, type: 'drop' })),
                ].filter(l => l.address && l.address.trim() !== '' && l.address.trim() !== 'Fetching your location...');

                if (locationsToGeocode.length === 0) {
                    setRoute([]); setMarkers([]); if (setRouteDistance) setRouteDistance(0); if (!draggableMarkerPosition) setMapCenter(defaultPosition);
                    return;
                }

                const coordsPromises = locationsToGeocode.map(loc =>
                    fetch(`https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(loc.address)}`)
                        .then(res => res.ok ? res.json() : Promise.reject('Geocode fail'))
                        .then(data => {
                            if (data.features && data.features.length > 0) {
                                const coordinates = data.features[0].geometry.coordinates; // [lng, lat]
                                return { coord: coordinates, pos: [coordinates[1], coordinates[0]], text: loc.address, type: loc.type };
                            }
                            return null;
                        })
                );

                const resolved = (await Promise.all(coordsPromises)).filter(Boolean);
                setMarkers(resolved);
                if (resolved.length > 0 && !draggableMarkerPosition) setMapCenter(resolved[0].pos);

                if (resolved.length >= 2) {
                    const routeCoordsForReq = resolved.map(r => r.coord);
                    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, application/geo+json',
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': apiKey,
                        },
                        body: JSON.stringify({ coordinates: routeCoordsForReq }),
                    });
                    if (!response.ok) throw new Error('Directions request failed for main route');
                    const data = await response.json();
                    const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    const distance = data.features[0].properties.segments.reduce((sum, s) => sum + s.distance, 0) / 1000;
                    setRoute(coords);
                    if (setRouteDistance) setRouteDistance(distance);
                } else {
                    setRoute([]);
                    if (setRouteDistance) setRouteDistance(0);
                }

            } catch (err) {
                console.error('Map data error:', err);
                setRoute([]); setMarkers([]); if (setRouteDistance) setRouteDistance(0);
            }
        };

        fetchMapData();
    }, [debouncedPickups, debouncedDrops, draggableMarkerPosition, setRouteDistance, driverPosition, tripPhase]);

    // center when draggable marker moves
    useEffect(() => {
        if (draggableMarkerPosition) setMapCenter(draggableMarkerPosition);
    }, [draggableMarkerPosition]);

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <MapController route={route} center={mapCenter} driverPosition={driverPosition} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* route polyline */}
            {route.length > 0 && <Polyline pathOptions={{ color: '#0055ff', weight: 5 }} positions={route} />}

            {/* pickup/drop markers */}
            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.pos} icon={marker.type === 'pickup' ? greenIcon : redIcon}>
                    <Popup>{marker.text}</Popup>
                </Marker>
            ))}

            {/* Animated driver marker (car icon) */}
            {driverPosition && (
                <AnimatedDriverMarker position={driverPosition} icon={driverIcon} />
            )}

            {/* optional draggable marker */}
            {draggableMarkerPosition && (
                <Marker
                    draggable={true}
                    eventHandlers={{
                        dragend(e) { if (onMarkerDragEnd) onMarkerDragEnd(e.target.getLatLng()); }
                    }}
                    position={draggableMarkerPosition}
                    icon={yellowIcon}
                >
                    <Popup>Drag me to correct location</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

export default OpenSourceRouteMap;
