import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.jsx';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(App, {}) }) }));
