import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShopContext } from "../../context/ShopContext";
import logo from "../../assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";
import userPlaceholder from "../../assets/user.png";

const Navbar = () => {
  const { getTotalCartItem } = useShopContext();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const load = () => {
      const cuRaw = localStorage.getItem("currentUser");
      setCurrentUser(cuRaw ? JSON.parse(cuRaw) : null);
      setIsAdmin(!!localStorage.getItem("isAdmin"));
    };
    load();

    // listen for same-tab notifications
    const onUsersUpdated = () => load();
    window.addEventListener("usersUpdated", onUsersUpdated);

    // listen for cross-tab localStorage changes
    const onStorage = (e) => {
      if (e.key === "currentUser" || e.key === "isAdmin" || e.key === "auth-token") load();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("usersUpdated", onUsersUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // base nav items
  const baseNavItems = [
    { to: "/", label: "Shop", exact: true },
    { to: "/mens", label: "Men" },
    { to: "/womens", label: "Women" },
    { to: "/kids", label: "Kids" },
  ];

  // if admin, place Admin link inline after Kids
  const navItems = isAdmin ? [...baseNavItems, { to: "/admin", label: "Admin" }] : baseNavItems;

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    // notify listeners
    window.dispatchEvent(new Event("usersUpdated"));
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
      <div className="container-fluid navbar-inner">
        {/* Logo */}
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="logo" style={{ width: "120px" }} />
        </NavLink>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 custom-nav-list">
            {navItems.map(({ to, label, exact }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link-active" : "nav-link"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Section (Cart + User Dropdown) */}
          <div className="d-flex align-items-center gap-3">
            <NavLink to="/cart" className="position-relative me-2">
              <img src={cart_icon} alt="cart" style={{ height: "25px" }} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {getTotalCartItem()}
              </span>
            </NavLink>

            {/* User dropdown */}
            <div className="dropdown">
              <img
                src={currentUser?.avatarUrl || userPlaceholder}
                alt="User"
                className="navbar-user dropdown-toggle"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              />
              <ul
                className="dropdown-menu dropdown-menu-end custom-dropdown"
                aria-labelledby="userDropdown"
              >
                <li className="dropdown-item-text px-3">
                  <strong>{currentUser?.name ?? 'Guest'}</strong><br />
                  <small className="text-muted">{currentUser?.email ?? ''}</small>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <NavLink className="dropdown-item" to="/orders">
                    <i className="bi bi-truck me-2"></i> Track Your Order
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/settings">
                    <i className="bi bi-gear me-2"></i> Settings
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>

                {localStorage.getItem("auth-token") ? (
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink className="dropdown-item" to="/login">
                      <i className="bi bi-box-arrow-in-right me-2"></i> Login
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
