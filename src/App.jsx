import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer} from 'react-toastify';
import UploadPdf from "./pages/UploadPdf";

function App() {


  return (
         <div>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="login" element={<Login />} />
            <Route path="/upload" element={<UploadPdf />} />
            <Route path="email-verify" element={<EmailVerify/>} />
            <Route path="reset-password" element={<ResetPassword/>} />
          </Routes>
         </div>
      )
    }
export default App
