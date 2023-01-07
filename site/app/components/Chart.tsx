import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export const Chart = ({
  data,
}: {
  data: { duration: number; rate?: string }[];
}) => {
  const samples = useMemo(
    () =>
      data.reduce<number[]>((res, { rate }) => {
        if (!rate) return res;
        return [...res, Number(rate.replace("%", ""))];
      }, []),
    [data]
  );

  return (
    <Line
      options={{
        responsive: true,
      }}
      data={{
        labels: samples.map((_, i) => i),
        datasets: [
          {
            data: samples,
            borderColor: "rgb(130, 231, 217, 1)",
            pointRadius: 0,
            cubicInterpolationMode: "monotone",
          },
        ],
      }}
    />
  );
};
