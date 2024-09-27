import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import "./Reports.css"
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Reports = () => {
    const [salesChartData, setSalesChartData] = useState(null);
    const [profitChartData, setProfitChartData] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerSalesData, setCustomerSalesData] = useState(null);
    const [itemName, setItemName] = useState('');
    const [itemSalesData, setItemSalesData] = useState(null);
    const [loading, setLoading] = useState(false); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    const getCookie = (name) => {
        const cookieName = `${name}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8000/get_sales/", { 'user_id': getCookie("userId") });
            if (res.data.success) {
                return res.data.sales;
            } else {
                setError("No data available for reports.")
            }
        } catch (err) {
            setError("No data available for reports.")
            return [];
        } finally {
            setLoading(false);
        }
    };

    const processSalesData = (sales, monthsCount) => {
        const salesData = {};
        const profitData = {};
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        for (let i = 0; i < monthsCount; i++) {
            let monthIndex = currentMonth - i;
            let year = currentYear;

            if (monthIndex < 0) {
                monthIndex += 12;
                year--;
            }

            const monthName = months[monthIndex];
            const key = `${monthName} ${year}`;
            salesData[key] = 0;
            profitData[key] = 0;
        }

        sales.forEach(sale => {
            const salesDate = new Date(sale['date']);
            const salesMonth = salesDate.getMonth();
            const salesYear = salesDate.getFullYear();

            for (let i = 0; i < monthsCount; i++) {
                let monthIndex = currentMonth - i;
                let year = currentYear;

                if (monthIndex < 0) {
                    monthIndex += 12;
                    year--;
                }

                if (salesMonth === monthIndex && salesYear === year) {
                    const monthName = months[monthIndex];
                    const key = `${monthName} ${year}`;

                    let totalSalesAmount = 0;
                    let totalProfitAmount = 0;
                    sale.items.forEach(item => {
                        const salesAmount = parseInt(item.quantity) * item.sellingPrice;
                        const profitAmount = parseInt(item.quantity) * (item.sellingPrice - item.costPrice);
                        totalSalesAmount += salesAmount;
                        totalProfitAmount += profitAmount;
                    });

                    salesData[key] += totalSalesAmount;
                    profitData[key] += totalProfitAmount;
                }
            }
        });

        return { salesData, profitData };
    };

    const updateCharts = (salesData, profitData) => {
        const salesLabels = Object.keys(salesData);
        const salesDataset = Object.values(salesData);
        const profitDataset = Object.values(profitData);

        setSalesChartData({
            labels: salesLabels,
            datasets: [
                {
                    label: 'Sales Amount',
                    data: salesDataset,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });

        setProfitChartData({
            labels: salesLabels,
            datasets: [
                {
                    label: 'Profit Amount',
                    data: profitDataset,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    const fetchReports = async () => {
        const sales = await fetchSalesData();
        if (sales.length > 0) {
            const { salesData, profitData } = processSalesData(sales, 6);
            updateCharts(salesData, profitData);
        }
    };

    const fetchCustomerSales = async () => {
        const sales = await fetchSalesData();
        if (sales.length > 0) {
            const customerSalesData = {};
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            for (let i = 0; i < 6; i++) {
                let monthIndex = currentMonth - i;
                let year = currentYear;

                if (monthIndex < 0) {
                    monthIndex += 12;
                    year--;
                }

                const monthName = months[monthIndex];
                const key = `${monthName} ${year}`;
                customerSalesData[key] = 0;
            }

            sales.forEach(sale => {
                if (sale['customer_name'].toLowerCase() === customerName.toLowerCase()) {
                    const salesDate = new Date(sale['date']);
                    const salesMonth = salesDate.getMonth();
                    const salesYear = salesDate.getFullYear();

                    for (let i = 0; i < 6; i++) {
                        let monthIndex = currentMonth - i;
                        let year = currentYear;

                        if (monthIndex < 0) {
                            monthIndex += 12;
                            year--;
                        }

                        if (salesMonth === monthIndex && salesYear === year) {
                            const monthName = months[monthIndex];
                            const key = `${monthName} ${year}`;

                            let totalSalesAmount = 0;
                            sale.items.forEach(item => {
                                const salesAmount = parseInt(item.quantity) * item.sellingPrice;
                                totalSalesAmount += salesAmount;
                            });

                            customerSalesData[key] += totalSalesAmount;
                        }
                    }
                }
            });

            const salesLabels = Object.keys(customerSalesData);
            const salesDataset = Object.values(customerSalesData);

            setCustomerSalesData({
                labels: salesLabels,
                datasets: [
                    {
                        label: `Sales for ${customerName}`,
                        data: salesDataset,
                        fill: false,
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        tension: 0.1,
                    },
                ],
            });
        }
    };

    const fetchItemSales = async () => {
        const sales = await fetchSalesData();
        if (sales.length > 0) {
            const itemSalesData = {};
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            for (let i = 0; i < 6; i++) {
                let monthIndex = currentMonth - i;
                let year = currentYear;

                if (monthIndex < 0) {
                    monthIndex += 12;
                    year--;
                }

                const monthName = months[monthIndex];
                const key = `${monthName} ${year}`;
                itemSalesData[key] = 0;
            }

            sales.forEach(sale => {
                if (sale.items.some(item => item.name.toLowerCase() === itemName.toLowerCase())) {
                    const salesDate = new Date(sale['date']);
                    const salesMonth = salesDate.getMonth();
                    const salesYear = salesDate.getFullYear();

                    for (let i = 0; i < 6; i++) {
                        let monthIndex = currentMonth - i;
                        let year = currentYear;

                        if (monthIndex < 0) {
                            monthIndex += 12;
                            year--;
                        }

                        if (salesMonth === monthIndex && salesYear === year) {
                            const monthName = months[monthIndex];
                            const key = `${monthName} ${year}`;

                            let totalSalesAmount = 0;
                            sale.items.forEach(item => {
                                if (item.name.toLowerCase() === itemName.toLowerCase()) {
                                    const salesAmount = parseInt(item.quantity) * item.sellingPrice;
                                    totalSalesAmount += salesAmount;
                                }
                            });

                            itemSalesData[key] += totalSalesAmount;
                        }
                    }
                }
            });

            const salesLabels = Object.keys(itemSalesData);
            const salesDataset = Object.values(itemSalesData);

            setItemSalesData({
                labels: salesLabels,
                datasets: [
                    {
                        label: `Sales for ${itemName}`,
                        data: salesDataset,
                        fill: false,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        tension: 0.1,
                    },
                ],
            });
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (customerName) {
            fetchCustomerSales();
        }
    }, [customerName]);

    useEffect(() => {
        if (itemName) {
            fetchItemSales();
        }
    }, [itemName]);

    return (
        <div className='reports-div'>
            <h1>These are some reports prepared by us for you</h1>
            <div className='reports-item'>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {salesChartData &&
                    <div>
                        <div className='reports-item'>
                            <h2>Sales Chart for Last 6 Months</h2>
                            <Bar data={salesChartData} />
                        </div>
                    </div>
                }
            </div>
            <hr />
            <div className='reports-item'>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {profitChartData &&
                    <div>
                        <div className='reports-item'>
                            <h2>Profit Chart for Last 6 Months</h2>
                            <Bar data={profitChartData} />
                        </div>
                    </div>
                }
            </div>
            <hr />
            <div className='reports-item'>
                <h2>Customer Sales Chart</h2>
                <div className='input-div'>
                    <input
                        type="text"
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        />
                </div>
                {customerSalesData && <Line data={customerSalesData} />}
            </div>
            <hr />
            <div className='reports-item'>
                <h2>Item Sales Chart</h2>
                <div className='input-div'>
                    <input
                        type="text"
                        placeholder="Enter item name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        />
                </div>
                {itemSalesData && <Line data={itemSalesData} />}
            </div>
        </div >
    );
};

export default Reports;