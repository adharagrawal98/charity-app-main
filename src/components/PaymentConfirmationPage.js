import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const PaymentConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [charity, setCharity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const charityID = queryParams.get('charityID');  // Get the charityID from the URL

        if (charityID) {
            const fetchCharity = async () => {
                try {
                    const charityDoc = doc(db, 'charityDetails', charityID);  // Fetch data from Firestore using charityID
                    const charityData = await getDoc(charityDoc);

                    if (charityData.exists()) {
                        setCharity(charityData.data());  // Set the charity data
                    } else {
                        console.error("Charity not found!");
                    }
                } catch (error) {
                    console.error("Error fetching charity details:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCharity();
        } else {
            // Handle case when charityID is not found in the URL (redirect to home or show error)
            console.error('No charityID found in URL');
            navigate('/');  // Redirect to home or error page
        }
    }, [location, navigate]);  // Re-run when the location or navigate changes

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading payment confirmation...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-center">Thank You for Your Payment!</h1>

                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-gray-200 rounded mb-6 flex items-center justify-center">
                    <p className="text-gray-500">QR Code will be displayed here.</p>
                </div>

                {/* Charity Details */}
                {charity ? (
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold mb-2">{charity.charityName}</h2>
                        <p className="text-gray-700 mb-1">
                            <strong>Address:</strong> {charity.address}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <strong>Contact:</strong> {charity.contactNumber}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <strong>Registration Number:</strong> {charity.registrationNumber}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mb-6">No charity details found.</p>
                )}

                {/* Instructions Section */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions for Donor</h3>
                    <p className="text-gray-600">
                        <strong>Show this QR code at the charity's location to receive services.</strong>
                    </p>
                </div>

                {/* Bottom-right Share Message */}
                <p className="text-gray-500 text-xs font-semibold text-right max-w-xs mb-4">
                    **Share this QR code with someone in need, and they can use it to reach the charity.**
                </p>

                {/* Print Button */}
                <button
                    onClick={() => window.print()} // Print functionality
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200 mt-4"
                >
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default PaymentConfirmationPage;