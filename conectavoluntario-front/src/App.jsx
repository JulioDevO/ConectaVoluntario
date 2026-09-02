import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroVoluntario from './pages/CadastroVoluntario';
import PerfilUsuario from './pages/PerfilUsuario';
import DashboardOng from './pages/DashboardOng'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-voluntario" element={<CadastroVoluntario />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/dashboard-ong" element={<DashboardOng />} /> {/* Adicione a rota */}
      </Routes>
    </Router>
  );
}

export default App;