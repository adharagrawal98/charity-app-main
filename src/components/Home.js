// src/components/Home.js
import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebaseConfig';
// import { signOut } from 'firebase/auth';
import backgroundImage from '../assets/home1.jpg';

const Home = ({ user }) => {
    // const navigate = useNavigate();

    // const handleSignOut = async () => {
    //     try {
    //         await signOut(auth);
    //         navigate('/login'); // Redirect to login after sign out
    //     } catch (error) {
    //         console.error("Error signing out: ", error);
    //     }
    // };

    return (
        <div className="relative h-screen bg-no-repeat bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
            {/* Navbar
            <nav className="flex items-center justify-between p-4 md:p-6 bg-black bg-opacity-50">
                <div className="text-white text-xl md:text-2xl font-bold">Shelter App</div>
                <div className="flex space-x-2 md:space-x-4">
                    <button className="text-white text-sm md:text-base hover:text-blue-300" onClick={() => navigate('/testimonials')}>Testimonials</button>
                    <button className="text-white text-sm md:text-base hover:text-blue-300" onClick={() => navigate('/contact')}>Contact Us</button>
                    {user ? (
                        <button className="text-white text-sm md:text-base hover:text-blue-300" onClick={handleSignOut}>Sign Out</button>
                    ) : (
                        <button className="text-white text-sm md:text-base hover:text-blue-300" onClick={() => navigate('/signup')}>Signup/Login</button>
                    )}
                </div>
            </nav> */}

            {/* Overlay Text  */}
            <div className="absolute inset-0 flex flex-col items-end justify-start text-right p-6 md:p-20 bg-black bg-opacity-40">
                <h1 className="text-3xl sm:text-l md:text-5xl lg:text-6xl font-extrabold mt-1 mb-3 "
                    style={{ color: '#5fedc0', textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)' }}>
                    Give Shelter, Give Hope
                </h1>
                <h3 className="text-lg sm:text-xl md:text-2xl mb-4 font-semibold italic tracking-wider"
                    style={{ color: '#5fedc0', textShadow: '1px 1px 8px rgba(0, 0, 0, 0.4)' }}>
                    Empower the homeless with your donation.
                </h3>
                <p className="text-sm sm:text-lg md:text-xl font-light tracking-wide leading-relaxed max-w-xs sm:max-w-md md:max-w-lg"
                    style={{ color: '#5fedc0', textShadow: '1px 1px 6px rgba(0, 0, 0, 0.3)' }}>
                    Donate directly to shelters and provide immediate relief to those in need.
                </p>
            </div>
        </div>
    );
};

export default Home;