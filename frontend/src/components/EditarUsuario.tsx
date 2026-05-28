import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ModalEditarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuario: any;
}

const ModalEditarUsuario: React.FC<ModalEditarUsuarioProps> = ({ isOpen, onClose, onSuccess, usuario }) => {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', role: 'user' });

  useEffect(() => {
    if (isOpen && usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '', // Oculto por segurança
        role: usuario.role
      });
    }
  }, [isOpen, usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.id_usuario) return;
    try {
      const payload = { ...formData };
      if (!payload.senha) delete (payload as any).senha; // Remove do envio se estiver em branco
      
      await api.put(`/usuarios/${usuario.id_usuario}`, payload);
      alert("Usuário atualizado com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erro ao atualizar usuário.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold"><i className="fas fa-user-shield me-2"></i>Editar Usuário</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small">Nome</label>
                <input type="text" className="form-control" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Email</label>
                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Nova Senha</label>
                  <input type="password" className="form-control" placeholder="Deixe em branco para manter" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Nível de Acesso</label>
                  <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
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

export default ModalEditarUsuario;