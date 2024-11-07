import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { db } from '../firebaseConfig'; // Import Firestore configuration
import { collection, getDocs } from 'firebase/firestore';
import SearchLocationInput from '../components/GooglePlacesApi';
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants"; // Importing the API key

// Function to calculate the distance between two lat/lng points (in meters)
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // returns the distance in meters
};

const DonorMap = () => {
    const navigate = useNavigate();

    // State for user-selected location and shelter data
    const [selectedLocation, setSelectedLocation] = useState({ lat: 51.509865, lng: -0.118092 }); // Default to London
    const [selectedAddress, setSelectedAddress] = useState(""); // Added state for address
    const [shelters, setShelters] = useState([]);  // Store all shelter data here
    const [selectedShelter, setSelectedShelter] = useState(null); // Selected shelter for InfoWindow
    const [zoomLevel, setZoomLevel] = useState(12); // Default zoom level

    // Fetch shelters from Firestore on component mount
    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const shelterCollection = collection(db, "charityDetails");
                const shelterSnapshot = await getDocs(shelterCollection);
                const shelterData = shelterSnapshot.docs.map(doc => doc.data());
                setShelters(shelterData);
            } catch (error) {
                console.error("Error fetching shelters:", error);
            }
        };

        fetchShelters();
    }, []);

    // Function to handle navigation
    const handleBack = () => {
        navigate(-1);
    };

    // Filter shelters based on distance to selected location
    const filteredShelters = shelters.filter(shelter => {
        if (shelter.lat && shelter.lng && !isNaN(shelter.lat) && !isNaN(shelter.lng)) {
            const distance = getDistance(selectedLocation.lat, selectedLocation.lng, shelter.lat, shelter.lng);
            return distance < 5000; // Only shelters within 5 km (5000 meters)
        }
        return false;
    });

    // Update zoom and map center when a location is selected
    const handleLocationChange = (location, address) => {
        setSelectedLocation(location);
        setSelectedAddress(address);
        setZoomLevel(14); // Zoom in closer when a new location is selected
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-3xl font-bold mb-4">Find Shelters Nearby</h2>

            {/* Location Search */}
            <div className="mb-4 w-full max-w-md">
                <SearchLocationInput
                    setSelectedLocation={handleLocationChange}
                    setSelectedAddress={setSelectedAddress}  // Passing setSelectedAddress
                />
            </div>

            {/* Map Display */}
            <div className="w-full h-96 mb-4">
                <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_MAPS_KEY} libraries={['places']}>
                    <GoogleMap
                        mapContainerStyle={{ height: "100%", width: "100%" }}
                        center={selectedLocation}
                        zoom={zoomLevel} // Dynamically set zoom level
                    >
                        {/* Marker for each shelter with validation */}
                        {filteredShelters.map((shelter, index) => (
                            <Marker
                                key={index}
                                position={{ lat: shelter.lat, lng: shelter.lng }}
                                onClick={() => setSelectedShelter(shelter)}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                }}
                            />
                        ))}

                        {/* InfoWindow for the selected shelter */}
                        {selectedShelter && (
                            <InfoWindow
                                position={{ lat: selectedShelter.lat, lng: selectedShelter.lng }}
                                onCloseClick={() => setSelectedShelter(null)}
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedShelter.charityName}</h3>
                                    <p><strong>Address:</strong> {selectedShelter.address}</p>
                                    <p><strong>Contact Number:</strong> {selectedShelter.contactNumber}</p>
                                    <p><strong>Registration Number:</strong> {selectedShelter.registrationNumber}</p>
                                    <p><strong>Beds Available:</strong> {selectedShelter.bedsAvailable}</p>
                                    <p><strong>Rate per Day:</strong> £{selectedShelter.ratePerDay}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>

            <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go Back
            </button>
        </div>
    );
};

export default DonorMap;