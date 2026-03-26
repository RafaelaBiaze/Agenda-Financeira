import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './services/api.ts';
import './assets/css/styles.css';

// Importe seus componentes e páginas
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Relatorios from './pages/Relatorios.tsx';
import Contas from './pages/Contas.tsx';
import Configuracoes from './pages/Configuracoes.tsx';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar se o usuário está logado
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('@SolEncantado:token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('@SolEncantado:role') || '');
  const [userName, setUserName] = useState(localStorage.getItem('@SolEncantado:name') || '');

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', { email, senha });
      const { token, usuario } = response.data;

      // 1. Salva tudo no LocalStorage para não perder ao dar F5
      localStorage.setItem('@SolEncantado:token', token);
      localStorage.setItem('@SolEncantado:role', usuario.role); 
      localStorage.setItem('@SolEncantado:name', usuario.nome); // ADICIONE ESTA LINHA
      
      // 2. Atualiza os estados do React
      setUserRole(usuario.role);
      setUserName(usuario.nome); // ADICIONE ESTA LINHA
      setIsAuthenticated(true);
      
      alert(`Bem-vindo, ${usuario.nome}!`);
    } catch (err: any) {
      alert("Erro ao acessar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole('');
    setUserName('');
    setEmail('');
    setSenha('');
    setLoading(false);
  };

  // 1. SE NÃO ESTIVER LOGADO: Mostra apenas a tela de Login
  if (!isAuthenticated) {
    return (
      <main className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
        <div className="card p-4 shadow-sm border" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
          <div className="card-body text-center">
            <h1 className="h3 mb-1 fw-bold" style={{ color: '#f39c12' }}>Sol Encantado</h1>
            <p className="text-muted mb-4 small">Gestão Financeira Acadêmica</p>

            <form onSubmit={handleLogin}>
              <div className="mb-3 text-start">
                <label className="form-label fw-bold small text-secondary">E-mail</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="exemplo@gmail.com"
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label fw-bold small text-secondary">Senha</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-warning w-100 fw-bold text-white shadow-sm"
                disabled={loading}
                style={{ backgroundColor: '#f39c12', border: 'none', padding: '12px' }}
              >
                {loading ? 'Validando...' : 'Acessar Sistema'}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // 2. SE ESTIVER LOGADO: Mostra o Layout com Sidebar e as Rotas
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout  role={userRole} userName={userName} onLogout={handleLogout} />}>
          {/* Rotas acessíveis por TODOS */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/contas" element={<Contas />} />
          <Route path="/relatorios" element={<Relatorios />} />

          {/* Rotas restritas ao ADMIN */}
          {userRole === 'admin' && (
            <Route path="/configuracoes" element={<Configuracoes />} />
          )}

          {/* Fallback: se a rota não existir ou for proibida, volta pro Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;