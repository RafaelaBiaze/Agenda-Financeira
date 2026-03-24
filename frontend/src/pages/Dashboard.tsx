import React, { useEffect, useState } from 'react';
import api from '../services/api'; 
import PizzaDashboard from '../components/PizzaDashboard';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get<DashboardData>('/dashboard/summary');
        setDados(response.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-5 text-center">Carregando painel...</div>;

  // Filtra as contas que não estão pagas e que a data já passou
  const hoje = new Date();
  const contasAtrasadas = dados?.vencimentos?.filter(conta => 
    conta.status !== 'pago' && new Date(conta.data_vencimento) < hoje
  ) || [];

  const valorTotalAtraso = contasAtrasadas.reduce((acc, conta) => acc + Number(conta.valor), 0);

  return (
    <div className="container-fluid">
      <h3 className="mb-4 fw-bold">Dashboard - Visão Geral</h3>

      {/* CARDS SUPERIORES */}
      <div className="row g-4 mb-4">
        {/* Card Pendente */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--ong-amarelo)', color: '#4a3200' }}>
            <div className="card-body p-4">
              <p className="mb-1 fw-bold small">Total Pendente (Mês Atual)</p>
              <h2 className="fw-bold">
                {dados?.pendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h2>
              <p className="mt-3 mb-0 small"><i className="bi bi-alarm"></i> Próximos Vencimentos</p>
            </div>
          </div>
        </div>

        {/* Card Pago */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-white" style={{ backgroundColor: 'var(--ong-verde-claro)' }}>
            <div className="card-body p-4">
              <p className="mb-1 fw-bold small">Total Pago (Mês Atual)</p>
              <h2 className="fw-bold text-dark">
                {dados?.pago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h2>
              <div className="mt-3">
                <span className="small text-dark fw-bold">Meta do Mês</span>
                <div className="progress mt-1" style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                  <div className="progress-bar bg-dark" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Atraso */}
        <div className="col-md-4">
          <div className="card border-2 shadow-sm h-100" style={{ borderColor: 'var(--ong-vermelho)' }}>
            <div className="card-body p-4">
              <p className="text-muted fw-bold small">Contas em Atraso</p>
              <h3 className="text-dark fw-bold">
                {contasAtrasadas.length} contas | {valorTotalAtraso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
              <div className="text-end mt-2">
                <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div> {/* <--- AQUI FECHA A ROW DOS CARDS (O QUE ESTAVA FALTANDO!) */}

      {/* GRID INFERIOR (TABELA + AÇÕES) */}
      <div className="row g-4">
        
        {/* COLUNA DA ESQUERDA: TABELA */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4">Agenda de Vencimentos</h5>

            {/* --- LEGENDA DAS CORES --- */}
            <div className="d-flex gap-3">
                <div className="d-flex align-items-center gap-2">
                    <span 
                    className="badge rounded-circle bg-danger" 
                    style={{ width: '12px', height: '12px', display: 'inline-block', padding: 0 }}
                    ></span>
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>Atrasado</small>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <span 
                    className="badge rounded-circle bg-warning" 
                    style={{ width: '12px', height: '12px', display: 'inline-block', padding: 0 }}
                    ></span>
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>Pendente / Hoje</small>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <span 
                    className="badge rounded-circle bg-success" 
                    style={{ width: '12px', height: '12px', display: 'inline-block', padding: 0 }}
                    ></span>
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>Pago</small>
                </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Responsável</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dados?.vencimentos?.map((conta) => (
                    <tr key={conta.id_conta}>
                      <td>{new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</td>
                      <td className="fw-medium">{conta.descricao}</td>
                      <td>{conta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{conta.responsavel_nome}</td>
                      <td className="text-center">
                        <span 
                          className={`badge rounded-circle p-2 ${
                            conta.status === 'pago' ? 'bg-success' : 
                            new Date(conta.data_vencimento) < hoje ? 'bg-danger' : 'bg-warning'
                          }`}
                          style={{ width: '12px', height: '12px', display: 'inline-block' }}
                        ></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: AÇÕES + GRÁFICO */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3 small text-muted text-uppercase">Ações Rápidas</h5>
            <button className="btn w-100 mb-2 text-white fw-bold shadow-sm" style={{ backgroundColor: 'var(--ong-verde-escuro)' }}>
              + Cadastrar Nova Conta
            </button>
            <button className="btn w-100 text-white fw-bold shadow-sm" style={{ backgroundColor: 'var(--ong-verde-escuro)' }}>
              + Anexar Comprovante
            </button>
          </div>
          
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold text-muted mb-3">Síntese das Movimentações</h6>
            <PizzaDashboard dadosGrafico={[dados?.pago || 0, dados?.pendente || 0]} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;