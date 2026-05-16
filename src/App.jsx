import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AppToastContainer from './components/ui/AppToastContainer';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { Layout } from './components/layout';
import {
    AdminIotPage,
    AdminIrrigationPage,
    AdminReportsPage,
    AdminUsersPage,
    Dashboard,
    SensorsPage,
    IrrigationPage,
    ChatPage,
    SettingsPage,
    LoginPage
} from './pages';

const AdminOnly = ({ children }) => {
    const { currentUser } = useApp();
    if (!['admin', 'administrateur'].includes(currentUser?.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <AppToastContainer />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="sensors" element={<SensorsPage />} />
                        <Route path="irrigation" element={<IrrigationPage />} />
                        <Route path="chat" element={<ChatPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="admin" element={<AdminOnly><AdminReportsPage /></AdminOnly>} />
                        <Route path="admin/users" element={<AdminOnly><AdminUsersPage /></AdminOnly>} />
                        <Route path="admin/iot" element={<AdminOnly><AdminIotPage /></AdminOnly>} />
                        <Route path="admin/irrigation" element={<AdminOnly><AdminIrrigationPage /></AdminOnly>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}
export default App;
