import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export const Chart = ({
  data,
}: {
  data: { duration: number; rate: string }[];
}) => {
  return (
    <Line
      options={{
        responsive: true,
      }}
      data={{
        labels: data.map((_, i) => i),
        datasets: [
          {
            data: data.map(({ duration, rate }) =>
              Number(rate.replace("%", ""))
            ),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      }}
    />
  );
};
