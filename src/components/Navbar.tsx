"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, Leaf, User, LogOut, LogIn, Info, DollarSign, TreePine, Bell } from "lucide-react";
import LeafSVG from "./LeafSVG";
// import NotificationModal from "../app/notificationshistory/page";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const leaves = document.querySelectorAll('.parallax-leaf');
      
      leaves.forEach((leaf, index) => {
        const speed = index % 2 === 0 ? 0.03 : 0.05;
        const x = (window.innerWidth - e.pageX * speed) / 50;
        const y = (window.innerHeight - e.pageY * speed) / 50;
        
        (leaf as HTMLElement).style.transform = `translateX(${x}px) translateY(${y}px) rotate(${x + y}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSignIn = () => {
    signIn();
    setOpen(false);
  };
  
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setOpen(false);
  };

  return (
    <>
      <nav ref={navbarRef} className="relative bg-gradient-to-r from-plant-moss/30 to-plant-sky/20 backdrop-blur-sm shadow-lg py-4 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <LeafSVG 
            className="parallax-leaf text-plant-leaf top-2 left-5 w-12 h-12 opacity-20" 
            rotation={15} 
          />
          <LeafSVG 
            className="parallax-leaf text-plant-moss top-5 right-10 w-16 h-16 opacity-10" 
            rotation={-20} 
          />
          <LeafSVG 
            className="parallax-leaf text-plant-forest bottom-0 left-1/3 w-10 h-10 opacity-10" 
            rotation={45} 
          />
          <LeafSVG 
            className="parallax-leaf text-plant-leaf/30 bottom-1 right-1/4 w-14 h-14" 
            rotation={-10} 
          />
        </div>

        <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <Link href="/" className="flex items-center space-x-2 group">
            <Leaf className="h-7 w-7 text-plant-forest group-hover:text-plant-leaf transition-colors duration-300 animate-sway" />
            <span className="text-2xl font-playfair font-semibold text-plant-forest group-hover:text-plant-leaf transition-colors duration-300">
              MyPlants
            </span>
          </Link>

          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-plant-forest hover:text-plant-leaf focus:outline-none focus:ring-2 focus:ring-plant-leaf rounded-full transition-colors duration-300"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link href="/plants/fetchPlant" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
                  <User className="h-5 w-5" />
                  <span>See All Plants</span>
                </Link>
                <Link href="/plants/addPlant" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
                  <User className="h-5 w-5" />
                  <span>Add Plant</span>
                </Link>
              <Link href="/request" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
                <User className="h-5 w-5" />
                <span>Handover Requests</span>
              </Link>
              <Link href="/community" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
                <User className="h-5 w-5" />
                <span>Communities</span>
              </Link>
              



              <Link href="/N" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
                <User className="h-5 w-5" />
                <span>Send Notification</span>
              </Link>
                    


                <button
                  onClick={handleSignOut}
                  className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            )}

            <Link href="/gardenPlanner" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
              <TreePine className="h-5 w-5" />
              <span>Garden Planner</span>
            </Link>

            <Link href="/manageTasks" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
              <Info className="h-5 w-5" />
              <span>ManageTasks</span>
            </Link>

            <button
              onClick={openModal}
              className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300"
              aria-label="Notifications"
            >
              <Bell className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <Link
              href="/cv"
              className="px-4 py-2 bg-plant-leaf text-white rounded-full font-medium hover:bg-plant-forest shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Manage Your Gardens
            </Link>
          </div>
        </div>

        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } mt-2`}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mt-2 space-y-3 border border-plant-moss/20 overflow-y-auto max-h-96">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-3 p-2 text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link 
                  href="/plants/fetchPlant" 
                  className="flex items-center space-x-3 p-2 text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>See All Plants</span>
                </Link>
                <Link 
                  href="/plants/addPlant" 
                  className="flex items-center space-x-3 p-2 text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Add Plant</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 p-2 w-full text-left text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-3 p-2 w-full text-left text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            )}

            <Link 
              href="/gardenplanner" 
              className="flex items-center space-x-3 p-2 text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              <TreePine className="h-5 w-5" />
              <span>Garden Planner</span>
            </Link>
            
            <Link 
              href="/manageTasks" 
              className="flex items-center space-x-3 p-2 text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              <Info className="h-5 w-5" />
              <span>ManageTasks</span>
            </Link>


            <Link href="/community" className="plant-link flex items-center space-x-2 text-plant-forest hover:text-plant-leaf transition-colors duration-300">
                <User className="h-5 w-5" />
                <span>Communities</span>
              </Link>
              

            <button
              onClick={() => {
                openModal();
                setOpen(false);
              }}
              className="flex items-center space-x-3 p-2 w-full text-left text-plant-forest hover:text-plant-leaf hover:bg-plant-moss/10 rounded-lg transition-colors duration-200"
            >
              <Bell className="h-7 w-7" />
              <span>Notifications</span>
            </button>

            <Link
              href="/cv"
              className="block text-center py-2 px-4 bg-plant-leaf text-white rounded-lg font-medium hover:bg-plant-forest transition-colors duration-200 mt-4"
              onClick={() => setOpen(false)}
            >
              Manage Your Gardens
            </Link>
          </div>
        </div>
      </nav>

      {/* <NotificationModal isOpen={isModalOpen} onClose={closeModal} /> */}
    </>
  );
};

export default Navbar;