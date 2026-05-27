import React, { useState, useEffect } from 'react';
import { format, startOfMonth, subMonths } from 'date-fns';
import api from '../services/api';
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

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [offsetAtual, setOffsetAtual] = useState(0);
  const [proximoOffset, setProximoOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState<string>('data_vencimento,asc');

  const carregarTabela = async () => {
    setLoading(true);
    try {
      const seisMesesAtras = format(startOfMonth(subMonths(new Date(), 6)), 'yyyy-MM-dd');
      const response = await api.get('/contas', {
        params: { 
          data_inicio: seisMesesAtras,
          limit: 10,
          offset: offsetAtual,
          status_diferente: 'pago',
          orderBy: orderBy
        }
      });

      // Filtra apenas as contas pendentes e atrasadas
      const soPendentes = (response.data.rows || []).filter((c: any) => c.status !== 'pago');

      setContas(soPendentes);
      setProximoOffset(response.data.next);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTabela();
  }, [offsetAtual, orderBy]);

  const requestSort = (coluna: string) => {
    const [currentColumn, currentOrder] = orderBy.split(',');
    if (currentColumn === coluna) {
      setOrderBy(`${coluna},${currentOrder === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setOrderBy(`${coluna},asc`);
    }
    setOffsetAtual(0); // Volta para a primeira página ao ordenar
  };

  const renderSortIcon = (coluna: string) => {
    const [currentColumn, currentOrder] = orderBy.split(',');
    
    const isActive = currentColumn === coluna;
    const isAsc = isActive && currentOrder === 'asc';
    const isDesc = isActive && currentOrder === 'desc';

    const classeCima = isAsc ? 'text-primary' : 'text-muted';
    const classeBaixo = isDesc ? 'text-primary' : 'text-muted';

    return (
      <span
        key={`${coluna}-${isActive}-${currentOrder}`} 
        style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', width: '0.6em', height: '1.2em', verticalAlign: 'middle', marginLeft: '6px' }}>
        
        <i 
          className={`fas fa-sort-up ${classeCima}`} 
          style={{ 
            fontSize: '0.85rem',
            position: 'absolute',
            top: '-4px',
            opacity: isAsc ? 1 : 0.4,
            transition: 'all 0.2s ease'
          }}
        ></i>
        
        <i 
          className={`fas fa-sort-down ${classeBaixo}`} 
          style={{ 
            fontSize: '0.85rem',
            position: 'absolute',
            bottom: '-1px',
            opacity: isDesc ? 1 : 0.4,
            transition: 'all 0.2s ease'
          }}
        ></i>
      </span>
    );
  };

  return (
    <div className="container-fluid px-4">
      
      {/* 1. Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <div>
          <h1 className="mt-0 mb-2">Home</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item active">Painel Operacional</li>
          </ol>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fas fa-plus me-2"></i> Nova Conta
        </button>
      </div>

      {/* 2. Tabela de Vencimentos */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div><i className="fas fa-list me-1 text-secondary"></i>Agenda de Vencimentos</div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th onClick={() => requestSort('descricao')} style={{ cursor: 'pointer' }} className="user-select-none">
                    Descrição {renderSortIcon('descricao')}
                  </th>
                  <th onClick={() => requestSort('valor')} style={{ cursor: 'pointer' }} className="user-select-none">
                    Valor {renderSortIcon('valor')}
                  </th>
                  <th onClick={() => requestSort('data_vencimento')} style={{ cursor: 'pointer' }} className="user-select-none">
                    Vencimento {renderSortIcon('data_vencimento')}
                  </th>
                  <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }} className="user-select-none">
                    Status {renderSortIcon('status')}
                  </th>
                  <th onClick={() => requestSort('responsavel_nome')} style={{ cursor: 'pointer' }} className="user-select-none">
                    Responsável {renderSortIcon('responsavel_nome')}
                  </th>
                  <th onClick={() => requestSort('categoria_nome')} style={{ cursor: 'pointer' }} className="user-select-none">
                    Categoria {renderSortIcon('categoria_nome')}
                  </th>
                  <th className="text-center">Comprovante</th>
                </tr>
              </thead>
              <tbody>
                {contas.length > 0 ? (
                  contas
                    .map(v => (
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
                        <td className="text-center text-muted">
                              {v.caminho_arquivo ? 'Sim' : 'Não'}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      Nenhuma conta pendente encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-3 px-3 pb-3">
            <span className="text-muted small">Mostrando página {Math.floor(offsetAtual / 10) + 1}</span>
            <div className="btn-group">
              <button 
                className="btn btn-outline-secondary btn-sm" 
                disabled={offsetAtual === 0 || loading}
                onClick={() => setOffsetAtual(Math.max(0, offsetAtual - 10))}
              >
                <i className="fas fa-chevron-left me-1"></i> Anterior
              </button>

              <button 
                className="btn btn-outline-secondary btn-sm"
                disabled={proximoOffset === null || loading}
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
          carregarTabela();
        }} 
      />

    </div>
  );
};

export default Home;