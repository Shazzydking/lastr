import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { Spin, Button, message } from "antd";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExpenseChart = () => {
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("User not authenticated");
                }

                const response = await axios.get("https://lastr.onrender.com/api/expense", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const income = [];
                const expense = [];
                response.data.forEach((item) => {
                    if (item.type === "income") {
                        income.push(item);
                    } else if (item.type === "expense") {
                        expense.push(item);
                    }
                });

                const groupIncomeData = income.reduce((acc, item) => {
                    const category = item.category;
                    acc[category] = (acc[category] || 0) + item.amount;
                    return acc;
                }, {});

                const groupExpenseData = expense.reduce((acc, item) => {
                    const category = item.category;
                    acc[category] = (acc[category] || 0) + item.amount;
                    return acc;
                }, {});

                const incomeChartData = Object.keys(groupIncomeData).map((key) => ({
                    category: key,
                    amount: groupIncomeData[key],
                }));

                const expenseChartData = Object.keys(groupExpenseData).map((key) => ({
                    category: key,
                    amount: groupExpenseData[key],
                }));

                setIncomeData(incomeChartData);
                setExpenseData(expenseChartData);
            } catch (error) {
                message.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadPDF = async () => {
        try {
            const doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Title
            doc.setFontSize(18);
            doc.text("Expense Tracker Report", pageWidth / 2, 20, { align: "center" });

            // Income and Expense Breakdown
            doc.setFontSize(12);
            doc.text("Income Breakdown:", 10, 30);
            incomeData.forEach((item, index) => {
                doc.text(`${index + 1}. ${item.category}: ${item.amount}`, 10, 40 + index * 10);
            });

            const expenseStart = 40 + incomeData.length * 10 + 10;
            doc.text("Expense Breakdown:", 10, expenseStart);
            expenseData.forEach((item, index) => {
                doc.text(`${index + 1}. ${item.category}: ${item.amount}`, 10, expenseStart + 10 + index * 10);
            });

            // Add Charts
            const incomeChartElement = document.querySelector(".income-chart");
            const expenseChartElement = document.querySelector(".expense-chart");

            if (!incomeChartElement || !expenseChartElement) {
                message.error("Unable to find chart elements for PDF generation.");
                return;
            }

            const incomeCanvas = await html2canvas(incomeChartElement, { scale: 2 });
            const expenseCanvas = await html2canvas(expenseChartElement, { scale: 2 });

            const chartWidth = pageWidth / 2 - 20;
            const chartHeight = (incomeCanvas.height / incomeCanvas.width) * chartWidth;

            doc.addImage(incomeCanvas.toDataURL("image/png"), "PNG", 10, expenseStart + 50, chartWidth, chartHeight);
            doc.addImage(expenseCanvas.toDataURL("image/png"), "PNG", pageWidth / 2 + 10, expenseStart + 50, chartWidth, chartHeight);

            // Footer
            doc.setFontSize(10);
            doc.text("Expense Tracker ©2025 Created by Vishal Gupta", pageWidth / 2, pageHeight - 10, { align: "center" });

            doc.save("Expense_Report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            message.error("Failed to generate PDF. See console for details.");
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Income Overview</h2>
            <div className="income-chart" style={{ display: "flex", justifyContent: "center" }}>
                <PieChart width={500} height={500}>
                    <Pie
                        data={incomeData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#00C49F"
                        label={({ category, amount }) => `${category}: ${amount}`}
                    >
                        {incomeData.map((entry, index) => (
                            <Cell key={`income-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            <h2 style={{ textAlign: "center" }}>Expense Overview</h2>
            <div className="expense-chart" style={{ display: "flex", justifyContent: "center" }}>
                <PieChart width={500} height={500}>
                    <Pie
                        data={expenseData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#FF8042"
                        label={({ category, amount }) => `${category}: ${amount}`}
                    >
                        {expenseData.map((entry, index) => (
                            <Cell key={`expense-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            <div style={{ textAlign: "center", marginTop: 20 }}>
                <Button type="primary" onClick={handleDownloadPDF} style={{ marginBottom: "20px" }}>
                    Download Report as PDF
                </Button>
            </div>
        </div>
    );
};

export default ExpenseChart;
