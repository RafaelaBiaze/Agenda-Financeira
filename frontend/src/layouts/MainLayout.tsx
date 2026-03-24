import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// 1. Cria a Interface
interface MainLayoutProps {
  role: string;
  userName: string;
  onLogout: () => void;
}

// 2. MainLayout é um componente funcional (React.FC) que segue essa interface
const MainLayout: React.FC<MainLayoutProps> = ({ role, userName, onLogout }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  
  return (
    <div className="d-flex min-vh-100 bg-light">
      
      {/* 1. SIDEBAR DESKTOP (Fixa na esquerda, some no celular) */}
      <aside 
        style={{ width: '260px' }} 
        className="bg-white border-end d-none d-md-block shadow-sm"
      >
        <div className="p-4 text-center">
            <img src="/logo-ong.png" alt="Sol Encantado" style={{ width: '150px' }} />
        </div>
        <Sidebar role={role} onLogout={onLogout} />
      </aside>

      {/* 2. SIDEBAR MOBILE (O "Menu" que desliza no celular) */}
      <div 
        className={`bg-white position-fixed h-100 shadow-lg d-md-none`} 
        style={{ 
            width: '260px', 
            zIndex: 1050, 
            left: menuAberto ? 0 : '-260px', // Esconde ou mostra
            transition: '0.3s' // Animação suave
        }}
      >
        <div className="p-4 d-flex justify-content-between align-items-center">
            <img src="/logo-ong.png" alt="Logo" style={{ width: '100px' }} />
            <button className="btn-close" onClick={() => setMenuAberto(false)}></button>
        </div>
        <Sidebar role={role} onLogout={onLogout} />
      </div>

      {/* 3. ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-grow-1 d-flex flex-column">
        
        {/* TOPBAR (Igual ao seu documento) */}
        <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center px-4">
          
          {/* Botão Hambúrguer: Só aparece no Celular (d-md-none) */}
          <button 
            className="btn d-md-none border-0 p-0 me-3" 
            onClick={() => setMenuAberto(true)}
          >
            <i className="bi bi-list fs-2 text-dark"></i>
          </button>

          <span className="text-muted fw-medium d-none d-sm-inline small">
            Sistema de Agenda Financeira
          </span>

          {/* Nome e Avatar do Usuário */}
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
                <span className="fw-bold d-block small" style={{ lineHeight: '1' }}>{userName}</span>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{role}</small>
            </div>
            <img 
              src={`https://ui-avatars.com/api/?name=${userName}&background=f1b44c&color=fff`} 
              className="rounded-circle border" 
              width="38" 
              alt="Avatar" 
            />
            <button onClick={onLogout} className="btn btn-outline-danger btn-sm d-none d-md-block">
               Sair
            </button>
          </div>
        </header>

        {/* ÁREA ONDE AS PÁGINAS APARECEM */}
        <main className="p-4 flex-grow-1" style={{ overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
      
      {/* Overlay: Fundo escuro quando o menu mobile está aberto */}
      {menuAberto && (
        <div 
          className="position-fixed w-100 h-100 bg-dark opacity-50 d-md-none" 
          style={{ zIndex: 1040, top: 0, left: 0 }}
          onClick={() => setMenuAberto(false)}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;