import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface ICategoria {
  id_categoria?: number;
  nome_categoria: string;
}

const Configuracoes: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'usuarios' | 'categorias' | 'responsaveis'>('categorias');
  
  // Estados para Categorias
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');

  useEffect(() => {
    carregarDados();
  }, [abaAtiva]);

  async function carregarDados() {
    try {
      if (abaAtiva === 'categorias') {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      }
      // Aqui vocês implementarão os outros GETs (usuarios e responsaveis)
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  }

  async function handleAddCategoria(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/categorias', { nome_categoria: novaCategoria });
      setNovaCategoria('');
      carregarDados(); // Recarrega a lista
      alert("Categoria adicionada!");
    } catch (err) {
      alert("Erro ao salvar categoria.");
    }
  }

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Configurações do Sistema</h3>

      {/* Navegação por Abas */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded shadow-sm">
        <li className="nav-item">
          <button 
            className={`nav-link ${abaAtiva === 'categorias' ? 'active bg-warning text-dark' : 'text-secondary'}`}
            onClick={() => setAbaAtiva('categorias')}
          >
            Categorias
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${abaAtiva === 'responsaveis' ? 'active bg-warning text-dark' : 'text-secondary'}`}
            onClick={() => setAbaAtiva('responsaveis')}
          >
            Responsáveis
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${abaAtiva === 'usuarios' ? 'active bg-warning text-dark' : 'text-secondary'}`}
            onClick={() => setAbaAtiva('usuarios')}
          >
            Usuários (Admin)
          </button>
        </li>
      </ul>

      {/* Conteúdo das Abas */}
      <div className="card border-0 shadow-sm p-4">
        
        {abaAtiva === 'categorias' && (
          <div>
            <h5 className="fw-bold mb-3">Gerenciar Categorias</h5>
            <form onSubmit={handleAddCategoria} className="d-flex gap-2 mb-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Alimentação, Aluguel..." 
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-dark fw-bold">+ Adicionar</button>
            </form>

            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nome da Categoria</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(cat => (
                  <tr key={cat.id_categoria}>
                    <td>{cat.id_categoria}</td>
                    <td>{cat.nome_categoria}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {abaAtiva === 'responsaveis' && (
          <div className="text-center py-5">
            <p className="text-muted">Espaço reservado para o cadastro de Responsáveis (Pair Programming)</p>
          </div>
        )}

        {abaAtiva === 'usuarios' && (
          <div className="text-center py-5">
            <p className="text-muted">Espaço reservado para o cadastro de Usuários (Pair Programming)</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Configuracoes;