import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    // <SnackbarProvider
    //   maxSnack={1}
    //   anchorOrigin={{
    //     vertical: "top",
    //     horizontal: "left",
    //   }}
    // >
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
