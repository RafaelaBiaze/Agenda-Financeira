import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/logo-sistema.png';

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Pega o token da barra de endereços
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  async function handleRedefinir(event: React.FormEvent) {
    event.preventDefault();

    if (!token) {
      setMensagem({ texto: 'Link inválido ou expirado.', tipo: 'danger' });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem({ texto: 'As senhas digitadas não são iguais.', tipo: 'warning' });
      return;
    }

    setLoading(true);
    setMensagem({ texto: '', tipo: '' });

    try {
      await api.put('/redefinir-senha', { token, novaSenha });
      
      setMensagem({ texto: 'Senha redefinida com sucesso! Redirecionando...', tipo: 'success' });
      
      // Espera 3 segundos para o usuário ler a mensagem e manda ele de volta pro Login
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      const erroBackend = err.response?.data?.erro || 'Erro ao redefinir a senha.';
      setMensagem({ texto: erroBackend, tipo: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="card p-4 shadow-sm border" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="card-body text-center">
          <img src={logo} alt="Smart Agenda" className="img-fluid w-50 d-block mx-auto mb-4"/>
          <h2 className="h4 mb-1 fw-bold" style={{ color: '#005088' }}>Nova Senha</h2>
          <p className="text-muted mb-4 small">Crie uma nova senha para acessar sua conta.</p>

          {mensagem.texto && (
            <div className={`alert alert-${mensagem.tipo} small`} role="alert">
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleRedefinir}>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold small text-secondary">Nova Senha</label>
              <input 
                type="password" 
                className="form-control" 
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo de 6 caracteres"
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-bold small text-secondary">Confirmar Nova Senha</label>
              <input 
                type="password" 
                className="form-control" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                placeholder="Repita a senha"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-warning w-100 fw-bold text-white shadow-sm"
              disabled={loading || !token}
              style={{ backgroundColor: '#005088', border: 'none', padding: '12px' }}
            >
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}