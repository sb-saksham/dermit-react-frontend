import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";
import Chat from "./components/Chat";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Dashboard from "./components/UI/Dashboard";
import RequireAuth from "./hoc/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          >
            <Route
              path=""
              element={
                <RequireAuth>
                  <Homepage />
                </RequireAuth>
              }
            />
            <Route
              path="chats/:conversationId"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}