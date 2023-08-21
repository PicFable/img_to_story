import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Upload from "./components/Upload";
import User from "./components/user";
import Welcome from "./components/Welcome";
import Profile from "./components/Profile";
import Main from "./components/App";
import { useEffect } from "react";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/app" element={<Main />} />
      <Route path="/" element={<Welcome />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/user" element={<User />} /> 
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
export default App;
// 