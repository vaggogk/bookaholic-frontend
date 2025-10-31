import { BrowserRouter, Routes, Route } from "react-router"; // Αλλαγή εδώ
import './App.css'
import HomePage from "./components/pages/HomePage.tsx";
import LoginPage from "./components/pages/LoginPage.tsx";
import AddPage from "./components/pages/AddPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import LibraryPage from "./components/pages/LibraryPage.tsx";
import CurrentlyReadingPage from "./components/pages/CurrentlyReadingPage.tsx";
import ToReadPage from "./components/pages/ToReadPage.tsx";
import FinishedPage from "./components/pages/FinishedPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<LoginPage />}/>
                <Route index element={<HomePage />}/>
                <Route path="add-book" element={<AddPage />}/>
                <Route path="log-out" element={<LoginPage/>}/>
                <Route path="Resign-page" element={<RegisterPage/>}/>
                <Route path="library" element={<LibraryPage />}/>
                <Route path="currently-reading" element={<CurrentlyReadingPage />}/>
                <Route path="to-read" element={<ToReadPage />}/>
                <Route path="finished" element={<FinishedPage />}/>
                <Route path="go-back" element={<HomePage />}/>
                {/*<Route path="home-page" element={<HomePage />}/>*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App;