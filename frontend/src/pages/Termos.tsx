import React from 'react';
import { useNavigate } from 'react-router-dom';

const Termos: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <button 
        className="btn btn-outline-secondary btn-sm mb-4" 
        onClick={() => navigate(-1)}
      >
        <i className="fas fa-arrow-left me-2"></i> Voltar
      </button>

      <div className="card shadow-sm p-4 md-5">
        <h1 style={{ color: '#004d80' }} className="mb-4">Termos de Uso e Política de Privacidade (LGPD)</h1>
        <p className="text-muted"><strong>Plataforma:</strong> SmartAgenda | <strong>Instituição:</strong> ONG Sol Encantado</p>
        <hr />

        <h2 style={{ color: '#004d80' }} className="h4 mt-4 mb-3">1. Termos de Uso do Sistema</h2>
        <p>Este documento estabelece as condições e diretrizes regulatórias para a utilização do sistema de gestão financeira SmartAgenda, operado de maneira estrita para o atendimento das necessidades operacionais e institucionais da ONG Sol Encantado.</p>

        <h3 style={{ color: '#35a5a3' }} className="h5 mt-4 mb-2">1.1. Definição e Escopo</h3>
        <p>O SmartAgenda consiste em uma plataforma corporativa centralizada para a administração de contas a pagar e receber, consolidação de relatórios analíticos de saúde financeira e arquivamento digital de comprovantes em formato PDF.</p>

        <h3 style={{ color: '#35a5a3' }} className="h5 mt-4 mb-2">1.2. Níveis de Acesso e Controle de Credenciais</h3>
        <p>O ingresso ao sistema é restrito a colaboradores devidamente autorizados, parametrizado sob o modelo de Controle de Acesso Baseado em Perfis Funcionais:</p>
        <ul>
          <li><strong>Administradores (Secretaria/Diretoria):</strong> Detêm credenciais de nível integral, com permissão para auditoria do fluxo de caixa consolidado, parametrização de categorias, gerenciamento de contas de usuários e acesso a métricas globais da instituição.</li>
          <li><strong>Assistentes (Operacional):</strong> Permissão circunscrita à gestão de lançamentos diários. Destina-se à inclusão de registros, anexação de arquivos comprobatórios e verificação das previsões de vencimento, sem visibilidade sobre os saldos globais ou indicadores estratégicos de nível consolidado.</li>
        </ul>

        <h3 style={{ color: '#35a5a3' }} className="h5 mt-4 mb-2">1.3. Responsabilidades e Obrigações do Usuário</h3>
        <p>É expressamente vedado o compartilhamento de credenciais de acesso com terceiros. Cada operador responde de forma individual pelas inserções, modificações e exclusões efetuadas sob sua titularidade identificada. Os arquivos anexados devem conter exclusivamente caráter corporativo e vinculação direta às atividades da instituição.</p>

        <h2 style={{ color: '#004d80' }} className="h4 mt-5 mb-3">2. Política de Privacidade (Conformidade Legal - LGPD)</h2>
        <p>Em estrita observância à Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), esta seção discrimina o tratamento de dados pessoais e operacionais executado no âmbito da plataforma.</p>

        <h3 style={{ color: '#35a5a3' }} className="h5 mt-4 mb-2">2.1. Natureza e Finalidade dos Dados Coletados</h3>
        <div className="table-responsive my-3">
          <table className="table table-bordered text-wrap">
            <thead className="table-light">
              <tr>
                <th>Categoria de Dados</th>
                <th>Finalidade Institucional</th>
                <th>Base Legal Regulatória</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dados Identificadores (Nome e E-mail)</td>
                <td>Autenticação de usuários, atribuição de perfil e procedimentos de segurança para recuperação de acesso.</td>
                <td>Execução de Contrato e Legítimo Interesse</td>
              </tr>
              <tr>
                <td>Credenciais Criptográficas</td>
                <td>Validação de segurança de sessão baseada em tokens JWT. As senhas de acesso recebem tratamento por hash unidirecional irreversível.</td>
                <td>Cumprimento de Obrigação Legal e Segurança</td>
              </tr>
              <tr>
                <td>Registros Financeiros e Anexos (PDFs)</td>
                <td>Processamento operacional de lançamentos, conciliação e geração de relatórios de auditoria interna.</td>
                <td>Letígimo Interesse e Execução de Contrato</td>
              </tr>
              <tr>
                <td>Registros de Logs de Eventos</td>
                <td>Rastreabilidade de autoria quanto à criação e alteração de registros no sistema.</td>
                <td>Cumprimento de Obrigação Legal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ color: '#35a5a3' }} className="h5 mt-4 mb-2">2.2. Segurança da Informação e Infraestrutura Tecnológica</h3>
        <p>A proteção dos dados fundamenta-se em padrões técnicos consolidados de mercado:</p>
        <ul>
          <li><strong>Criptografia em Trânsito:</strong> Canais de comunicação protegidos por protocolos de segurança de rede (HTTPS implementado via servidor proxy reverso Nginx).</li>
          <li><strong>Isolamento Físico de Ativos:</strong> Hospedagem efetuada em infraestrutura virtualizada privativa na nuvem da DigitalOcean, configurada para que a base de dados relacional PostgreSQL permaneça inacessível à rede pública externa.</li>
          <li><strong>Autenticação Robusta de Sessão:</strong> Validação criptográfica de chamadas à API efetuada pelo módulo backend em Node.js com o emprego de chaves privadas para a emissão de tokens.</li>
        </ul>

        <h3 style={{ color: '#35a5a3' }} className="h5 mt-4 mb-2">2.3. Política de Retenção e Descarte Permanente</h3>
        <p>As rotinas de eliminação de dados financeiros realizam a exclusão definitiva dos registros físicos correspondentes na base de dados (Hard Delete) após a respectiva validação pelo perfil competente. A manutenção temporal dos registros históricos observa estritamente os prazos prescricionais legais aplicáveis às obrigações de prestação de contas fiscais vigentes.</p>

        <h3 style={{ color: '#35a5a3' }} className="h5 mt-4 mb-2">2.4. Direitos do Titular dos Dados</h3>
        <p>Os operadores cadastrados detêm a prerrogativa do exercício integral dos direitos previstos no Artigo 18 da Lei Federal nº 13.709/2018, incluindo a confirmação de tratamento, a correção de dados incompletos ou inexatos e a consulta simplificada sobre os dados mantidos no sistema.</p>
      </div>
    </div>
  );
};

export default Termos;