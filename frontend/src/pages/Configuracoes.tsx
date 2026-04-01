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
            <form onSubmit={handleAddCategoria} className="d-flex gap-2 mb-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nome da categoria" 
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
                    {idEditando === cat.id_categoria ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm"
                            value={dadosEdicaoCategoria?.nome_categoria || ''}
                            onChange={e => setDadosEdicaoCategoria({...dadosEdicaoCategoria!, nome_categoria: e.target.value})}
                          />
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-success me-2" onClick={handleSalvarEdicaoCategoria}>
                            Salvar
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicaoCategoria}>
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                    <>
                      <td>{cat.nome_categoria}</td> 
                      <td className="text-end"> 
                        <button 
                            className="btn btn-sm btn-outline-primary me-2" 
                            onClick={() => iniciarEdicaoCategoria(cat)}
                          >
                            Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteCategoria(cat.id_categoria!)}
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

        {abaAtiva === 'responsaveis' && (
          <div>
            <h5 className="fw-bold mb-3">Gerenciar Responsáveis</h5>
            <form onSubmit={handleAddResponsavel} className="d-flex gap-2 mb-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nome do Responsável" 
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
                            value={dadosEdicaoResponsavel?.nome || ''}
                            onChange={e => setDadosEdicaoResponsavel({...dadosEdicaoResponsavel!, nome: e.target.value})}
                          />
                        </td>
                        <td>
                          <select 
                            className="form-select form-select-sm"
                            value={dadosEdicaoResponsavel?.tipo}
                            onChange={e => setDadosEdicaoResponsavel({...dadosEdicaoResponsavel!, tipo: e.target.value as 'F' | 'J'})}
                          >
                            <option value="F">F</option>
                            <option value="J">J</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm"
                            value={dadosEdicaoResponsavel?.documento || ''}
                            onChange={e => setDadosEdicaoResponsavel({...dadosEdicaoResponsavel!, documento: e.target.value})}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm"
                            value={dadosEdicaoResponsavel?.observacoes || ''}
                            onChange={e => setDadosEdicaoResponsavel({...dadosEdicaoResponsavel!, observacoes: e.target.value})}
                          />
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-success me-2" onClick={handleSalvarEdicaoResponsavel}>
                            Salvar
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicaoResponsavel}>
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
                            onClick={() => iniciarEdicaoResponsavel(res)}
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
          <div>
            <h5 className="fw-bold mb-3">Gerenciar Usuários</h5>
            <form onSubmit={handleAddUsuario} className="d-flex gap-2 mb-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nome do Usuário" 
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                required
              />
              <input 
                type="text" 
                className="form-control"
                placeholder="Email"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
                required
              />
              <input 
                type="text" 
                className="form-control"
                placeholder="Senha"
                value={senhaUsuario}
                onChange={(e) => setSenhaUsuario(e.target.value)}
                required
              />
              <select 
                className="form-select" 
                value={roleUsuario}
                onChange={(e) => setRoleUsuario(e.target.value as 'admin' | 'user')}
                >
                  <option value="admin">Administrador</option>
                  <option value="user">Usuário</option>
              </select>
              <button type="submit" className="btn btn-dark fw-bold">+ Adicionar</button>
            </form>

            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nome do Usuário</th>
                  <th>Email</th>
                  <th>Senha</th>
                  <th>Role</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(res => (
                  <tr key={res.id_usuario}>
                    <td>{res.id_usuario}</td>
                    
                    {idEditando === res.id_usuario ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            className="form-control form-control-sm"
                            value={dadosEdicaoUsuario?.nome || ''}
                            onChange={e => setDadosEdicaoUsuario({...dadosEdicaoUsuario!, nome: e.target.value})}
                          />
                        </td>
                        <td>
                          <input 
                            type="email" 
                            className="form-control form-control-sm"
                            value={dadosEdicaoUsuario?.email || ''}
                            onChange={e => setDadosEdicaoUsuario({...dadosEdicaoUsuario!, email: e.target.value})}
                          />
                        </td>
                        <td>
                          <input 
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="Nova senha (ou vazio)"
                            value={dadosEdicaoUsuario?.senha || ''}
                            onChange={e => setDadosEdicaoUsuario({...dadosEdicaoUsuario!, senha: e.target.value})}
                          />
                        </td>
                        <td>
                          <select 
                            className="form-select form-select-sm"
                            value={dadosEdicaoUsuario?.role || 'user'}
                            onChange={e => setDadosEdicaoUsuario({...dadosEdicaoUsuario!, role: e.target.value as 'admin' | 'user'})}
                          >
                            <option value="admin">admin</option>
                            <option value="user">user</option>
                          </select>
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-success me-2" onClick={handleSalvarEdicaoUsuario}>
                            Salvar
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={cancelarEdicaoUsuario}>
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{res.nome}</td>
                        <td>{res.email}</td>
                        <td className="text-muted" title="Senha protegida">••••••••</td> {/* Esconder a senha */}
                        <td><span className={`badge ${res.role === 'admin' ? 'bg-info text-dark' : 'bg-secondary'}`}>{res.role}</span></td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-primary me-2" 
                            onClick={() => iniciarEdicaoUsuario(res)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDeleteUsuario(res.id_usuario!)}
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

      </div>
    </div>
  );
};

export default Configuracoes;