import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ModalEditarCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoria: any;
}

const ModalEditarCategoria: React.FC<ModalEditarCategoriaProps> = ({ isOpen, onClose, onSuccess, categoria }) => {
  const [nomeCategoria, setNomeCategoria] = useState('');

  useEffect(() => {
    if (isOpen && categoria) {
      setNomeCategoria(categoria.nome_categoria);
    }
  }, [isOpen, categoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria?.id_categoria) return;
    try {
      await api.put(`/categorias/${categoria.id_categoria}`, { nome_categoria: nomeCategoria });
      alert("Categoria atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erro ao atualizar a categoria.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold"><i className="fas fa-tags me-2"></i>Editar Categoria</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small">Nome da Categoria</label>
                <input type="text" className="form-control" value={nomeCategoria} onChange={e => setNomeCategoria(e.target.value)} required />
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

export default ModalEditarCategoria;