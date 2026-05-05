import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout';
import { Dashboard, SensorsPage, IrrigationPage, WeatherPage, ChatPage, SettingsPage } from './pages';
function App() {
    return (_jsx(AppProvider, { children: _jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "sensors", element: _jsx(SensorsPage, {}) }), _jsx(Route, { path: "irrigation", element: _jsx(IrrigationPage, {}) }), _jsx(Route, { path: "weather", element: _jsx(WeatherPage, {}) }), _jsx(Route, { path: "chat", element: _jsx(ChatPage, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsPage, {}) })] }) }) }) }));
}
export default App;
