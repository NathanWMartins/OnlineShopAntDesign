import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { App as AntApp, ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./contexts/ThemeContext";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <React.StrictMode>
      <ConfigProvider>
        <ThemeProvider>
          <AntApp>
            <Provider store={store}>
              <AuthProvider>
                <App />
              </AuthProvider>
            </Provider>
          </AntApp>
        </ThemeProvider>
      </ConfigProvider>
    </React.StrictMode>
  </BrowserRouter>
);