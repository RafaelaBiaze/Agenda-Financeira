import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  conta: any;
}

const ModalEditarConta: React.FC<ModalEditarProps> = ({ isOpen, onClose, onSuccess, conta }) => {
  const [listaResponsaveis, setListaResponsaveis] = useState<any[]>([]);
  const [listaCategorias, setListaCategorias] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_vencimento: '',
    status: '',
    id_responsavel: '',
    id_categoria: ''
  });

  // Sempre que o modal abrir ou a 'conta' mudar, preenchemos o formulário
  useEffect(() => {
    if (isOpen && conta) {
      setFormData({
        descricao: conta.descricao,
        valor: conta.valor,
        data_vencimento: conta.data_vencimento.split('T')[0],
        status: conta.status,
        id_responsavel: conta.id_responsavel,
        id_categoria: conta.id_categoria
      });

      api.get('/responsaveis').then(res => setListaResponsaveis(res.data));
      api.get('/categorias').then(res => setListaCategorias(res.data));
    }
  }, [isOpen, conta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/contas/${conta.id_conta}`, formData);
      alert("Conta atualizada!");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Erro ao atualizar conta.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold"><i className="fas fa-edit me-2"></i>Editar Conta</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label small fw-bold">Descrição</label>
                <input type="text" className="form-control" value={formData.descricao} 
                  onChange={e => setFormData({...formData, descricao: e.target.value})} required />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold">Valor</label>
                  <input type="number" step="0.01" className="form-control" value={formData.valor} 
                    onChange={e => setFormData({...formData, valor: e.target.value})} required />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold">Vencimento</label>
                  <input type="date" className="form-control" value={formData.data_vencimento} 
                    onChange={e => setFormData({...formData, data_vencimento: e.target.value})} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Responsável</label>
                <select className="form-select" value={formData.id_responsavel} 
                  onChange={e => setFormData({...formData, id_responsavel: e.target.value})} required>
                  {listaResponsaveis.map(r => (
                    <option key={r.id_responsavel} value={r.id_responsavel}>{r.nome}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Categoria</label>
                <select className="form-select" value={formData.id_categoria} 
                  onChange={e => setFormData({...formData, id_categoria: e.target.value})} required>
                  {listaCategorias.map(c => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nome_categoria}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-link text-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary px-4">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarConta;