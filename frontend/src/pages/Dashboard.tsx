import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NovaContaModal from '../components/NovaConta';

// Tipagem dos dados
interface DashboardData {
  pago: number;
  pendente: number;
  responsaveis: number;
  vencimentos: Array<{
    id_conta: number;
    descricao: string;
    valor: number;
    data_vencimento: string;
    status: string;
    responsavel_nome: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carrega os dados do mês atual automaticamente ao entrar na tela
  const carregarDados = () => {
    api.get('/dashboard/summary')
      .then(response => setDados(response.data))
      .catch(error => console.error("Erro ao carregar dashboard:", error));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Cálculos rápidos para o Dashboard de contas atrasadas
  const contasAtrasadas = dados?.vencimentos.filter(v => new Date(v.data_vencimento) < new Date() && v.status !== 'pago') || [];

  return (
    <div className="container-fluid px-4">
      
      {/* 1. Cabeçalho padrão */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <div>
          <h1 className="mt-0 mb-2">Dashboard</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item active">Visão Geral do Mês Atual</li>
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
              <div className="fs-4 fw-bold">{contasAtrasadas.length} contas</div>
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
            <div className="card-body text-center text-muted py-5" style={{ height: '250px' }}>
              Gráfico de Área (Em breve)
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card mb-4 shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <i className="fas fa-chart-bar me-1 text-secondary"></i> Despesas por Categoria
            </div>
            <div className="card-body text-center text-muted py-5" style={{ height: '250px' }}>
              Gráfico de Barras (Em breve)
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabelas de contas */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <i className="fas fa-table me-1 text-secondary"></i> Agenda de Vencimentos do Mês
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {dados?.vencimentos && dados.vencimentos.length > 0 ? (
                  dados.vencimentos.map(v => (
                    <tr key={v.id_conta}>
                      <td className="fw-medium text-dark">{v.descricao}</td>
                      <td>{v.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{new Date(v.data_vencimento).toLocaleDateString('pt-BR', { timeZone : 'UTC' })}</td>
                      <td>
                        <span className={`badge ${v.status === 'pago' ? 'bg-success' : (new Date(v.data_vencimento) < new Date() ? 'bg-danger' : 'bg-warning text-dark')}`}>
                          {v.status === 'pago' ? 'Pago' : (new Date(v.data_vencimento) < new Date() ? 'Atrasado' : 'Pendente')}
                        </span>
                      </td>
                      <td className="text-muted">{v.responsavel_nome}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">Nenhuma conta cadastrada para este mês.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal criar conta nova */}
      <NovaContaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          carregarDados(); // Recarrega a tela automaticamente após salvar
        }} 
      />

    </div>
  );
};

export default Dashboard;