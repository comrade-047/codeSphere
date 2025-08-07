import { Route, Routes } from "react-router-dom";
import LoginPage from "./page/Auth/Login";
import SignupPage from "./page/Auth/SignUp";
import Home from "./page/Home";
import UnderConstructionPage from "./components/UnderConstruction";
import Header from "./components/Header";
import ProblemLandingPage from "./page/Problem/ProblemLanding";
import ProblemPage from "./page/Problem/ProblemPage";
import ProfilePage from "./page/User/Profile";
import UpdateProfile from "./page/User/UpdateProfile";
import ForgotPasswordPage from "./page/Auth/ForgotPassword";
import ResetPasswordPage from "./page/Auth/ResetPasswordPage";
import ContestListPage from "./page/Contest/ContestListPage";
import ContestDashboardPage from "./page/Contest/ContestDashboardPage";
import AdminRoute from "./components/Admin/AdminRoutes";
import CreateProblemPage from "./page/Admin/CreateProblemPage";
import CreateContestPage from "./page/Admin/CreateContestPage";

function App(){
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path="/login" element = {<LoginPage/>} />
        <Route path="/signup" element = {<SignupPage/>} />
        <Route path="/admin/create-problem" element = {
          <AdminRoute>
            <CreateProblemPage/>
          </AdminRoute>
        } />
        <Route path="/admin/create-contest" element = {
          <AdminRoute>
            <CreateContestPage/>
          </AdminRoute>
        } />
        <Route path="/forgot-password" element = {<ForgotPasswordPage/>}/>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/problems" element = {<ProblemLandingPage/>}/>
        <Route path="/problems/:slug" element = {<ProblemPage/>}/>
        <Route path="/:username" element = {<ProfilePage/>} />
        <Route path="/:username/update" element = {<UpdateProfile/>} />
        <Route path="/contests" element = {<ContestListPage/>}/>
        <Route path="/contests/:slug" element = {<ContestDashboardPage/>} />
        <Route path="/discussions" element = {<UnderConstructionPage/>}/>
      </Routes>
    </>
  )
}

export default App;