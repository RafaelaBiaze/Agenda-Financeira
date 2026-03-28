import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ModalComprovante from '../components/AnexarComprovante';
import ModalEditarConta from '../components/EditarConta';
import NovaContaModal from '../components/NovaConta';

interface Conta {
  id_conta: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: string;
  responsavel_nome: string;
  categoria_nome: string;
  caminho_arquivo?: string;
}

const Contas: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  
  // Estados de Paginação
  const [offsetAtual, setOffsetAtual] = useState(0);
  const [proximoOffset, setProximoOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados de filtros
  const [busca, setBusca] = useState('');
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());

  // Estados Modal de edição de conta
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState<any>(null);

  // Estados Modal de anexação de comprovantes
  const [isModalComprovanteOpen, setIsModalComprovanteOpen] = useState(false);
  const [idContaComprovante, setIdContaComprovante] = useState<number | null>(null);

  // Estados Modal de cadastro de conta
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarContas = async () => {
    console.log("O React está tentando buscar:", { busca, mes, ano });
    try {
      const response = await api.get('/contas', {
        params: { 
            busca: busca !== '' ? busca : undefined,
            mes: mes,
            ano: ano,
            limit: 10,
            offset: offsetAtual
        }
      });
      setContas(response.data.rows || []);
      setProximoOffset(response.data.next);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    } finally {
        setLoading(false);
    }
   };

  // Recarrega tabela
  useEffect(() => {
    carregarContas();
  }, [mes, ano, busca, offsetAtual]); 

  // Volta para primeira pagina ao usar barra de busca
  useEffect(() => {
    setOffsetAtual(0);
  }, [busca, mes, ano]);

  // Função para lidar com a exclusão
  const handleExcluir = async (id: number) => {
    const confirmou = window.confirm("Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.");
    if (confirmou) {
      try {
        await api.delete(`/contas/${id}`);
        alert("Conta excluída com sucesso!");
        carregarContas();
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Erro ao excluir a conta. Tente novamente.");
      }
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4 mb-2">Gestão de Contas</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
        <li className="breadcrumb-item active">Todas as Contas</li>
      </ol>
      {/* Botão de cadastro de nova conta */}
      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus me-2"></i> Nova Conta
        </button>
      </div>

      {/* Painel de filtros */}
      <div className="card mb-4 shadow-sm border-0 bg-light">
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); carregarContas(); }}>
            
            <div className="col-md-5">
              <label className="form-label fw-bold text-secondary small">Buscar por Descrição</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="fas fa-search text-muted"></i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Aluguel, Internet..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-bold text-secondary small">Mês</label>
              <select className="form-select" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
                <option value={0}>Todos</option>
                <option value={1}>Janeiro</option>
                <option value={2}>Fevereiro</option>
                <option value={3}>Março</option>
                <option value={4}>Abril</option>
                <option value={5}>Maio</option>
                <option value={6}>Junho</option>
                <option value={7}>Julho</option>
                <option value={8}>Setembro</option>
                <option value={9}>Outubro</option>
                <option value={10}>Novembro</option>
                <option value={11}>Dezembro</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-bold text-secondary small">Ano</label>
              <input 
                type="number" 
                className="form-control" 
                value={ano} 
                onChange={(e) => setAno(Number(e.target.value))}
              />
            </div>

            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                <i className="fas fa-filter me-2"></i>Aplicar Filtros
              </button>
            </div>
            
          </form>
        </div>
      </div>

      {/* Tabela de contas */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div><i className="fas fa-list me-1 text-secondary"></i> Lista de Contas</div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Categoria</th>
                  <th className="text-center">Comprovante</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contas.length > 0 ? (
                  contas.map(v => (
                    <tr key={v.id_conta}>
                      <td className="fw-medium text-dark">{v.descricao}</td>
                      <td>{v.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{new Date(v.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td>
                        <span className={`badge ${v.status === 'pago' ? 'bg-success' : (new Date(v.data_vencimento) < new Date() ? 'bg-danger' : 'bg-warning text-dark')}`}>
                          {v.status === 'pago' ? 'Pago' : (new Date(v.data_vencimento) < new Date() ? 'Atrasado' : 'Pendente')}
                        </span>
                      </td>
                      <td className="text-dark">{v.responsavel_nome}</td>
                      <td className="text-dark">{v.categoria_nome}</td>
                      <td className="text-center align-middle">
                            {v.caminho_arquivo ? (
                            <a 
                                href={`http://localhost/arquivos/${v.caminho_arquivo}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-info"
                                title="Ver PDF"
                            >
                                <i className="fas fa-file-pdf me-1"></i> Ver
                            </a>
                            ) : (
                            <span className="text-muted small">-</span>
                            )}
                      </td>
                      {/* Botões de ações */}
                      <td className="text-center">
                        <button 
                            className="btn btn-sm btn-outline-success me-2" 
                            title="Anexar Comprovante"
                            onClick={() => {
                                setIdContaComprovante(v.id_conta);
                                setIsModalComprovanteOpen(true);
                            }}
                        >
                            <i className="fas fa-paperclip"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2" 
                          title="Editar"
                          onClick={() => {
                                setContaSelecionada(v);     
                                setIsModalEditarOpen(true); 
                            }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          title="Excluir"
                          onClick={() => handleExcluir(v.id_conta)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      Nenhuma conta encontrada com estes filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted small">Mostrando página {Math.floor(offsetAtual / 10) + 1}</span>
                <div className="btn-group mb-4">
                    <button 
                        className="btn btn-outline-secondary btn-sm" 
                        // Desativa se estiver no começo (offset 0) ou carregando
                        disabled={offsetAtual === 0 || loading}
                        // Para voltar
                        onClick={() => setOffsetAtual(Math.max(0, offsetAtual - 10))}
                    >
                        <i className="fas fa-chevron-left me-1"></i> Anterior
                    </button>

                    <button 
                        className="btn btn-outline-secondary btn-sm"
                        // Desativa se não tiver proximo
                        disabled={proximoOffset === null || loading}
                        // Para avançar
                        onClick={() => setOffsetAtual(proximoOffset!)}
                    >
                        Próxima <i className="fas fa-chevron-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
      </div>

      <NovaContaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          carregarContas();
        }} 
      />

      <ModalComprovante 
        isOpen={isModalComprovanteOpen}
        idConta={idContaComprovante}
        onClose={() => {
          setIsModalComprovanteOpen(false);
          setIdContaComprovante(null);
        }}
        onSuccess={() => {
          setIsModalComprovanteOpen(false);
          setIdContaComprovante(null);
          carregarContas();
        }}
      />

      <ModalEditarConta 
        isOpen={isModalEditarOpen}
        conta={contaSelecionada}
        onClose={() => setIsModalEditarOpen(false)}
        onSuccess={() => carregarContas()}
      />

    </div>
  );
};

export default Contas;