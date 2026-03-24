import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// 1. O contrato: o que este componente aceita receber
interface PizzaProps {
  dadosGrafico: number[]; 
}

// 2. Recebendo a prop { dadosGrafico }
const PizzaDashboard = ({ dadosGrafico }: PizzaProps) => {
  const data = {
    labels: ['Pago (R$)', 'Pendente (R$)'],
    datasets: [
      {
        data: dadosGrafico || [0, 0], // Usa os dados que o "pai" enviou
        backgroundColor: ['#28a745', '#f1b44c'],
        hoverBackgroundColor: ['#218838', '#c5933d'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-100">
      <h5 className="mb-4 text-secondary">Distribuição de Status</h5>
      {/* O segredo está aqui: uma div com altura fixa e position relative */}
      <div style={{ 
        position: 'relative', 
        height: '220px', // Altura fixa menor para caber no card lateral
        width: '100%'
      }}>
        <Pie 
          data={data} 
          options={{ 
            maintainAspectRatio: false, 
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 12, font: { size: 11 } }
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PizzaDashboard;