import { NavLink } from 'react-router-dom';

interface SidebarProps {
  role: string | null;
  onLogout: () => void;
}

export default function Sidebar({ role }: SidebarProps) {
  return (
    <div className="d-flex flex-column h-100 p-3">
    <nav className="nav flex-column p-3 gap-2">
      {/* Item: Dashboard */}
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `nav-link d-flex align-items-center gap-3 px-3 py-2 ${isActive ? 'active-pill' : 'text-secondary fw-medium'}`
        }
      >
        <i className="bi bi-grid-1x2-fill"></i>
        <span>Dashboard</span>
      </NavLink>

      {/* Item: Contas */}
      <NavLink 
        to="/contas" 
        className={({ isActive }) => 
          `nav-link d-flex align-items-center gap-3 px-3 py-2 ${isActive ? 'active-pill' : 'text-secondary fw-medium'}`
        }
      >
        <i className="bi bi-wallet2"></i>
        <span>Contas</span>
      </NavLink>

      {/* Item: Relatórios */}
      <NavLink 
        to="/relatorios" 
        className={({ isActive }) => 
          `nav-link d-flex align-items-center gap-3 px-3 py-2 ${isActive ? 'active-pill' : 'text-secondary fw-medium'}`
        }
      >
        <i className="bi bi-file-earmark-bar-graph"></i>
        <span>Relatórios</span>
      </NavLink>

      {/* Se for Admin, mostra Configurações */}
      {role === 'admin' && (
      <NavLink 
        to="/configuracoes" 
        className={({ isActive }) => 
            `nav-link d-flex align-items-center gap-3 px-3 py-2 ${isActive ? 'active-pill' : 'text-secondary fw-medium'}`
        }
      >
        <i className="bi bi-gear"></i>
        <span>Configurações</span>
      </NavLink>
      )}
    </nav>
  </div> 
  );
}