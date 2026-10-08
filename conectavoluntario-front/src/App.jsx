import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ExplorarVagas from './pages/ExplorarVagas';
import CadastroVoluntario from './pages/CadastroVoluntario';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vagas" element={<ExplorarVagas />} />
        <Route path="/cadastro-voluntario" element={<CadastroVoluntario />} />
        <Route path="/login" element={<Login />} />
        {/* Qualquer endereço desconhecido volta para o início */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
