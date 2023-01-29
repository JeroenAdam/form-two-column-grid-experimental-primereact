import { Routes, Route, NavLink } from "react-router-dom";
import Home from './Home';
import FinalForm from './resource';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.css';

function App() {
    return (
        <div>
            <nav className="flex">
                <NavLink to="/home" className="px-3 no-underline text-900 text-xl border-300 hover:border-500">Home</NavLink>
                <NavLink to="/" className="px-3 no-underline text-700 text-xl border-300 hover:border-500">Create a new Resource</NavLink>
            </nav>
            <div className="grid p-4 justify-content-center">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<FinalForm />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
