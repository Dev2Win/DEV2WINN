import { BarChart } from '@mantine/charts';
import { barchartData } from '../../lib/data';


const Barchart = () => {
  return (
    <BarChart
      h={300}
      data={barchartData}
      dataKey="month"
      type="stacked"
      withLegend
      legendProps={{ verticalAlign: 'top' }}
      series={[
        { name: 'Exam', label: 'Study ', color: 'violet.8' },
        { name: 'Study', label: 'Exam ', color: 'violet.2' },
      ]}
    />
  );
}

export default Barchart