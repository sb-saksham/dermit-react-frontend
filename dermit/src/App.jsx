import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Dashboard from "./components/UI/Dashboard";
import RequireAuth from "./hoc/RequireAuth";
import { NextUIProvider } from "@nextui-org/react";
import Home from "./components/landing/Home";
import UserDashboardLayout from "./components/userDashboard/UserDashboardLayout";
import QnA from "./components/diagnose/survey/QnA";
import RagTest from "./components/diagnose/rag/RagTest";
import CvTest from "./components/diagnose/cv/CvTest";
import { AIModelContextProvider } from "./contexts/AIModelContext";

export default function App() {
  return (
    <NextUIProvider>
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route
                path=""
                element={
                  <RequireAuth>
                    <Home />
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
              <Route path="/login" element={<Login />} />
              <Route
                path="/diagnose/survey"
                element={
                  <AIModelContextProvider>
                    <QnA />
                  </AIModelContextProvider>
                }
              />
              <Route
                path="/diagnose/cv"
                element={
                  <AIModelContextProvider>
                    <CvTest />
                  </AIModelContextProvider>
                }
              />
              <Route path="/diagnose/rag" element={<RagTest />} />
              <Route
                path="/user-dashboard"
                element={
                  <RequireAuth>
                    <UserDashboardLayout />
                  </RequireAuth>
                }
              />
            </Route>
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </NextUIProvider>
  );
}
