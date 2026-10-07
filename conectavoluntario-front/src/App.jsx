import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ExplorarVagas from './pages/ExplorarVagas';
import CadastroVoluntario from './pages/CadastroVoluntario'; // Confirme se o nome do ficheiro está correto
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vagas" element={<ExplorarVagas />} />
        
        {/* A rota precisa de corresponder exatamente ao link que está a usar */}
        <Route path="/cadastro-voluntario" element={<CadastroVoluntario />} />
        
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;