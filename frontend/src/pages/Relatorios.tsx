import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const Relatorios: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  
  // Estados de Paginação
  const [offsetAtual, setOffsetAtual] = useState(0);
  const [proximoOffset, setProximoOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados de filtros
  const [busca, setBusca] = useState('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');

  const [status, setStatus] = useState<string>(''); 
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  // Estados ordernação
  const [orderBy, setOrderBy] = useState<string>('');

  const carregarContas = async () => {
    console.log("O React está tentando buscar:", { busca, dataInicio, dataFim });
    try {
      const response = await api.get('/contas', {
        params: { 
            busca: busca !== '' ? busca : undefined,
            data_inicio: dataInicio,
            data_fim: dataFim,
            status: status !== '' ? status : undefined,
            filtroResponsavel: filtroResponsavel !== '' ? filtroResponsavel : undefined,
            filtroCategoria: filtroCategoria !== '' ? filtroCategoria : undefined,
            limit: 100,
            offset: offsetAtual,
            orderBy: orderBy
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

   const exportarExcel = () => {
    if (contas.length === 0) {
      alert("Não há dados para exportar neste período.");
      return;
    }

    // Traduz os dados do banco para colunas no Excel
    const dadosExcel = contas.map(c => ({
      'Descrição': c.descricao,
      'Valor': c.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      'Vencimento': new Date(c.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      'Status': c.status === 'pago' ? 'Pago' : (new Date(c.data_vencimento) < new Date() ? 'Atrasado' : 'Pendente'),
      'Responsável': c.responsavel_nome,
      'Categoria': c.categoria_nome,
      'Comprovante': c.caminho_arquivo ? 'Sim' : 'Não'
    }));
    
    // Cria a planilha e baixa o arquivo
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");
    
    // Gera o arquivo Excel e inicia o download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Relatorio_Financeiro_${new Date().getTime()}.xlsx`);
  };

  const exportarPDF = () => {
    if (contas.length === 0) {
      alert("Não há dados para exportar neste período.");
      return;
    }

    const doc = new jsPDF();
    
    // Formata datas para o subtítulo do PDF
    const dataInicioFormatada = dataInicio ? new Date(`${dataInicio}T12:00:00Z`).toLocaleDateString('pt-BR') : 'Início';
    const dataFimFormatada = dataFim ? new Date(`${dataFim}T12:00:00Z`).toLocaleDateString('pt-BR') : 'Hoje';

    // Título do Documento
    doc.text("Relatório de Contas - Agenda Financeira", 14, 15);
    doc.setFontSize(10);
    doc.text(`Período: ${dataInicioFormatada} até ${dataFimFormatada}`, 14, 22);
    
    // O autoTable desenha a tabela a partir dos dados, com estilos e formatações
    autoTable(doc, {
      startY: 28,
      head: [['Descrição', 'Valor', 'Vencimento', 'Status', 'Resp.', 'Categoria', 'Comp.']],
      body: contas.map(v => [
        v.descricao,
        v.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        new Date(v.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        v.status === 'pago' ? 'Pago' : (new Date(v.data_vencimento) < new Date() ? 'Atrasado' : 'Pendente'),
        v.responsavel_nome,
        v.categoria_nome,
        v.caminho_arquivo ? 'Sim' : 'Não'
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [13, 110, 253] }
    });

    // Gera o arquivo PDF e inicia o download
    doc.save(`Relatorio_Financeiro_${new Date().getTime()}.pdf`);
  };

  // Recarrega tabela
  useEffect(() => {
    carregarContas();
  }, [dataInicio, dataFim, busca, status, filtroResponsavel, filtroCategoria, offsetAtual, orderBy]); 

  // Volta para primeira pagina ao usar barra de busca
  useEffect(() => {
    setOffsetAtual(0);
  }, [busca, dataInicio, dataFim, status, filtroResponsavel, filtroCategoria, orderBy]);

  // Função para lidar com ordenação
  const requestSort = (coluna: string) => {
    const [currentColumn, currentOrder] = orderBy.split(',');
    
    if (currentColumn === coluna) {
      // Inverte a ordem se clicou na mesma coluna
      setOrderBy(`${coluna},${currentOrder === 'asc' ? 'desc' : 'asc'}`);
    } else {
      // Começa como 'asc' se clicou em uma nova
      setOrderBy(`${coluna},asc`);
    }
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

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4 mb-2">Relatórios Financeiros</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
        <li className="breadcrumb-item active">Exportação e Relatórios</li>
      </ol>

      <div className="d-flex justify-content-end gap-2 mb-4">
        {/* Botão do Excel */}
        <button 
          className="btn btn-success shadow-sm" 
          onClick={exportarExcel} 
          disabled={loading || contas.length === 0}
        >
          <i className="fas fa-file-excel me-2"></i> Exportar Excel
        </button>

        {/* Botão do PDF */}
        <button 
          className="btn btn-danger shadow-sm" 
          onClick={exportarPDF} 
          disabled={loading || contas.length === 0}
        >
          <i className="fas fa-file-pdf me-2"></i> Exportar PDF
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

            {/* Campo Data Início */}
            <div className="col-md-2">
              <label className="form-label fw-bold text-secondary small">Data Início</label>
              <input 
                type="date" 
                className="form-control" 
                value={dataInicio} 
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            {/* Campo Data Fim */}
            <div className="col-md-2">
              <label className="form-label fw-bold text-secondary small">Data Fim</label>
              <input 
                type="date" 
                className="form-control" 
                value={dataFim} 
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            {/* Campo Status */}
            <div className="col-md-2">
              <label className="form-label fw-bold text-secondary small">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>

            {/* Campo Responsável */}
            <div className="col-md-2">
              <label className="form-label fw-bold text-secondary small">Responsável</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nome..." 
                value={filtroResponsavel} 
                onChange={(e) => setFiltroResponsavel(e.target.value)}
              />
            </div>

            {/* Campo Categoria */}
            <div className="col-md-2">
              <label className="form-label fw-bold text-secondary small">Categoria</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Aluguel..." 
                value={filtroCategoria} 
                onChange={(e) => setFiltroCategoria(e.target.value)}
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

    </div>
  );
};

export default Relatorios;