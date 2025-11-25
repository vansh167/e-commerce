import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoginSignup.css';

const DUMMY_ADMIN_EMAIL = 'admin@example.com';
const DUMMY_ADMIN_PASSWORD = 'admin123';

const LoginSignUp = () => {
  const [active, setActive] = useState('user'); // 'user' or 'admin' (UI toggle)
  const [state, setState] = useState('Sign Up'); // 'Login' or 'Sign Up'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const BASE_URL = 'https://backend-om60.onrender.com';

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // helper to save current user in localStorage
  const setCurrentUser = (userObj) => {
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    if (userObj.role === 'admin') localStorage.setItem('isAdmin', 'true');
    else localStorage.removeItem('isAdmin');
    // notify same-tab listeners
    window.dispatchEvent(new Event('usersUpdated'));
  };

  const login = async () => {
    // For demo: use fetch to backend if available, otherwise treat it as local demo login.
    // We'll still call your backend and then set local flags for admin detection.
    let responseData;
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      responseData = await res.json();
    } catch (err) {
      // If backend unreachable, fallback to demo-local authentication
      responseData = { success: true, token: 'demo-token' };
    }

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);

      // Demo admin check (dummy credentials)
      if (
        (formData.email === DUMMY_ADMIN_EMAIL || active === 'admin') &&
        formData.password === DUMMY_ADMIN_PASSWORD
      ) {
        // Save current user as admin
        const adminUser = {
          name: formData.username || 'Admin',
          email: formData.email,
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(adminUser);
        // redirect to admin
        navigate('/admin', { replace: true });
        return;
      }

      // Normal user: fetch additional info from backend or treat as regular user
      const normalUser = {
        name: formData.username || formData.email.split('@')[0],
        email: formData.email,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(normalUser);
      navigate('/', { replace: true });
    } else {
      alert(responseData.errors || 'Login failed');
    }
  };

  const signup = async () => {
    let responseData;
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      responseData = await res.json();
    } catch (err) {
      // fallback: pretend success for demo
      responseData = { success: true, token: 'demo-token' };
    }

    if (responseData.success) {
      // Get existing users from localStorage or create an empty array
      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

      // Add the new user data
      const newUser = {
        id: `u_${Date.now()}`,
        username: formData.username,
        email: formData.email,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      localStorage.setItem('auth-token', responseData.token);

      // Set currentUser as this user
      setCurrentUser({
        name: newUser.username || newUser.email.split('@')[0],
        email: newUser.email,
        role: 'user',
        isActive: true,
        createdAt: newUser.createdAt,
      });

      navigate('/', { replace: true });
    } else {
      alert(responseData.errors || 'Signup failed');
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-wrapper">
        {/* LEFT SIDE */}
        <div className="loginsignup-left">
          <h2>{state === 'Sign Up' ? 'Already have an account?' : 'New here?'}</h2>
          <p>
            {state === 'Sign Up'
              ? 'Click below to login to your account.'
              : 'Sign up and discover a new experience.'}
          </p>
          <button
            onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')}
            className="loginsignup-toggle-btn"
          >
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </button>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="loginsignup-container">
          <div className="switcher-container">
            <ul className="switcher-list">
              <li
                className={active === 'user' ? 'active' : ''}
                onClick={() => setActive('user')}
              >
                User
              </li>
              <li
                className={active === 'admin' ? 'active' : ''}
                onClick={() => setActive('admin')}
              >
                Admin
              </li>
            </ul>
          </div>
          <h1>{state}</h1>
          <div className="loginsignup-fields">
            {state === 'Sign Up' && (
              <input
                name="username"
                value={formData.username}
                onChange={changeHandler}
                type="text"
                placeholder="Your Name"
              />
            )}
            <input
              name="email"
              value={formData.email}
              onChange={changeHandler}
              type="email"
              placeholder="Email Address"
            />
            <input
              name="password"
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder="Password"
            />
          </div>
          <button onClick={() => (state === 'Login' ? login() : signup())}>
            Continue
          </button>
          {state === 'Sign Up' ? (
            <p className="loginsignup-login">
              Already have an account?{' '}
              <span onClick={() => setState('Login')}>Login here</span>
            </p>
          ) : (
            <p className="loginsignup-login">
              Create an account?{' '}
              <span onClick={() => setState('Sign Up')}>Click here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
