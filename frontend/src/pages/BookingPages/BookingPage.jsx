//for vehicles
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { MapPin, Navigation, CheckCircle, ArrowLeft, X, Plus, Pin, GripVertical, Bike, Car, Gem, Users, Clock } from 'lucide-react';
// import {
//     DndContext,
//     closestCenter,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors,
// } from '@dnd-kit/core';
// import {
//     arrayMove,
//     SortableContext,
//     sortableKeyboardCoordinates,
//     verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import OpenSourceRouteMap from '../OpenSourceRouteMap.jsx';

// function VehicleSelectionSheet({ isOpen, onClose, vehicles, selectedVehicle, onSelectVehicle, onConfirm }) {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-end">
//             <div
//                 className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
//                 onClick={onClose}
//             ></div>
//             <div className={`relative w-full max-w-lg mx-auto bg-gradient-to-b from-white to-gray-50 rounded-t-3xl shadow-2xl transition-transform duration-500 ease-out ${
//                 isOpen ? 'translate-y-0' : 'translate-y-full'
//             }`}>
//                 <div className="flex justify-center pt-4">
//                     <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
//                 </div>
//                 <div className="p-6 pb-8">
//                     <div className="flex items-center justify-between mb-8">
//                         <div>
//                             <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                                 Choose Your Ride
//                             </h2>
//                             <p className="text-gray-600 text-sm mt-1">Select your preferred vehicle type</p>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         >
//                             <X className="h-6 w-6 text-gray-400" />
//                         </button>
//                     </div>
//                     <div className="space-y-4 mb-8">
//                         {vehicles.map((vehicle, index) => (
//                             <div
//                                 key={vehicle.id}
//                                 onClick={() => onSelectVehicle(vehicle)}
//                                 className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
//                                     selectedVehicle?.id === vehicle.id
//                                         ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg ring-2 ring-emerald-200'
//                                         : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
//                                 }`}
//                                 style={{ animationDelay: `${index * 100}ms` }}
//                             >
//                                 {selectedVehicle?.id === vehicle.id && (
//                                     <div className="absolute top-3 right-3">
//                                         <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
//                                             <CheckCircle className="h-4 w-4 text-white" />
//                                         </div>
//                                     </div>
//                                 )}
//                                 <div className={`p-3 rounded-xl mr-4 ${
//                                     selectedVehicle?.id === vehicle.id
//                                         ? 'bg-emerald-100'
//                                         : 'bg-gray-100'
//                                 }`}>
//                                     <vehicle.icon className={`h-8 w-8 ${
//                                         selectedVehicle?.id === vehicle.id
//                                             ? 'text-emerald-600'
//                                             : 'text-gray-600'
//                                     }`} />
//                                 </div>
//                                 <div className="flex-grow">
//                                     <div className="flex items-center justify-between">
//                                         <h3 className="font-bold text-xl text-gray-900">{vehicle.name}</h3>
//                                         <div className="text-right">
//                                             <p className="text-2xl font-bold text-gray-900">₹{vehicle.price}</p>
//                                             <p className="text-xs text-gray-500">estimated fare</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center space-x-4 mt-2">
//                                         <div className="flex items-center text-sm text-gray-600">
//                                             <Users className="h-4 w-4 mr-1.5 text-gray-500" />
//                                             <span>{vehicle.capacity} seats</span>
//                                         </div>
//                                         <div className="flex items-center text-sm text-gray-600">
//                                             <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
//                                             <span>2-5 min</span>
//                                         </div>
//                                     </div>
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         {vehicle.id === 'moto' && 'Quick & affordable for solo rides'}
//                                         {vehicle.id === 'comfort' && 'Comfortable rides for small groups'}
//                                         {vehicle.id === 'luxury' && 'Premium experience with top-tier vehicles'}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     <button
//                         onClick={onConfirm}
//                         disabled={!selectedVehicle}
//                         className={`w-full py-5 px-6 rounded-2xl text-lg font-bold transition-all duration-300 transform active:scale-95 ${
//                             selectedVehicle
//                                 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
//                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         }`}
//                     >
//                         <div className="flex items-center justify-center space-x-3">
//                             {selectedVehicle ? (
//                                 <>
//                                     <span>Book {selectedVehicle.name} for ₹{selectedVehicle.price}</span>
//                                     <CheckCircle className="h-6 w-6" />
//                                 </>
//                             ) : (
//                                 <span>Select a Ride</span>
//                             )}
//                         </div>
//                     </button>
//                     <p className="text-center text-xs text-gray-500 mt-4">
//                         Final fare may vary based on actual distance and waiting time
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function SortableLocationItem({ location, index, type, isActive, totalItems, handleLocationChange, handleActivatePinMode, removeLocation }) {
//     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: location.id });
//     const style = { transform: CSS.Transform.toString(transform), transition };

//     return (
//         <div ref={setNodeRef} style={style} className="flex items-center space-x-2 bg-white">
//             <button {...attributes} {...listeners} className="p-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
//                 <GripVertical size={20} />
//             </button>
//             <input
//                 type="text"
//                 value={location.value}
//                 onChange={(e) => handleLocationChange(index, e.target.value, type)}
//                 placeholder={`Enter ${type} location`}
//                 className={`w-full p-3 border rounded-lg transition-all ${ isActive ? 'border-green-500 ring-2 ring-green-500' : `border-gray-300 focus:ring-${type === 'pickup' ? 'emerald' : 'red'}-500 focus:border-${type === 'pickup' ? 'emerald' : 'red'}-500` }`}
//             />
//             <button onClick={() => handleActivatePinMode(type, index)} className="p-3 text-gray-400 hover:text-blue-600"><Pin size={20} /></button>
//             {totalItems > 1 && (<button onClick={() => removeLocation(location.id, type)} className="p-3 text-gray-400 hover:text-red-600"><X size={20} /></button>)}
//         </div>
//     );
// }

// export default function BookingPage() {
//     const navigate = useNavigate();
//     const { state: initial_state } = useLocation();
//     const createLocation = (value = '') => ({ id: Date.now() + Math.random(), value });

//     const [pickups, setPickups] = useState(initial_state?.pickups?.map(p => createLocation(p)) || [createLocation('Fetching your location...')]);
//     const [drops, setDrops] = useState(initial_state?.drops?.map(d => createLocation(d)) || [createLocation('')]);
//     const [activeInputForMap, setActiveInputForMap] = useState(null);
//     const [draggableMarkerPosition, setDraggableMarkerPosition] = useState(null);
//     const [isVehicleSelectionVisible, setVehicleSelectionVisible] = useState(false);
//     const [vehicleOptions, setVehicleOptions] = useState([]);
//     const [selectedVehicle, setSelectedVehicle] = useState(null);
//     const [routeDistance, setRouteDistance] = useState(0);

//     useEffect(() => {
//         const validPickups = pickups.filter(p => p.value && p.value !== 'Fetching your location...');
//         const validDrops = drops.filter(d => d.value);

//         if (validPickups.length > 0 && validDrops.length > 0) {
//             const baseFare = 40;
//             const perKmRates = {
//                 moto: 10,
//                 comfort: 15,
//                 luxury: 25,
//             };

//             setVehicleOptions([
//                 { id: 'moto', name: 'Moto', icon: Bike, capacity: 1, price: Math.round(baseFare + routeDistance * perKmRates.moto) },
//                 { id: 'comfort', name: 'Comfort', icon: Car, capacity: 4, price: Math.round(baseFare + routeDistance * perKmRates.comfort) },
//                 { id: 'luxury', name: 'Luxury', icon: Gem, capacity: 4, price: Math.round(baseFare + routeDistance * perKmRates.luxury) }
//             ]);
//         }
//     }, [pickups, drops, routeDistance]);

//     useEffect(() => {
//         const shouldFetchLocation = !initial_state?.pickups || initial_state.pickups[0]?.value === 'Fetching your location...';
//         if (!shouldFetchLocation) return;

//         const fetchAddress = async (lat, lon) => {
//             const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
//             if (!apiKey) {
//                 console.error("API Key is missing!");
//                 setPickups([createLocation("Could not fetch location.")]);
//                 return;
//             }
//             try {
//                 const response = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lon}&point.lat=${lat}`);
//                 const data = await response.json();
//                 if (data.features && data.features.length > 0) {
//                     setPickups([createLocation(data.features[0].properties.label)]);
//                 } else {
//                     setPickups([createLocation("Location not found.")]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching address:", error);
//                 setPickups([createLocation("Could not fetch location.")]);
//             }
//         };

//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     fetchAddress(latitude, longitude);
//                 },
//                 (error) => {
//                     console.error("Geolocation error:", error);
//                     setPickups([createLocation("Please enable location access.")]);
//                 }
//             );
//         } else {
//             setPickups([createLocation("Geolocation is not supported by this browser.")]);
//         }
//     }, [initial_state]);

//     const handleMarkerDragEnd = async (latlng) => {
//         if (!activeInputForMap) return;
//         const { lat, lng } = latlng;
//         const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

//         try {
//             const response = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lng}&point.lat=${lat}`);
//             const data = await response.json();
//             if (data.features && data.features.length > 0) {
//                 const address = data.features[0].properties.label;
//                 const { type, index } = activeInputForMap;

//                 if (type === 'pickup') {
//                     const updatedPickups = [...pickups];
//                     updatedPickups[index].value = address;
//                     setPickups(updatedPickups);
//                 } else {
//                     const updatedDrops = [...drops];
//                     updatedDrops[index].value = address;
//                     setDrops(updatedDrops);
//                 }
//             }
//         } catch (error) {
//             console.error("Error reverse geocoding:", error);
//         } finally {
//             setDraggableMarkerPosition(null);
//             setActiveInputForMap(null);
//         }
//     };

//     const handleActivatePinMode = (type, index) => {
//         setActiveInputForMap({ type, index });
//         setDraggableMarkerPosition([28.67, 77.42]);
//     };

//     const handleLocationChange = (index, value, type) => {
//         if (type === 'pickup') {
//             const updatedPickups = [...pickups];
//             updatedPickups[index].value = value;
//             setPickups(updatedPickups);
//         } else {
//             const updatedDrops = [...drops];
//             updatedDrops[index].value = value;
//             setDrops(updatedDrops);
//         }
//     };

//     const addLocation = (type) => {
//         if (type === 'pickup') {
//             setPickups([...pickups, createLocation()]);
//         } else {
//             setDrops([...drops, createLocation()]);
//         }
//     };

//     const removeLocation = (id, type) => {
//         if (type === 'pickup') {
//             setPickups(currentPickups => currentPickups.filter((p) => p.id !== id));
//         } else {
//             setDrops(currentDrops => currentDrops.filter((d) => d.id !== id));
//         }
//     };

//     const sensors = useSensors(
//         useSensor(PointerSensor),
//         useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
//     );

//     function handleDragEnd(event) {
//         const { active, over } = event;

//         if (over && active.id !== over.id) {
//             const isPickup = pickups.some(p => p.id === active.id);

//             if (isPickup) {
//                 setPickups((items) => {
//                     const oldIndex = items.findIndex(item => item.id === active.id);
//                     const newIndex = items.findIndex(item => item.id === over.id);
//                     return arrayMove(items, oldIndex, newIndex);
//                 });
//             } else {
//                 setDrops((items) => {
//                     const oldIndex = items.findIndex(item => item.id === active.id);
//                     const newIndex = items.findIndex(item => item.id === over.id);
//                     return arrayMove(items, oldIndex, newIndex);
//                 });
//             }
//         }
//     }

//     const handleCancel = () => navigate('/');

//     const handleOpenVehicleSelection = () => {
//         const pickupValues = pickups.map(p => p.value).filter(p => p && p !== 'Fetching your location...');
//         const dropValues = drops.map(d => d.value).filter(Boolean);

//         if (pickupValues.length === 0 || dropValues.length === 0) {
//             alert("Please enter at least one valid pickup and drop-off location.");
//             return;
//         }

//         setSelectedVehicle(null);
//         setVehicleSelectionVisible(true);
//     };

//     const handleFinalBooking = () => {
//         if (!selectedVehicle) {
//             alert("Please select a vehicle to continue.");
//             return;
//         }

//         setVehicleSelectionVisible(false);
//         navigate('/booked', {
//             state: {
//                 selectedVehicle: {
//                     id: selectedVehicle.id,
//                     name: selectedVehicle.name,
//                     capacity: selectedVehicle.capacity,
//                     price: selectedVehicle.price
//                 },
//                 pickups: pickups.map(p => p.value).filter(p => p && p !== 'Fetching your location...'),
//                 drops: drops.map(d => d.value).filter(Boolean)
//             }
//         });
//     };

//     return (
//         <div className="bg-gray-50">
//             {activeInputForMap && (
//                 <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-5 rounded-lg shadow-lg z-[1000] text-center">
//                     Drag the green marker to set the location for <br />
//                     <span className="font-bold">{activeInputForMap.type === 'pickup' ? 'Pickup' : 'Drop-off'} #{activeInputForMap.index + 1}</span>
//                 </div>
//             )}
//             <div className="max-w-7xl mx-auto">
//                 <div className="grid lg:grid-cols-2 lg:gap-12 min-h-screen">
//                     <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
//                         <div className="w-full max-w-lg mx-auto lg:mx-0">
//                             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Your Ride Itinerary</h1>
//                             <p className="mt-3 text-lg text-gray-600">Drag & drop to reorder stops, or click the <Pin size={16} className="inline-block text-blue-600" /> icon to use the map marker.</p>
//                             <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//                                 <div className="mt-10 space-y-6">
//                                     <div className="space-y-4">
//                                         <h3 className="font-semibold text-gray-500 flex items-center"><MapPin className="h-5 w-5 mr-2 text-emerald-500" />Pickup(s)</h3>
//                                         <SortableContext items={pickups} strategy={verticalListSortingStrategy}>
//                                             <div className="space-y-2">
//                                                 {pickups.map((loc, index) => (
//                                                     <SortableLocationItem
//                                                         key={loc.id}
//                                                         location={loc}
//                                                         index={index}
//                                                         type="pickup"
//                                                         isActive={activeInputForMap?.type === 'pickup' && activeInputForMap?.index === index}
//                                                         totalItems={pickups.length}
//                                                         handleLocationChange={handleLocationChange}
//                                                         handleActivatePinMode={handleActivatePinMode}
//                                                         removeLocation={removeLocation}
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </SortableContext>
//                                         <button onClick={() => addLocation('pickup')} className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 pt-2"><Plus size={16} className="mr-1" /> Add another pickup</button>
//                                     </div>
//                                     <div className="space-y-4">
//                                         <h3 className="font-semibold text-gray-500 flex items-center"><Navigation className="h-5 w-5 mr-2 text-red-500" />Drop-off(s)</h3>
//                                         <SortableContext items={drops} strategy={verticalListSortingStrategy}>
//                                             <div className="space-y-2">
//                                                 {drops.map((loc, index) => (
//                                                     <SortableLocationItem
//                                                         key={loc.id}
//                                                         location={loc}
//                                                         index={index}
//                                                         type="drop"
//                                                         isActive={activeInputForMap?.type === 'drop' && activeInputForMap?.index === index}
//                                                         totalItems={drops.length}
//                                                         handleLocationChange={handleLocationChange}
//                                                         handleActivatePinMode={handleActivatePinMode}
//                                                         removeLocation={removeLocation}
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </SortableContext>
//                                         <button onClick={() => addLocation('drop')} className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 pt-2"><Plus size={16} className="mr-1" /> Add another drop-off</button>
//                                     </div>
//                                 </div>
//                             </DndContext>
//                             <div className="mt-12 border-t pt-8">
//                                 <div className="flex flex-col gap-4">
//                                     <button onClick={handleOpenVehicleSelection} className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 font-semibold shadow-md flex items-center justify-center text-lg">
//                                         Confirm & Book Ride <CheckCircle className="ml-2 h-6 w-6" />
//                                     </button>
//                                     <button onClick={handleCancel} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center">
//                                         <ArrowLeft className="mr-2 h-5 w-5" /> Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="lg:sticky lg:top-0 h-96 lg:h-screen py-8 lg:py-16 pl-6 lg:pl-0 pr-6 lg:pr-8">
//                         <div className="w-full h-full bg-gray-200 rounded-2xl shadow-xl overflow-hidden">
//                             <OpenSourceRouteMap
//                                 pickups={pickups.map(p => p.value)}
//                                 drops={drops.map(d => d.value)}
//                                 draggableMarkerPosition={draggableMarkerPosition}
//                                 onMarkerDragEnd={handleMarkerDragEnd}
//                                 setRouteDistance={setRouteDistance}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <VehicleSelectionSheet
//                 isOpen={isVehicleSelectionVisible}
//                 onClose={() => setVehicleSelectionVisible(false)}
//                 vehicles={vehicleOptions}
//                 selectedVehicle={selectedVehicle}
//                 onSelectVehicle={setSelectedVehicle}
//                 onConfirm={handleFinalBooking}
//             />
//         </div>
//     );
// }


// BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, CheckCircle, ArrowLeft, X, Plus, Pin, GripVertical, Bike, Car, Gem, Users, Clock } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import OpenSourceRouteMap from '../../components/OpenSourceRouteMap';

function VehicleSelectionSheet({ isOpen, onClose, vehicles, selectedVehicle, onSelectVehicle, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>
            <div className={`relative w-full max-w-lg mx-auto bg-gradient-to-b from-white to-gray-50 rounded-t-3xl shadow-2xl transition-transform duration-500 ease-out ${
                isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className="flex justify-center pt-4">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
                <div className="p-6 pb-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Choose Your Ride
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">Select your preferred vehicle type</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-400" />
                        </button>
                    </div>
                    <div className="space-y-4 mb-8">
                        {vehicles.map((vehicle, index) => (
                            <div
                                key={vehicle.id}
                                onClick={() => onSelectVehicle(vehicle)}
                                className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                                    selectedVehicle?.id === vehicle.id
                                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg ring-2 ring-emerald-200'
                                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {selectedVehicle?.id === vehicle.id && (
                                    <div className="absolute top-3 right-3">
                                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                )}
                                <div className={`p-3 rounded-xl mr-4 ${
                                    selectedVehicle?.id === vehicle.id
                                        ? 'bg-emerald-100'
                                        : 'bg-gray-100'
                                }`}>
                                    <vehicle.icon className={`h-8 w-8 ${
                                        selectedVehicle?.id === vehicle.id
                                            ? 'text-emerald-600'
                                            : 'text-gray-600'
                                    }`} />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-xl text-gray-900">{vehicle.name}</h3>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">₹{vehicle.price}</p>
                                            <p className="text-xs text-gray-500">estimated fare</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="h-4 w-4 mr-1.5 text-gray-500" />
                                            <span>{vehicle.capacity} seats</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                                            <span>2-5 min</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {vehicle.id === 'moto' && 'Quick & affordable for solo rides'}
                                        {vehicle.id === 'comfort' && 'Comfortable rides for small groups'}
                                        {vehicle.id === 'luxury' && 'Premium experience with top-tier vehicles'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onConfirm}
                        disabled={!selectedVehicle}
                        className={`w-full py-5 px-6 rounded-2xl text-lg font-bold transition-all duration-300 transform active:scale-95 ${
                            selectedVehicle
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <div className="flex items-center justify-center space-x-3">
                            {selectedVehicle ? (
                                <>
                                    <span>Book {selectedVehicle.name} for ₹{selectedVehicle.price}</span>
                                    <CheckCircle className="h-6 w-6" />
                                </>
                            ) : (
                                <span>Select a Ride</span>
                            )}
                        </div>
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        Final fare may vary based on actual distance and waiting time
                    </p>
                </div>
            </div>
        </div>
    );
}

function SortableLocationItem({ location, index, type, isActive, totalItems, handleLocationChange, handleActivatePinMode, removeLocation }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: location.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center space-x-2 bg-white">
            <button {...attributes} {...listeners} className="p-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                <GripVertical size={20} />
            </button>
            <input
                type="text"
                value={location.value}
                onChange={(e) => handleLocationChange(index, e.target.value, type)}
                placeholder={`Enter ${type} location`}
                className={`w-full p-3 border rounded-lg transition-all ${ isActive ? 'border-green-500 ring-2 ring-green-500' : `border-gray-300 focus:ring-${type === 'pickup' ? 'emerald' : 'red'}-500 focus:border-${type === 'pickup' ? 'emerald' : 'red'}-500` }`}
            />
            <button onClick={() => handleActivatePinMode(type, index)} className="p-3 text-gray-400 hover:text-blue-600"><Pin size={20} /></button>
            {totalItems > 1 && (<button onClick={() => removeLocation(location.id, type)} className="p-3 text-gray-400 hover:text-red-600"><X size={20} /></button>)}
        </div>
    );
}

export default function BookingPage() {
    const navigate = useNavigate();
    const { state: initial_state } = useLocation();
    const createLocation = (value = '') => ({ id: Date.now() + Math.random(), value });

    // === AUTH CHECK: Redirect to login if not logged in ===
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);
    // =======================================================

    const [pickups, setPickups] = useState(initial_state?.pickups?.map(p => createLocation(p)) || [createLocation('Fetching your location...')]);
    const [drops, setDrops] = useState(initial_state?.drops?.map(d => createLocation(d)) || [createLocation('')]);
    const [activeInputForMap, setActiveInputForMap] = useState(null);
    const [draggableMarkerPosition, setDraggableMarkerPosition] = useState(null);
    const [isVehicleSelectionVisible, setVehicleSelectionVisible] = useState(false);
    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [routeDistance, setRouteDistance] = useState(0);

    useEffect(() => {
        const validPickups = pickups.filter(p => p.value && p.value !== 'Fetching your location...');
        const validDrops = drops.filter(d => d.value);

        if (validPickups.length > 0 && validDrops.length > 0) {
            const baseFare = 40;
            const perKmRates = {
                moto: 10,
                comfort: 15,
                luxury: 25,
            };

            setVehicleOptions([
                { id: 'moto', name: 'Moto', icon: Bike, capacity: 1, price: Math.round(baseFare + routeDistance * perKmRates.moto) },
                { id: 'comfort', name: 'Comfort', icon: Car, capacity: 4, price: Math.round(baseFare + routeDistance * perKmRates.comfort) },
                { id: 'luxury', name: 'Luxury', icon: Gem, capacity: 4, price: Math.round(baseFare + routeDistance * perKmRates.luxury) }
            ]);
        }
    }, [pickups, drops, routeDistance]);

    useEffect(() => {
        const shouldFetchLocation = !initial_state?.pickups || initial_state.pickups[0]?.value === 'Fetching your location...';
        if (!shouldFetchLocation) return;

        const fetchAddress = async (lat, lon) => {
            const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
            if (!apiKey) {
                console.error("API Key is missing!");
                setPickups([createLocation("Could not fetch location.")]);
                return;
            }
            try {
                const response = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lon}&point.lat=${lat}`);
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    setPickups([createLocation(data.features[0].properties.label)]);
                } else {
                    setPickups([createLocation("Location not found.")]);
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                setPickups([createLocation("Could not fetch location.")]);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchAddress(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setPickups([createLocation("Please enable location access.")]);
                }
            );
        } else {
            setPickups([createLocation("Geolocation is not supported by this browser.")]);
        }
    }, [initial_state]);

    const handleMarkerDragEnd = async (latlng) => {
        if (!activeInputForMap) return;
        const { lat, lng } = latlng;
        const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

        try {
            const response = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lng}&point.lat=${lat}`);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const address = data.features[0].properties.label;
                const { type, index } = activeInputForMap;

                if (type === 'pickup') {
                    const updatedPickups = [...pickups];
                    updatedPickups[index].value = address;
                    setPickups(updatedPickups);
                } else {
                    const updatedDrops = [...drops];
                    updatedDrops[index].value = address;
                    setDrops(updatedDrops);
                }
            }
        } catch (error) {
            console.error("Error reverse geocoding:", error);
        } finally {
            setDraggableMarkerPosition(null);
            setActiveInputForMap(null);
        }
    };

    const handleActivatePinMode = (type, index) => {
        setActiveInputForMap({ type, index });
        setDraggableMarkerPosition([28.67, 77.42]);
    };

    const handleLocationChange = (index, value, type) => {
        if (type === 'pickup') {
            const updatedPickups = [...pickups];
            updatedPickups[index].value = value;
            setPickups(updatedPickups);
        } else {
            const updatedDrops = [...drops];
            updatedDrops[index].value = value;
            setDrops(updatedDrops);
        }
    };

    const addLocation = (type) => {
        if (type === 'pickup') {
            setPickups([...pickups, createLocation()]);
        } else {
            setDrops([...drops, createLocation()]);
        }
    };

    const removeLocation = (id, type) => {
        if (type === 'pickup') {
            setPickups(currentPickups => currentPickups.filter((p) => p.id !== id));
        } else {
            setDrops(currentDrops => currentDrops.filter((d) => d.id !== id));
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const isPickup = pickups.some(p => p.id === active.id);

            if (isPickup) {
                setPickups((items) => {
                    const oldIndex = items.findIndex(item => item.id === active.id);
                    const newIndex = items.findIndex(item => item.id === over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            } else {
                setDrops((items) => {
                    const oldIndex = items.findIndex(item => item.id === active.id);
                    const newIndex = items.findIndex(item => item.id === over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        }
    }

    const handleCancel = () => navigate('/');

    const handleOpenVehicleSelection = () => {
        const pickupValues = pickups.map(p => p.value).filter(p => p && p !== 'Fetching your location...');
        const dropValues = drops.map(d => d.value).filter(Boolean);

        if (pickupValues.length === 0 || dropValues.length === 0) {
            alert("Please enter at least one valid pickup and drop-off location.");
            return;
        }

        setSelectedVehicle(null);
        setVehicleSelectionVisible(true);
    };

    const handleFinalBooking = () => {
        if (!selectedVehicle) {
            alert("Please select a vehicle to continue.");
            return;
        }
        const names = ['Ramesh Kumar', 'Alice Singh', 'Bob Builder', 'Kalu Lala', 'Mike'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomPlate = `DL${Math.floor(Math.random() * 90 + 10)}AB${Math.floor(Math.random() * 9000 + 1000)}`;
        const randomRating = (Math.random() * 1 + 4).toFixed(1);
        const driverData = { name: randomName, plate: randomPlate, rating: randomRating };
        const arrivalMinutes = Math.floor(Math.random() * 3) + 1;
        const destMinutes = Math.floor(Math.random() * 11) + 5;

        setVehicleSelectionVisible(false);
        navigate('/payment', {
            state: {
                selectedVehicle: {
                    id: selectedVehicle.id,
                    name: selectedVehicle.name,
                    capacity: selectedVehicle.capacity,
                    price: selectedVehicle.price
                },
                pickups: pickups.map(p => p.value).filter(p => p && p !== 'Fetching your location...'),
                drops: drops.map(d => d.value).filter(Boolean),
                driver: driverData,
                arrivalTime: arrivalMinutes,
                destinationTime: destMinutes
            }
        });
    };

    return (
        <div className="bg-gray-50">
            {activeInputForMap && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-5 rounded-lg shadow-lg z-[1000] text-center">
                    Drag the green marker to set the location for <br />
                    <span className="font-bold">{activeInputForMap.type === 'pickup' ? 'Pickup' : 'Drop-off'} #{activeInputForMap.index + 1}</span>
                </div>
            )}
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 lg:gap-12 min-h-screen">
                    <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="w-full max-w-lg mx-auto lg:mx-0">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Your Ride Itinerary</h1>
                            <p className="mt-3 text-lg text-gray-600">Drag & drop to reorder stops, or click the <Pin size={16} className="inline-block text-blue-600" /> icon to use the map marker.</p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <div className="mt-10 space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-500 flex items-center"><MapPin className="h-5 w-5 mr-2 text-emerald-500" />Pickup(s)</h3>
                                        <SortableContext items={pickups} strategy={verticalListSortingStrategy}>
                                            <div className="space-y-2">
                                                {pickups.map((loc, index) => (
                                                    <SortableLocationItem
                                                        key={loc.id}
                                                        location={loc}
                                                        index={index}
                                                        type="pickup"
                                                        isActive={activeInputForMap?.type === 'pickup' && activeInputForMap?.index === index}
                                                        totalItems={pickups.length}
                                                        handleLocationChange={handleLocationChange}
                                                        handleActivatePinMode={handleActivatePinMode}
                                                        removeLocation={removeLocation}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                        <button onClick={() => addLocation('pickup')} className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 pt-2"><Plus size={16} className="mr-1" /> Add another pickup</button>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-500 flex items-center"><Navigation className="h-5 w-5 mr-2 text-red-500" />Drop-off(s)</h3>
                                        <SortableContext items={drops} strategy={verticalListSortingStrategy}>
                                            <div className="space-y-2">
                                                {drops.map((loc, index) => (
                                                    <SortableLocationItem
                                                        key={loc.id}
                                                        location={loc}
                                                        index={index}
                                                        type="drop"
                                                        isActive={activeInputForMap?.type === 'drop' && activeInputForMap?.index === index}
                                                        totalItems={drops.length}
                                                        handleLocationChange={handleLocationChange}
                                                        handleActivatePinMode={handleActivatePinMode}
                                                        removeLocation={removeLocation}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                        <button onClick={() => addLocation('drop')} className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 pt-2"><Plus size={16} className="mr-1" /> Add another drop-off</button>
                                    </div>
                                </div>
                            </DndContext>
                            <div className="mt-12 border-t pt-8">
                                <div className="flex flex-col gap-4">
                                    <button onClick={handleOpenVehicleSelection} className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 font-semibold shadow-md flex items-center justify-center text-lg">
                                        Confirm & Book Ride <CheckCircle className="ml-2 h-6 w-6" />
                                    </button>
                                    <button onClick={handleCancel} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center">
                                        <ArrowLeft className="mr-2 h-5 w-5" /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:sticky lg:top-0 h-96 lg:h-screen py-8 lg:py-16 pl-6 lg:pl-0 pr-6 lg:pr-8">
                        <div className="w-full h-full bg-gray-200 rounded-2xl shadow-xl overflow-hidden">
                            <OpenSourceRouteMap
                                pickups={pickups.map(p => p.value)}
                                drops={drops.map(d => d.value)}
                                draggableMarkerPosition={draggableMarkerPosition}
                                onMarkerDragEnd={handleMarkerDragEnd}
                                setRouteDistance={setRouteDistance}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <VehicleSelectionSheet
                isOpen={isVehicleSelectionVisible}
                onClose={() => setVehicleSelectionVisible(false)}
                vehicles={vehicleOptions}
                selectedVehicle={selectedVehicle}
                onSelectVehicle={setSelectedVehicle}
                onConfirm={handleFinalBooking}
            />
        </div>
    );
}