import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';
const Layout = () => {
    const { sidebarCollapsed, isAuthenticated } = useApp();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Sidebar />
            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <Header />
                <div className="p-4 md:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
export default Layout;
