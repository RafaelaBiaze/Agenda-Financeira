import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ModalEditarResponsavelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  responsavel: any;
}

const ModalEditarResponsavel: React.FC<ModalEditarResponsavelProps> = ({ isOpen, onClose, onSuccess, responsavel }) => {
  const [formData, setFormData] = useState({ nome: '', tipo: 'F', documento: '', observacoes: '' });

  useEffect(() => {
    if (isOpen && responsavel) {
      setFormData({
        nome: responsavel.nome,
        tipo: responsavel.tipo,
        documento: responsavel.documento,
        observacoes: responsavel.observacoes || ''
      });
    }
  }, [isOpen, responsavel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responsavel?.id_responsavel) return;
    try {
      await api.put(`/responsaveis/${responsavel.id_responsavel}`, formData);
      alert("Responsável atualizado com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erro ao atualizar responsável.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold"><i className="fas fa-users me-2"></i>Editar Responsável</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small">Nome</label>
                <input type="text" className="form-control" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Tipo</label>
                  <select className="form-select" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option value="F">Pessoa Física</option>
                    <option value="J">Pessoa Jurídica</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Documento</label>
                  <input type="text" className="form-control" value={formData.documento} onChange={e => setFormData({...formData, documento: e.target.value})} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Observações</label>
                <textarea className="form-control" rows={2} value={formData.observacoes} onChange={e => setFormData({...formData, observacoes: e.target.value})}></textarea>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-link text-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary px-4 fw-bold">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarResponsavel;