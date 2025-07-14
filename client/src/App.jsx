import { Route, Routes } from "react-router-dom";
import LoginPage from "./page/Auth/Login";
import SignupPage from "./page/Auth/SignUp";
import Home from "./page/Home";

function App(){
  return (
    // <div className="min-h-screen flex-col justify-center items-center">
    //   <h1 className="bg-amber-300" >codeSphere</h1>
    //   <p className="text-sm ">A global, all-encompassing space for coding challenges.</p>
    //   {/* <LoginPage/> */}
    //   <SignupPage/>
    // </div>
    <>
      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path="/login" element = {<LoginPage/>} />
        <Route path="/signup" element = {<SignupPage/>} />
      </Routes>
    </>
  )
}

export default App;