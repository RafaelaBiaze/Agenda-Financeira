import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface ICategoria {
  id_categoria?: number;
  nome_categoria: string;
}

interface IResponsavel {
  id_responsavel?: number;
  nome: string;
  tipo: 'F' | 'J';
  documento: string;
  observacoes?: string;
}

const Configuracoes: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'usuarios' | 'categorias' | 'responsaveis'>('categorias');

  
  // Estados para Categorias
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  
  // Estados para Responsáveis
  const [responsaveis, setResponsaveis] = useState<IResponsavel[]>([]);
  
  // Campos para cadastro de Responsáveis
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [tipoResponsavel, setTipoResponsavel] = useState<'F' | 'J'>('F');
  const [documentoResponsavel, setDocumentoResponsavel] = useState('');
  const [observacoesResponsavel, setObservacoesResponsavel] = useState('');
  
  // Estados para edição de responsáveis
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [dadosEdicao, setDadosEdicao] = useState<IResponsavel | null>(null);
  
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
      if (abaAtiva === 'responsaveis') {
        const response = await api.get('/responsaveis');
        setResponsaveis(response.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  }
  
  // Função para adicionar nova categoria
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

  // Função para adicionar novo responsável
  async function handleAddResponsavel(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/responsaveis', {
        nome: nomeResponsavel,
        tipo: tipoResponsavel,
        documento: documentoResponsavel,
        observacoes: observacoesResponsavel
      });
      // Limpa os campos
      setNomeResponsavel('');
      setTipoResponsavel('F');
      setDocumentoResponsavel('');
      setObservacoesResponsavel('');
      carregarDados(); // Recarrega a lista
      alert("Responsável adicionado!");
    } catch (err) {
      alert("Erro ao salvar responsável.");
    }
  }
  
  // Função para excluir responsavel
  async function handleDeleteResponsavel(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este responsável?")) return;
    try {
      await api.delete(`/responsaveis/${id}`);
      carregarDados(); // Recarrega a lista
      alert("Responsável excluído!");
    } catch (err) {
      alert("Erro ao excluir responsável.");
    }
  }
  
  // Prepara a linha para edição
  const iniciarEdicao = (res: IResponsavel) => {
    setIdEditando(res.id_responsavel!);
    setDadosEdicao({ ...res }); // Clona os dados atuais para o estado temporário
  };

  // Cancela e limpa
  const cancelarEdicao = () => {
    setIdEditando(null);
    setDadosEdicao(null);
  };

  // Salva a edição da linha
  async function handleSalvarEdicao() {
    if (!dadosEdicao || !dadosEdicao.id_responsavel) return;
    try {
      await api.put(`/responsaveis/${dadosEdicao.id_responsavel}`, dadosEdicao);
      setIdEditando(null);
      setDadosEdicao(null);
      carregarDados(); // Recarrega a lista atualizada
      alert("Responsável atualizado!");
    } catch (err) {
      alert("Erro ao atualizar responsável.");
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
          <div>
            <h5 className="fw-bold mb-3">Gerenciar Responsáveis</h5>
            <form onSubmit={handleAddResponsavel} className="d-flex gap-2 mb-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: João, Maria..." 
                value={nomeResponsavel}
                onChange={(e) => setNomeResponsavel(e.target.value)}
                required
              />
              <select 
                className="form-select" 
                value={tipoResponsavel}
                onChange={(e) => setTipoResponsavel(e.target.value as 'F' | 'J')}
                >
                  <option value="F">Pessoa Física</option>
                  <option value="J">Pessoa Jurídica</option>
              </select>
              <input 
                type="text" 
                className="form-control"
                placeholder="Documento (CPF/CNPJ)"
                value={documentoResponsavel}
                onChange={(e) => setDocumentoResponsavel(e.target.value)}
                required
              />
              <input 
                type="text" 
                className="form-control"
                placeholder="Observações"
                value={observacoesResponsavel}
                onChange={(e) => setObservacoesResponsavel(e.target.value)}
              />
              <button type="submit" className="btn btn-dark fw-bold">+ Adicionar</button>
            </form>

            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nome do Responsável</th>
                  <th>Tipo</th>
                  <th>Documento</th>
                  <th>Observações</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {responsaveis.map(res => (
                  <tr key={res.id_responsavel}>
                    <td>{res.id_responsavel}</td>
                    {idEditando === res.id_responsavel ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm"
                            value={dadosEdicao?.nome || ''}
                            onChange={e => setDadosEdicao({...dadosEdicao!, nome: e.target.value})}
                          />
                        </td>
                        <td>
                          <select 
                            className="form-select form-select-sm"
                            value={dadosEdicao?.tipo}
                            onChange={e => setDadosEdicao({...dadosEdicao!, tipo: e.target.value as 'F' | 'J'})}
                          >
                            <option value="F">F</option>
                            <option value="J">J</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm"
                            value={dadosEdicao?.documento || ''}
                            onChange={e => setDadosEdicao({...dadosEdicao!, documento: e.target.value})}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm"
                            value={dadosEdicao?.observacoes || ''}
                            onChange={e => setDadosEdicao({...dadosEdicao!, observacoes: e.target.value})}
                          />
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-success me-2" onClick={handleSalvarEdicao}>
                            Salvar
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicao}>
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{res.nome}</td>
                        <td><span className={`badge ${res.tipo === 'F' ? 'bg-info' : 'bg-primary'}`}>{res.tipo}</span></td>
                        <td>{res.documento}</td>
                        <td>{res.observacoes}</td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-primary me-2" 
                            onClick={() => iniciarEdicao(res)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDeleteResponsavel(res.id_responsavel!)}
                          >
                            Excluir
                          </button>
                        </td>
                      </>
                    )}
                </tr>
                ))}
              </tbody>
            </table>
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