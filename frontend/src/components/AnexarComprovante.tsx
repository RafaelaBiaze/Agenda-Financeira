import React, { useState } from 'react';
import api from '../services/api';

interface ModalComprovanteProps {
  isOpen: boolean;
  onClose: () => void;
  idConta: number | null;
  onSuccess: () => void;
}

const ModalComprovante: React.FC<ModalComprovanteProps> = ({ isOpen, onClose, idConta, onSuccess }) => {
  const [carregando, setCarregando] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !idConta) return;

    if (file.type !== 'application/pdf') {
      alert("Por favor, selecione apenas arquivos PDF.");
      e.target.value = '';
      return;
    }

    setCarregando(true);
    const formData = new FormData();
    formData.append('id_conta', String(idConta));
    formData.append('comprovante', file);

    try {
      await api.post('/comprovantes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Comprovante anexado com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      alert(error.response?.data?.error || "Erro ao anexar comprovante.");
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen || !idConta) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-bold">
              <i className="fas fa-paperclip me-2"></i> Anexar Comprovante
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body bg-light text-center py-4">
            <label className="form-label fw-bold text-secondary mb-3">
              Selecione o PDF do recibo para a conta #{idConta}
            </label>
            <input 
              type="file" 
              className="form-control shadow-sm" 
              accept="application/pdf" 
              onChange={handleFileUpload}
              disabled={carregando}
            />
            {carregando && (
              <div className="text-primary mt-3 small fw-bold">
                <i className="fas fa-spinner fa-spin me-1"></i> Enviando para o servidor...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComprovante;