import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/logo-sistema.png';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  async function handleSolicitar(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMensagem({ texto: '', tipo: '' });

    try {
      await api.post('/reset-senha', { email });
      setMensagem({ 
        texto: 'Se o e-mail existir no sistema, um link de recuperação será enviado.', 
        tipo: 'success' 
      });
    } catch (err) {
      setMensagem({ 
        texto: 'Erro ao processar a solicitação. Tente novamente mais tarde.', 
        tipo: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="card p-4 shadow-sm border" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="card-body text-center">
          <img src={logo} alt="Smart Agenda" className="img-fluid w-50 d-block mx-auto mb-4"/>
          <h2 className="h4 mb-1 fw-bold" style={{ color: '#005088' }}>Recuperar Senha</h2>
          <p className="text-muted mb-4 small">Informe seu e-mail para receber o link de acesso.</p>

          {mensagem.texto && (
            <div className={`alert alert-${mensagem.tipo} small`} role="alert">
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleSolicitar}>
            <div className="mb-4 text-start">
              <label className="form-label fw-bold small text-secondary">E-mail cadastrado</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="exemplo@gmail.com"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-warning w-100 fw-bold text-white shadow-sm mb-3"
              disabled={loading}
              style={{ backgroundColor: '#005088', border: 'none', padding: '12px' }}
            >
              {loading ? 'Enviando...' : 'Enviar Link'}
            </button>

            <Link to="/login" className="text-decoration-none small text-muted">
              Voltar para o Login
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}