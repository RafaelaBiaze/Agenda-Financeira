import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 1. Cria a Interface
interface MainLayoutProps {
  role: string;
  userName: string;
  onLogout: () => void;
}

// 2. MainLayout é um componente funcional (React.FC) que segue essa interface
const MainLayout: React.FC<MainLayoutProps> = ({ role, userName, onLogout }) => {
  //Botão para toggle do menu lateral
  const [isSidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggled(!isSidebarToggled);
  };
  
  return (
    <div className={`sb-nav-fixed ${isSidebarToggled ? 'sb-sidenav-toggled' : ''}`}>
      
      {/* --- TOP NAVBAR --- */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        {/* Botão de Toggle do Menu Lateral */}
        <button 
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" 
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Nome do Sistema / Logo */}
        <a className="navbar-brand ps-3" href="/">Sol Encantado</a>

        {/* Espaçador para jogar o menu de usuário para a direita */}
        <div className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></div>

        {/* Menu de Usuário com nome e botão de logout */}
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <button 
              className="btn btn-link nav-link dropdown-toggle" 
              id="navbarDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ textDecoration: 'none', boxShadow: 'none' }}
            >
              <i className="fas fa-user fa-fw"></i> {userName}
            </button>
            
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              {/* Termos de Uso */}
              <li>
                <Link to="/termos" className="dropdown-item py-2">
                  <i className="fas fa-file-contract fa-sm fa-fw me-2 text-muted"></i> 
                  Termos e LGPD
                </Link>
              </li>

              {/* Linha divisória */}
              <li><hr className="dropdown-divider" /></li>
              
              {/* Botão de Sair */}
              <li>
                <button className="dropdown-item py-2 text-danger" onClick={onLogout}>
                  <i className="fas fa-sign-out-alt fa-sm fa-fw me-2"></i> 
                  Sair do Sistema
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* --- SIDEBAR & CONTEÚDO --- */}
      <div id="layoutSidenav">
        
        {/* Menu Lateral Esquerdo */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav mt-3">
                <Sidebar role={role} onLogout={onLogout} />
              </div>
            </div>
          </nav>
        </div>

        {/* Área Central (Onde as páginas carregam) */}
        <div id="layoutSidenav_content">
          <main>
            <Outlet />
          </main>
          
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; Sol Encantado 2026</div>
              </div>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
};

export default MainLayout;