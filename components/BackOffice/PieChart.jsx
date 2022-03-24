import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

const PieChart = (props) => {
  const { chartData, title } = props;
  const labels = chartData.map((l) => Object.keys(l));
  const lol = chartData.map((i) => Object.values(i));
  console.log(lol.flat());

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Ressources crées",
        data: lol.flat(),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <h2>{title}</h2>
      <Bar data={data} options={options} width={400} height={200} />
    </Box>
  );
};

PieChart.Proptypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
    })
  ),
};
export default PieChart;
