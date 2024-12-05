import { ToastContainer } from "react-toastify";
import "./App.css";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="h-[80vh]">
      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default App;
