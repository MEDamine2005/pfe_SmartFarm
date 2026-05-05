import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';
const Layout = () => {
    const { sidebarCollapsed } = useApp();
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900", children: [_jsx(Sidebar, {}), _jsxs("main", { className: `transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`, children: [_jsx(Header, {}), _jsx("div", { className: "p-6", children: _jsx(Outlet, {}) })] })] }));
};
export default Layout;
