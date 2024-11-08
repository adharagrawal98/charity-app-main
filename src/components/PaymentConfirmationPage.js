// PaymentConfirmationPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const PaymentConfirmationPage = () => {
    const location = useLocation();
    const printRef = useRef(); // Ref for printable section
    const [charity, setCharity] = useState(null);
    const [authorizationID, setAuthorizationID] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const charityID = queryParams.get('charityID');
        const authID = queryParams.get('authorizationID');

        setAuthorizationID(authID);
        console.log("Authorization ID:", authID);

        if (charityID) {
            const fetchCharity = async () => {
                try {
                    const charityDoc = doc(db, 'charityDetails', charityID);
                    const charityData = await getDoc(charityDoc);

                    if (charityData.exists()) {
                        setCharity(charityData.data());
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
            console.error('No charityID found in URL');
        }
    }, [location]);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Payment Confirmation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin: 0;
                            padding: 20px;
                        }
                        .print-container {
                            max-width: 500px;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            background-color: #fff;
                        }
                        .text-center {
                            text-align: center;
                        }
                        .text-gray-700 {
                            color: #4a4a4a;
                        }
                        .font-semibold {
                            font-weight: 600;
                        }
                        .mb-6 {
                            margin-bottom: 1.5rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        ${printContents}
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading payment confirmation...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div ref={printRef} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-center">Payment Confirmation</h1>

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
                            <strong>Registration #:</strong> {charity.registrationNumber}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mb-6">Error loading charity details.</p>
                )}

                {/* Instructions Section */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions for Donor</h3>
                    <p className="text-gray-600">
                        <strong>Show this QR code at the charity's location to confirm your donation.</strong>
                    </p>
                </div>

                {/* Bottom-right Share Message inside the main div */}
                <p className="text-gray-500 text-xs font-semibold text-right max-w-xs mb-4">
                    **Share this QR code with someone in need, and they can use it to reach the charity.**
                </p>

                {/* Print Button at the bottom */}
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200 mt-4"
                >
                    Print Confirmation
                </button>
            </div>
        </div>
    );
};

export default PaymentConfirmationPage;