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

interface IUsuario {
  id_usuario?: number;
  nome: string;
  email: string;
  senha: string;
  role: 'admin' | 'user';
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

  // Estados para Usuários
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  
  // Campos para cadastro de Usuários
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [roleUsuario, setRoleUsuario] = useState<'admin' | 'user'>('user');
  
  // Estados para edição
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [dadosEdicaoResponsavel, setDadosEdicaoResponsavel] = useState<IResponsavel | null>(null);
  const [dadosEdicaoUsuario, setDadosEdicaoUsuario] = useState<IUsuario | null>(null);
  const [dadosEdicaoCategoria, setDadosEdicaoCategoria] = useState<ICategoria | null>(null);
  
  useEffect(() => {
    carregarDados();
  }, [abaAtiva]);
  
  async function carregarDados() {
    try {
      if (abaAtiva === 'categorias') {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      }

      if (abaAtiva === 'responsaveis') {
        const response = await api.get('/responsaveis');
        setResponsaveis(response.data);
      }

      if (abaAtiva === 'usuarios') {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
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
  
  // Função para adicionar novo usuário
  async function handleAddUsuario(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/usuarios', {
        nome: nomeUsuario,
        email: emailUsuario,
        senha: senhaUsuario,
        role: roleUsuario
      });
      // Limpa os campos
      setNomeUsuario('');
      setEmailUsuario('');
      setSenhaUsuario('');
      setRoleUsuario('user');
      carregarDados(); // Recarrega a lista
      alert("Usuário adicionado!");
    } catch (err) {
      alert("Erro ao salvar usuário.");
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

  // Função para excluir usuário
  async function handleDeleteUsuario(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {      
      await api.delete(`/usuarios/${id}`);
      carregarDados();
      alert("Usuário excluído!");
    } catch (err) {
      alert("Erro ao excluir usuário.");
    }
  }
  
  // Função para excluir categoria
  async function handleDeleteCategoria(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await api.delete(`/categorias/${id}`);
      carregarDados(); // Recarrega a lista
      alert("Categoria excluída!");
    } catch (err) {
      alert("Erro ao excluir categoria.");
    }
  }

  // Prepara a linha para edição
  const iniciarEdicaoResponsavel = (res: IResponsavel) => {
    setIdEditando(res.id_responsavel!);
    setDadosEdicaoResponsavel({ ...res }); // Clona os dados atuais para o estado temporário
  };

  const iniciarEdicaoUsuario = (res: IUsuario) => {
    setIdEditando(res.id_usuario!);
    setDadosEdicaoUsuario({ ...res, senha: '' }); // Clona os dados atuais para o estado temporário
  };

  const iniciarEdicaoCategoria = (res: ICategoria) => {
    setIdEditando(res.id_categoria!);
    setDadosEdicaoCategoria({ ...res }); // Clona os dados atuais para o estado temporário
  };

  // Cancela e limpa
  const cancelarEdicaoResponsavel = () => {
    setIdEditando(null);
    setDadosEdicaoResponsavel(null);
  };

  const cancelarEdicaoUsuario = () => {
    setIdEditando(null);
    setDadosEdicaoUsuario(null);
  };

  const cancelarEdicaoCategoria = () => {
    setIdEditando(null);
    setDadosEdicaoCategoria(null);
  };

  // Salva a edição da linha
  async function handleSalvarEdicaoResponsavel() {
    if (!dadosEdicaoResponsavel || !dadosEdicaoResponsavel.id_responsavel) return;
    try {
      await api.put(`/responsaveis/${dadosEdicaoResponsavel.id_responsavel}`, dadosEdicaoResponsavel);
      setIdEditando(null);
      setDadosEdicaoResponsavel(null);
      carregarDados(); // Recarrega a lista atualizada
      alert("Responsável atualizado!");
    } catch (err) {
      alert("Erro ao atualizar responsável.");
    }
  }

  async function handleSalvarEdicaoUsuario() {
    if (!dadosEdicaoUsuario || !dadosEdicaoUsuario.id_usuario) return;
    try {
      await api.put(`/usuarios/${dadosEdicaoUsuario.id_usuario}`, dadosEdicaoUsuario);
      setIdEditando(null);
      setDadosEdicaoUsuario(null);
      carregarDados(); // Recarrega a lista atualizada
      alert("Usuário atualizado!");
    } catch (err) {
      alert("Erro ao atualizar usuário.");
    }
  }

  async function handleSalvarEdicaoCategoria() {
    if (!dadosEdicaoCategoria || !dadosEdicaoCategoria.id_categoria) return;
    try {
      await api.put(`/categorias/${dadosEdicaoCategoria.id_categoria}`, dadosEdicaoCategoria);
      setIdEditando(null);
      setDadosEdicaoCategoria(null);
      carregarDados(); 
      alert("Categoria atualizada com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar a categoria.");
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
            Usuários
          </button>
        </li>
      </ul>

      {/* Conteúdo das Abas */}
      <div className="card border-0 shadow-sm p-4">
        
        {abaAtiva === 'categorias' && (
          <div>
            <h5 className="fw-bold mb-3">Gerenciar Categorias</h5>
            <form onSubmit={handleAddCategoria} className="row g-3 align-items-end mb-4">
              <div className="col-md-10 col-sm-12">
                <label className="form-label small text-muted">Nome da Categoria</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Suprimentos, Doações..." 
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2 col-sm-12">
                <button type="submit" className="btn btn-dark fw-bold w-100">+ Adicionar</button>
              </div>
            </form>

            <div className="card mb-4 shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <i className="fas fa-tags me-1 text-secondary"></i> Lista de Categorias
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-bordered table-hover text-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '80px' }}>ID</th>
                        <th>Nome da Categoria</th>
                        <th className="text-center" style={{ width: '150px' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map(cat => (
                        <tr key={cat.id_categoria}>
                          <td>{cat.id_categoria}</td>
                          <td>
                            {idEditando === cat.id_categoria ? (
                              <input 
                                type="text" className="form-control form-control-sm"
                                value={dadosEdicaoCategoria?.nome_categoria || ''}
                                onChange={e => setDadosEdicaoCategoria({...dadosEdicaoCategoria!, nome_categoria: e.target.value})}
                              />
                            ) : cat.nome_categoria}
                          </td>
                          <td className="text-center">
                            {idEditando === cat.id_categoria ? (
                              <>
                                <button className="btn btn-sm btn-success me-2" onClick={handleSalvarEdicaoCategoria}><i className="fas fa-check"></i></button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicaoCategoria}><i className="fas fa-times"></i></button>
                              </>
                            ) : (
                              <>
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => iniciarEdicaoCategoria(cat)}><i className="fas fa-edit"></i></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategoria(cat.id_categoria!)}><i className="fas fa-trash"></i></button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'responsaveis' && (
          <div>
            <h5 className="fw-bold mb-3">Gerenciar Responsáveis</h5>
            <form onSubmit={handleAddResponsavel} className="row g-3 align-items-end mb-4">
              <div className="col-md-3 col-sm-6">
                <label className="form-label small text-muted">Nome</label>
                <input type="text" className="form-control" placeholder="Nome do Responsável" value={nomeResponsavel} onChange={(e) => setNomeResponsavel(e.target.value)} required />
              </div>
              <div className="col-md-2 col-sm-6">
                <label className="form-label small text-muted">Tipo</label>
                <select className="form-select" value={tipoResponsavel} onChange={(e) => setTipoResponsavel(e.target.value as 'F' | 'J')}>
                  <option value="F">Pessoa Física</option>
                  <option value="J">Pessoa Jurídica</option>
                </select>
              </div>
              <div className="col-md-3 col-sm-6">
                <label className="form-label small text-muted">Documento</label>
                <input type="text" className="form-control" placeholder="Documento (CPF/CNPJ)" value={documentoResponsavel} onChange={(e) => setDocumentoResponsavel(e.target.value)} required />
              </div>
              <div className="col-md-2 col-sm-6">
                <label className="form-label small text-muted">Obs</label>
                <input type="text" className="form-control" placeholder="Observações" value={observacoesResponsavel} onChange={(e) => setObservacoesResponsavel(e.target.value)} />
              </div>
              <div className="col-md-2 col-sm-12">
                <button type="submit" className="btn btn-dark fw-bold w-100">+ Adicionar</button>
              </div>
            </form>

            <div className="card mb-4 shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <i className="fas fa-users me-1 text-secondary"></i> Lista de Responsáveis
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-bordered table-hover text-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Documento</th>
                        <th>Observações</th>
                        <th className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responsaveis.map(res => (
                        <tr key={res.id_responsavel}>
                          <td>{res.id_responsavel}</td>
                          <td>
                            {idEditando === res.id_responsavel ? (
                              <input type="text" className="form-control form-control-sm" value={dadosEdicaoResponsavel?.nome || ''} onChange={e => setDadosEdicaoResponsavel({...dadosEdicaoResponsavel!, nome: e.target.value})} />
                            ) : res.nome}
                          </td>
                          <td><span className={`badge ${res.tipo === 'F' ? 'bg-info text-dark' : 'bg-primary'}`}>{res.tipo}</span></td>
                          <td>{res.documento}</td>
                          <td>{res.observacoes}</td>
                          <td className="text-center">
                            {idEditando === res.id_responsavel ? (
                              <><button className="btn btn-sm btn-success me-2" onClick={handleSalvarEdicaoResponsavel}><i className="fas fa-check"></i></button><button className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicaoResponsavel}><i className="fas fa-times"></i></button></>
                            ) : (
                              <><button className="btn btn-sm btn-outline-primary me-2" onClick={() => iniciarEdicaoResponsavel(res)}><i className="fas fa-edit"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteResponsavel(res.id_responsavel!)}><i className="fas fa-trash"></i></button></>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'usuarios' && (
          <div>
            <h5 className="fw-bold mb-3">Gerenciar Usuários</h5>
            <form onSubmit={handleAddUsuario} className="row g-3 align-items-end mb-4">
              <div className="col-md-3 col-sm-6">
                <label className="form-label small text-muted">Nome</label>
                <input type="text" className="form-control" placeholder="Nome do Usuário" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} required />
              </div>
              <div className="col-md-3 col-sm-6">
                <label className="form-label small text-muted">Email</label>
                <input type="email" className="form-control" placeholder="Email" value={emailUsuario} onChange={(e) => setEmailUsuario(e.target.value)} required />
              </div>
              <div className="col-md-2 col-sm-6">
                <label className="form-label small text-muted">Senha</label>
                <input type="password" className="form-control" placeholder="Senha" value={senhaUsuario} onChange={(e) => setSenhaUsuario(e.target.value)} required />
              </div>
              <div className="col-md-2 col-sm-6">
                <label className="form-label small text-muted">Nível</label>
                <select className="form-select" value={roleUsuario} onChange={(e) => setRoleUsuario(e.target.value as 'admin' | 'user')}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="col-md-2 col-sm-12">
                <button type="submit" className="btn btn-dark fw-bold w-100">+ Adicionar</button>
              </div>
            </form>

            <div className="card mb-4 shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <i className="fas fa-user-shield me-1 text-secondary"></i> Lista de Usuários
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-bordered table-hover text-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Nível</th>
                        <th className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map(res => (
                        <tr key={res.id_usuario}>
                          <td>{res.id_usuario}</td>
                          <td>{idEditando === res.id_usuario ? <input className="form-control form-control-sm" value={dadosEdicaoUsuario?.nome || ''} onChange={e => setDadosEdicaoUsuario({...dadosEdicaoUsuario!, nome: e.target.value})} /> : res.nome}</td>
                          <td>{res.email}</td>
                          <td><span className={`badge ${res.role === 'admin' ? 'bg-info text-dark' : 'bg-secondary'}`}>{res.role}</span></td>
                          <td className="text-center">
                            {idEditando === res.id_usuario ? (
                              <><button className="btn btn-sm btn-success me-2" onClick={handleSalvarEdicaoUsuario}><i className="fas fa-check"></i></button><button className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicaoUsuario}><i className="fas fa-times"></i></button></>
                            ) : (
                              <><button className="btn btn-sm btn-outline-primary me-2" onClick={() => iniciarEdicaoUsuario(res)}><i className="fas fa-edit"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUsuario(res.id_usuario!)}><i className="fas fa-trash"></i></button></>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Configuracoes;