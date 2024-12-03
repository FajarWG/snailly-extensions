import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { SnackbarProvider } from "notistack";
import Summarize from "./pages/Summarize.jsx";

function App() {
  return (
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/summarize" element={<Summarize />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
