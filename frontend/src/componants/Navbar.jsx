import { useEffect, useRef, useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles';
import { ChevronDown, LogOut, User, Wallet } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api"

const Navbar = ({ user: propUser, onLogout }) => {
    const navigate = useNavigate();
    const menuRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(propUser || { name: "", email: "" });

    // const user = propUser || {
    //     name: "",
    //     email: "",
    // };
    // to fetch the suer data from server
    useEffect(() => {
        const fetchUserData = async () => {

            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(`${BASE_URL}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = response.data.user || response.data;
                setUser(userData);
            }
            catch (error) {
                console.error("failed to load profile", error);
            }
        };
        if (!propUser) {
            fetchUserData();
        }
    }, [propUser]);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleLogout = () => {
        setMenuOpen(false);
        localStorage.removeItem("token");
        onLogout?.();
        navigate("/login");
    };

    //close the toggle menu if click outsude the box

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={navbarStyles.header}>
            <div className={navbarStyles.container}>
                {/* logo */}
                <div
                    onClick={() => navigate("/")}
                    className={navbarStyles.logoContainer}
                >
                    <div className={`${navbarStyles.logoImage} flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-500 text-white`}>
                        <Wallet className="w-6 h-6" />
                    </div>
                    <span className={navbarStyles.logoText}>Expense Tracker</span>
                </div>


                {/* if the user is present */}


                {user && (
                    <div className={navbarStyles.userContainer} ref={menuRef}>
                        <button onClick={toggleMenu} className={navbarStyles.userButton}>
                            <div className=" relative">
                                <div className={navbarStyles.userAvatar}>
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className={navbarStyles.statusIndicator}></div>
                            </div>
                            <div className={navbarStyles.userTextContainer}>
                                <p className={navbarStyles.userName}>{user?.name || "user"}
                                </p>
                                <p className={navbarStyles.userEmail}>
                                    {user?.email || "user@expensetracker.com"}
                                </p>
                            </div>
                            <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
                        </button>

                        {/* dropdown menu */}

                        {menuOpen && (
                            <div className={navbarStyles.dropdownMenu}>
                                <div className={navbarStyles.dropdownHeader}>
                                    <div className="flex item-center gap-3">
                                        <div className={navbarStyles.dropdownAvatar}>
                                            {user?.name?.[0]?.toUpperCase() || "U"}

                                        </div>
                                        <div>
                                            <div className={navbarStyles.dropdownName}>
                                                {user?.name || "user"}
                                            </div>
                                            <div className={navbarStyles.dropdownEmail}>
                                                {user?.email || "user@expensetracker.com"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={navbarStyles.menuItemContainer}>
                                    <button onClick={() => {
                                        setMenuOpen(false);
                                        navigate("/profile");
                                    }}
                                        className={navbarStyles.menuItem}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </button>

                                </div>
                                <div className={navbarStyles.menuItemBorder}>
                                    <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                                        <LogOut className=" w-4 h-4" />
                                        <span>Log Out</span>
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </header>
    );
};

export default Navbar;
