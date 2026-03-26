import React, { useEffect, useState } from 'react';
import api from '../services/api'; 
import PizzaDashboard from '../components/PizzaDashboard';
import NovaContaModal from '../components/NovaConta';

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
  const [filtro, setFiltro] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const listaMeses = Array.from({ length: 12 }, (_, i) => ({
    valor: i + 1,
    nome: new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(2026, i))
  }));

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await api.get<DashboardData>('/dashboard/summary', { params: filtro });
        setDados(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filtro]);

  const metaMensal = 15000;
  const porcentagemMeta = Math.min(((dados?.pago || 0) / metaMensal) * 100, 100);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container-fluid px-4">
      {/* Cabeçalho */}
      <h1 className="mt-4">Dashboard</h1>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item active">Resumo Financeiro</li>
        </ol>
        
        {/* Seletor de mês */}
        <div className="d-flex gap-2">
          <select className="form-select" value={filtro.mes} onChange={(e) => setFiltro({ ...filtro, mes: Number(e.target.value) })}>
            {listaMeses.map(m => <option key={m.valor} value={m.valor}>{m.nome}</option>)}
          </select>
          <input type="number" className="form-control" style={{ width: '100px' }} value={filtro.ano} onChange={(e) => setFiltro({ ...filtro, ano: Number(e.target.value) })}/>
        </div>
      </div>

      {/* Cards */}
      <div className="row mb-4" >
        <div className="col-xl-4 col-md-6">
          <div className="card bg-warning text-white mb-4 h-100">
            <div className="card-body fw-bold fs-5">
              Pendente: {dados?.pendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="card bg-success text-white mb-4 h-100">
            <div className="card-body fw-bold fs-5">
              Pago: {dados?.pago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <div className="card-footer bg-transparent border-top-0">
               <div className="d-flex justify-content-between small text-white mb-1">
                  <span>Meta do Mês</span>
                  <span>{porcentagemMeta.toFixed(0)}%</span>
               </div>
               <div className="progress" style={{ height: '6px' }}>
                 <div className="progress-bar bg-light" style={{ width: `${porcentagemMeta}%` }}></div>
               </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="card bg-danger text-white mb-4 h-100">
            <div className="card-body fw-bold fs-5">
              Em Atraso: {dados?.vencimentos?.filter(c => c.status !== 'pago' && new Date(c.data_vencimento) < new Date()).length} contas
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE GRÁFICOS E TABELAS */}
      <div className="row">
        {/* GRÁFICO NA ESQUERDA */}
        <div className="col-xl-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-chart-pie me-1"></i>
              Síntese de Movimentações
            </div>
            <div className="card-body d-flex justify-content-center">
              {/* SEU COMPONENTE DO CHART.JS ENTRA AQUI! */}
              <div style={{ width: '70%' }}>
                 <PizzaDashboard dadosGrafico={[dados?.pago || 0, dados?.pendente || 0]} />
              </div>
            </div>
          </div>
        </div>

        {/* AÇÕES RÁPIDAS NA DIREITA */}
        <div className="col-xl-6">
           <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-bolt me-1"></i>
              Ações Rápidas
            </div>
            <div className="card-body">
               <button className="btn btn-primary w-100 mb-3" onClick={() => setIsModalOpen(true)}><i className="fas fa-plus me-2"></i> Cadastrar Nova Conta</button>
               <button className="btn btn-outline-secondary w-100"><i className="fas fa-upload me-2"></i> Anexar Comprovante</button>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE VENCIMENTOS (Adapte o seu HTML da tabela aqui com a classe table-bordered) */}
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1"></i>
          Agenda de Vencimentos do Mês
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered text-nowrap">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {dados?.vencimentos.map(v => (
                  <tr key={v.id_conta}>
                    <td>{v.descricao}</td>
                    <td>{v.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td>{new Date(v.data_vencimento).toLocaleDateString('pt-BR', { timeZone : 'UTC' })}</td>
                    <td>
                      <span className={`badge ${v.status === 'pago' ? 'bg-success' : (new Date(v.data_vencimento) < new Date() ? 'bg-danger' : 'bg-warning')}`}>
                        {v.status === 'pago' ? 'Pago' : (new Date(v.data_vencimento) < new Date() ? 'Atrasado' : 'Pendente')}
                      </span>
                    </td>
                    <td>{v.responsavel_nome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> 
            <nav aria-label="Page navigation example" className="mt-3">
              <ul className="pagination justify-content-end mb-0">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex={-1}>Previous</a>
                </li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
        </div>
      </div>
      {/* O MODAL FICA AQUI */}
      <NovaContaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          // TODO: Aqui vamos recarregar os dados da API depois!
        }} 
      />
    </div>
  );
};

export default Dashboard;