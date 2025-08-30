// src/OpenSourceRouteMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

const createSvgIcon = (color) => {
    const svgTemplate = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
            <path
                fill="${color}"
                stroke="#fff"
                stroke-width="1"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            />
        </svg>`;
    return new L.DivIcon({
        html: svgTemplate,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
};

const greenIcon = createSvgIcon('#4CAF50');
const redIcon = createSvgIcon('#F44336');
const yellowIcon = createSvgIcon('#FFC107');

function MapController({ route, center, draggableMarkerPosition }) {
    const map = useMap();
    useEffect(() => {
        if (route && route.length > 0) {
            const bounds = L.latLngBounds(route);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (draggableMarkerPosition) {
            map.flyTo(draggableMarkerPosition, 16);
        } else if (center) {
            map.flyTo(center, 14);
        }
    }, [route, center, draggableMarkerPosition, map]);
    return null;
}

const defaultPosition = [28.67, 77.42];

function OpenSourceRouteMap({ pickups, drops, draggableMarkerPosition, onMarkerDragEnd, setRouteDistance }) {
    const [route, setRoute] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultPosition);

    const debouncedPickups = useDebounce(pickups, 500);
    const debouncedDrops = useDebounce(drops, 500);

    useEffect(() => {
        const fetchMapData = async () => {
            const locationsToGeocode = [
                ...debouncedPickups.map(loc => ({ address: loc, type: 'pickup' })),
                ...debouncedDrops.map(loc => ({ address: loc, type: 'drop' }))
            ].filter(loc =>
                loc.address && loc.address.trim() !== '' && loc.address.trim() !== 'Fetching your location...'
            );

            if (locationsToGeocode.length === 0) {
                setRoute([]);
                setMarkers([]);
                setRouteDistance?.(0);
                if (!draggableMarkerPosition) {
                    setMapCenter(defaultPosition);
                }
                return;
            }

            const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
            if (!apiKey) {
                console.error("API Key is missing!");
                return;
            }

            try {
                const coordsPromises = locationsToGeocode.map(loc =>
                    fetch(`/ors-api/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(loc.address)}`)
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(`Geocoding failed for ${loc.address} with status: ${res.status}`);
                            }
                            return res.json();
                        })
                        .then(data => {
                            if (data.features && data.features.length > 0) {
                                const { coordinates } = data.features[0].geometry;
                                return {
                                    coord: coordinates,
                                    pos: [coordinates[1], coordinates[0]],
                                    text: loc.address,
                                    type: loc.type
                                };
                            }
                            return null;
                        })
                );

                let resolvedLocations = (await Promise.all(coordsPromises)).filter(loc => loc !== null);

                setMarkers(resolvedLocations);

                if (resolvedLocations.length > 0 && !draggableMarkerPosition) {
                    setMapCenter(resolvedLocations[resolvedLocations.length - 1].pos);
                }

                if (resolvedLocations.length >= 2) {
                    const coordinatesForRoute = resolvedLocations.map(loc => loc.coord);
                    const response = await fetch('/ors-api/v2/directions/driving-car/geojson', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': apiKey,
                        },
                        body: JSON.stringify({ coordinates: coordinatesForRoute }),
                    });
                    if (!response.ok) throw new Error(`Directions request failed! Status: ${response.status}`);
                    const data = await response.json();
                    const routeCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    const distance = data.features[0].properties.segments.reduce((sum, segment) => sum + segment.distance, 0) / 1000;
                    setRoute(routeCoords);
                    setRouteDistance?.(distance);
                } else {
                    setRoute([]);
                    setRouteDistance?.(0);
                }
            } catch (error) {
                console.error("Error fetching map data:", error);
                setRoute([]);
                setRouteDistance?.(0);
            }
        };

        fetchMapData();
    }, [debouncedPickups, debouncedDrops]);

    useEffect(() => {
        if (draggableMarkerPosition) {
            setMapCenter(draggableMarkerPosition);
        }
    }, [draggableMarkerPosition]);

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <MapController
                route={route}
                center={mapCenter}
                draggableMarkerPosition={draggableMarkerPosition}
            />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {route.length > 0 && <Polyline pathOptions={{ color: '#0055ff', weight: 5 }} positions={route} />}
            {markers.map((marker, index) => {
                const icon = marker.type === 'pickup' ? greenIcon : redIcon;
                return (
                    <Marker key={index} position={marker.pos} icon={icon}>
                        <Popup>{marker.text}</Popup>
                    </Marker>
                );
            })}
            {draggableMarkerPosition && (
                <Marker
                    draggable={true}
                    eventHandlers={{
                        dragend(e) {
                            onMarkerDragEnd(e.target.getLatLng());
                        },
                    }}
                    position={draggableMarkerPosition}
                    icon={yellowIcon}
                >
                    <Popup>Drag me to the correct location!</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

export default OpenSourceRouteMap;