import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface NovaContaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Recarregar página
}

interface Responsavel {
  id_responsavel: number;
  nome: string;
}

const NovaContaModal: React.FC<NovaContaModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [listaResponsaveis, setListaResponsaveis] = useState<Responsavel[]>([]);
  // Estado para guardar o que o usuário digita
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_vencimento: '',
    status: '',
    id_categoria: 1, // Fixado temporariamente até criarmos o select de categorias
    id_responsavel: 1 // Fixado temporariamente
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/responsaveis')
        .then(response => {
          setListaResponsaveis(response.data);
        })
        .catch(err => console.error("Erro ao carregar responsáveis:", err));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    await api.post('/contas', formData);
    
    // Se não der erro, limpamos o formulário para o próximo uso
    setFormData({
      descricao: '',
      valor: '',
      data_vencimento: '',
      status: '',
      id_categoria: 1,
      id_responsavel: 1
    });

    // Fechamos o modal e avisamos o Dashboard para recarregar a tabela!
    onSuccess(); 
    onClose();

    } catch (error) {
        console.error("Erro ao enviar dados para a API", error);
        alert("Ocorreu um erro ao salvar a conta. Verifique o console.");
    }
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow">
          
          <div className="modal-header text-white bg-dark">
            <h5 className="modal-title fw-bold"><i className="fas fa-plus-circle me-2"></i>Cadastrar Nova Conta</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold text-secondary small">Descrição da Conta</label>
                <input 
                  type="text" 
                  className="form-control shadow-sm" 
                  name="descricao" 
                  placeholder="Ex: Conta de Água, Compra de Alimentos..." 
                  value={formData.descricao} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold text-secondary small">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control shadow-sm" 
                    name="valor" 
                    placeholder="0,00" 
                    value={formData.valor} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold text-secondary small">Data de Vencimento</label>
                  <input 
                    type="date" 
                    className="form-control shadow-sm" 
                    name="data_vencimento" 
                    value={formData.data_vencimento} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold text-secondary small">Status</label>
                  <select className="form-select shadow-sm" name="status" value={formData.status} onChange={handleChange} required>
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>

                <div className="col-md-8 mb-3">
                  <label className="form-label fw-bold text-secondary small">Responsável</label>
                  <select className="form-select shadow-sm" name="id_responsavel" value={formData.id_responsavel} onChange={handleChange} required>
                    <option value="" disabled>Selecione...</option>
                    {listaResponsaveis.map(resp => (
                      <option key={resp.id_responsavel} value={resp.id_responsavel}>
                        {resp.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary fw-bold">
                Salvar Conta
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default NovaContaModal;