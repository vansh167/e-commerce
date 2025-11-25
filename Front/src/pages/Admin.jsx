import React from 'react';
import './Admin.css';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import AddProduct from '../components/AddProduct/AddProduct';
import ListProduct from '../components/ListProduct/ListProduct';
import Dashboard from '../components/Dashboard/Dashboard';
import Users from '../components/Users/Users';


const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="listproduct" element={<ListProduct />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users/>} />
        
      </Routes>
    </div>
  );
};

export default Admin;
