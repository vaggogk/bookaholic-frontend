import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import HomePage from "./components/pages/HomePage.tsx";
import LoginPage from "./components/pages/LoginPage.tsx";
import AddPage from "./components/pages/AddPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import LibraryPage from "./components/pages/LibraryPage.tsx";
import CurrentlyReadingPage from "./components/pages/CurrentlyReadingPage.tsx";
import ToReadPage from "./components/pages/ToReadPage.tsx";
import FinishedPage from "./components/pages/FinishedPage.tsx";
import EditPage from "./components/pages/EditPage.tsx";
import GaveUp from "./components/pages/GaveUp.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<LoginPage />}/>
                <Route path="login" element={<LoginPage />}/>
                {/*<Route index element={<HomePage />}/>*/}
                <Route path="home_page" element={<HomePage />}/>
                <Route path="library" element={<LibraryPage />}/>
                <Route path="currently_reading" element={<CurrentlyReadingPage />}/>
                <Route path="to_read" element={<ToReadPage />}/>
                <Route path="finished" element={<FinishedPage />}/>
                <Route path="gave_up" element={<GaveUp />}/>
                <Route path="add_book" element={<AddPage />}/>
                <Route path="edit/:id" element={<EditPage />}/>
                <Route path="log_out" element={<LoginPage/>}/>
                <Route path="register_page" element={<RegisterPage/>}/>
                {/*<Route path="go-back" element={<HomePage />}/>*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App;