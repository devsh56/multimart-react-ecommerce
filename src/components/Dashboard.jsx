import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js library
import React, { useEffect, useRef, useState } from 'react';
import { getcartitem, userroute } from '../utils/Apiroutes';
import './Dashboard.css'; // Import CSS file for additional styling

const Dashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});
  const [productsForPieChart, setProductsForPieChart] = useState([]);
  const [venue, setVenue] = useState(''); // Assuming you need a venue field

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(getcartitem, { params: { userId: user._id } });
          setCartItems(response.data.user.cart);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    fetchCartItems();
  }, [user]);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(`${userroute}${user._id}`);
          setProductsForPieChart(response.data.user.createdProducts);
          //  setVenue(response.data.user.venue || ''); // Assuming venue is part of the user data
        }
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    };
    fetchUserItems();
  }, [user]);

  // Calculate total number of orders
  const totalOrders = productsForPieChart.reduce((total, product) => total + (product.sold || 0), 0);
  const totalprice = productsForPieChart.reduce((total, product) => total + (product.price || 0), 0);
  // Pie chart for products
  const chartRefPie = useRef(null);
  const chartInstancePie = useRef(null);

  useEffect(() => {
    if (productsForPieChart.length === 0) return;
    if (chartInstancePie.current) {
      chartInstancePie.current.destroy();
    }

    const ctxPie = chartRefPie.current.getContext('2d');
    const newChartInstancePie = new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: productsForPieChart.map(product => product.name),
        datasets: [{
          data: productsForPieChart.map(product => product.price), // or another metric
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        }],
      },
      options: {
        animation: { duration: 2000, easing: 'easeInOutQuart' },
        plugins: { legend: { position: 'right' } },
      },
    });

    chartInstancePie.current = newChartInstancePie;

    return () => {
      if (chartInstancePie.current) {
        chartInstancePie.current.destroy();
      }
    };
  }, [productsForPieChart]);

  // Bar chart for sold counts
  const chartRefBar = useRef(null);
  const chartInstanceBar = useRef(null);

  useEffect(() => {
    if (productsForPieChart.length === 0) return;
    if (chartInstanceBar.current) {
      chartInstanceBar.current.destroy();
    }

    const ctxBar = chartRefBar.current.getContext('2d');
    const newChartInstanceBar = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: productsForPieChart.map(product => product.name),
        datasets: [{
          label: 'Sold Count',
          data: productsForPieChart.map(product => product.sold || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: { display: false }, // Hide legend if you don't want it
        },
        animation: { duration: 2000, easing: 'easeInOutQuart' },
      },
    });

    chartInstanceBar.current = newChartInstanceBar;

    return () => {
      if (chartInstanceBar.current) {
        chartInstanceBar.current.destroy();
      }
    };
  }, [productsForPieChart]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-section">
        <h2>Orders</h2>
        <p>Total Orders: {totalOrders}</p>
      </div>
      <div className="dashboard-section">
        <h2>Venue</h2>
        <p>Venue: {totalprice}</p>
      </div>
      <div className="dashboard-section">
        <h2>Top Products (Pie Chart)</h2>
        <canvas ref={chartRefPie} />
      </div>
      <div className="dashboard-section">
        <h2>Sold Count of Products (Bar Chart)</h2>
        <canvas ref={chartRefBar} />
      </div>
    </div>
  );
}

export default Dashboard;
