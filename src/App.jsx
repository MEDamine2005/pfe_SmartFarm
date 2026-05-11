import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
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
    WeatherPage,
    ChatPage,
    SettingsPage,
    LoginPage
} from './pages';

const AdminOnly = ({ children }) => {
    const { currentUser } = useApp();
    if (currentUser?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="sensors" element={<SensorsPage />} />
                        <Route path="irrigation" element={<IrrigationPage />} />
                        <Route path="weather" element={<WeatherPage />} />
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
