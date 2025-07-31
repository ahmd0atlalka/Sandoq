import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const CitiesBarChart = ({ citiesData }) => {
  const sortedCities = Object.entries(citiesData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const data = {
    labels: sortedCities.map(([city]) => city),
    datasets: [
      {
        label: 'عدد الطلاب',
        data: sortedCities.map(([, count]) => count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'توزيع الطلاب حسب المدن',
        font: {
          family: 'Cairo',
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Cairo',
          },
        },
      },
      x: {
        ticks: {
          font: {
            family: 'Cairo',
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export const GroupsBarChart = ({ groupsData }) => {
  const sortedGroups = Object.entries(groupsData)
    .sort(([a], [b]) => a.localeCompare(b));

  const data = {
    labels: sortedGroups.map(([group]) => group),
    datasets: [
      {
        label: 'عدد الطلاب',
        data: sortedGroups.map(([, count]) => count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'توزيع الطلاب حسب المجموعات',
        font: {
          family: 'Cairo',
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Cairo',
          },
        },
      },
      x: {
        ticks: {
          font: {
            family: 'Cairo',
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export const AttendanceDoughnutChart = ({ total, attended, received }) => {
  const data = {
    labels: ['حضور مؤكد', 'حضور غير مؤكد'],
    datasets: [
      {
        data: [attended, total - attended],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Cairo',
          },
        },
      },
      title: {
        display: true,
        text: 'نسبة الحضور',
        font: {
          family: 'Cairo',
          size: 16,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export const CheckReceivedDoughnutChart = ({ total, received }) => {
  const data = {
    labels: ['شيكات مستلمة', 'شيكات غير مستلمة'],
    datasets: [
      {
        data: [received, total - received],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Cairo',
          },
        },
      },
      title: {
        display: true,
        text: 'نسبة استلام الشيكات',
        font: {
          family: 'Cairo',
          size: 16,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}; 