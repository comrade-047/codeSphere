import { Route, Routes } from "react-router-dom";
import LoginPage from "./page/Auth/Login";
import SignupPage from "./page/Auth/SignUp";
import Home from "./page/Home";
import UnderConstructionPage from "./components/UnderConstruction";
import Header from "./components/Header";

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
        <Route path="/problems" element = {<UnderConstructionPage/>}/>
        <Route path="/contests" element = {<UnderConstructionPage/>}/>
        <Route path="/discussions" element = {<UnderConstructionPage/>}/>
      </Routes>
    </>
  )
}

export default App;