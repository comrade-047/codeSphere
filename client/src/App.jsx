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
        <Route path="/problems" element = {<ProblemLandingPage/>}/>
        <Route path="/problems/:slug" element = {<ProblemPage/>}/>
        <Route path="/:username" element = {<ProfilePage/>} />
        <Route path="/:username/update" element = {<UpdateProfile/>} />
        <Route path="/contests" element = {<UnderConstructionPage/>}/>
        <Route path="/discussions" element = {<UnderConstructionPage/>}/>
      </Routes>
    </>
  )
}

export default App;