import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupForm from "./components/Signup/SignupForm";
import PostSignupTour from "./components/Login/PostSignupTour";
import DashboardPage from "./pages/DashboardPage";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/post-sign" element={<PostSignupTour />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}