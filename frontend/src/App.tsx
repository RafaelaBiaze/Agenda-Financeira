import React from 'react'
import { useState } from 'react' // Para capturar o que você digita
import api from './services/api.ts' // Para falar com o backend via Nginx
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // 1. React guarda o que o usuário digita nos campos
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  // 2. O que acontece quando clica no botão
  async function handleLogin(event: React.FormEvent) {
    event.preventDefault() // Impede a página de recarregar

    console.log("Dados capturados:", { email, senha });
    
    setLoading(true)

    try {
      // O Nginx vai receber isso e mandar pro Node (backend)
      const response = await api.post('/login', { email, senha })
      
      const { token, usuario } = response.data
      localStorage.setItem('@SolEncantado:token', token)
      localStorage.setItem('@SolEncantado:user', JSON.stringify(usuario));
      
      alert(`Bem-vindo, ${usuario.nome}!`)

    } catch (err: any) {

      console.error("Erro completo:", err);

    } finally {
      setLoading(false)
    }
  }

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

export default App