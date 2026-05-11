import React, { useState, useEffect, } from 'react';
import { format, startOfMonth, subMonths } from 'date-fns';
import api from '../services/api';
import NovaContaModal from '../components/NovaConta';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Tipagem dos dados
interface DashboardData {
  pago: number;
  pendente: number;
  responsaveis: number;
  qtdAtrasadas: number;
  graficoCategorias: { labels: string[], valores: number[] };
  graficoEvolucao: { labels: string[], valores: number[] };
  vencimentos: Array<{
    id_conta: number;
    descricao: string;
    valor: number;
    data_vencimento: string;
    status: string;
    responsavel_nome: string;
    categoria_nome: string;
  }>;
}

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

const Dashboard: React.FC = () => {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [contas, setContas] = useState<Conta[]>([]);
  const [offsetAtual, setOffsetAtual] = useState(0);
  const [proximoOffset, setProximoOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState<string>('data_vencimento,asc');

  const carregarResumos = () => {
    api.get('/dashboard/summary')
      .then(response => setDados(response.data))
      .catch(error => console.error("Erro ao carregar dashboard:", error));
  };

  const carregarTabela = async () => {
    setLoading(true);
    try {
      const seisMesesAtras = format(startOfMonth(subMonths(new Date(), 6)), 'yyyy-MM-dd');
      const response = await api.get('/contas', {
        params: { 
          data_inicio: seisMesesAtras,
          limit: 100,
          offset: offsetAtual,
          orderBy: orderBy
        }
      });

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
    carregarResumos();
  }, []);

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
        
        {/* SETA PARA CIMA */}
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
        
        {/* SETA PARA BAIXO */}
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

  const dataBarras = {
    labels: dados?.graficoCategorias?.labels || [],
    datasets: [{
      label: 'Gasto por Categoria (R$)',
      data: dados?.graficoCategorias?.valores || [],
      backgroundColor: 'rgba(13, 110, 253, 0.7)',
      borderRadius: 5,
    }]
  };

  const dataLinha = {
    labels: dados?.graficoEvolucao?.labels || [],
    datasets: [{
      fill: true,
      label: 'Evolução Mensal (R$)',
      data: dados?.graficoEvolucao?.valores || [],
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.1)',
      tension: 0.4,
    }]
  };

  return (
    <div className="container-fluid px-4">
      
      {/* 1. Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <div>
          <h1 className="mt-0 mb-2">Dashboard</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item active">Visão Geral</li>
          </ol>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fas fa-plus me-2"></i> Nova Conta
        </button>
      </div>

      {/* 2. Cards */}
      <div className="row">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card bg-success text-white h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="small text-white-50">Total Pago</div>
              <div className="fs-4 fw-bold">{dados?.pago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card bg-warning text-white h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="small text-white-50">Pendente (A Vencer)</div>
              <div className="fs-4 fw-bold">{dados?.pendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card bg-danger text-white h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="small text-white-50">Em Atraso</div>
              <div className="fs-4 fw-bold">{dados?.qtdAtrasadas || 0} contas</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Gráficos */}
      <div className="row">
        <div className="col-xl-6">
          <div className="card mb-4 shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <i className="fas fa-chart-area me-1 text-secondary"></i> Fluxo de Caixa
            </div>
            <div className="card-body">
              <div style={{ height: '250px', position: 'relative' }}>
                <Line 
                  data={dataLinha} 
                  options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-6">
          <div className="card mb-4 shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <i className="fas fa-chart-bar me-1 text-secondary"></i> Despesas por Categoria
            </div>
            <div className="card-body">
              <div style={{ height: '250px', position: 'relative' }}>
                <Bar 
                  data={dataBarras} 
                  options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabela de contas */}
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
                    .filter(v => v.status !== 'pago')
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
          carregarTabela();
        }} 
      />

    </div>
  );
};

export default Dashboard;