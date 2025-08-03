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

function App(){
  return (
    // <div className="min-h-screen flex-col justify-center items-center">
    //   <h1 className="bg-amber-300" >codeSphere</h1>
    //   <p className="text-sm ">A global, all-encompassing space for coding challenges.</p>
    //   {/* <LoginPage/> */}
    //   <SignupPage/>
    // </div>
    <>
      <Header/>
      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path="/login" element = {<LoginPage/>} />
        <Route path="/signup" element = {<SignupPage/>} />
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