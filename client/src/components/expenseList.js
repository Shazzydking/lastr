import React, { useState, useEffect } from "react";
import { Layout, Menu, Table, Button, message, Form, Modal, Input, InputNumber, DatePicker, Select } from "antd";
import axios from "axios";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import moment from 'moment';
import { Link } from "react-router-dom";
import {format} from 'date-fns'

const { Header, Sider, Content, Footer } = Layout;

const ExpenseList = () => {
    const [loading, setLoading] = useState(false);
    const [expense, setExpense] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedExpense, setSelectedExpense] = useState(null);

    const fetchList = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("User  not authenticated");
            }

            const response = await axios.get("https://lastr.onrender.com/api/expense", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setExpense(response.data);
        } catch (error) {
            message.error("Failed to fetch the data");
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id) => {
        try {
            const token = localStorage.getItem("authToken");
              if (!token) {
                  throw new Error("User  not authenticated");
              }
      
              await axios.delete(`https://lastr.onrender.com/api/expense/${id}`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
            message.success("Expense Deleted Successfully");
            fetchList();
        } catch (error) {
            message.error("Expense deletion unsuccessful");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const showEditModal = (expense) => {
        setSelectedExpense(expense);
        form.setFieldsValue({
            type: expense.type,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: expense.date ? moment(expense.date) : null,
        });
        setIsModalVisible(true);
    };

    const handleEditExpense = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
              if (!token) {
                  throw new Error("User  not authenticated");
              }
              await axios.put(`https://lastr.onrender.com/api/expense/${selectedExpense._id}`, values, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
            message.success("Expense Updated Successfully");
            fetchList();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Error while updating");
        } finally {
            setLoading(false);
        }
    };

    const Columns = [
        { title: "Type ", dataIndex: "type", key: "type" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Description", dataIndex: "description", key: "description" },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => date ? format(new Date(date), "dd MMMM yyyy") : "N/A", // Format the date
        },
        {
            title: "Action",
            key: "action",
            render: (_, data) => (
                <>
                    <Button type="link" onClick={() => showEditModal(data)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => deleteExpense(data._id)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
                <div style={{ padding: "16px", textAlign: "center" }}>
                    <img
                        src='/logo.png'
                        alt="App Logo"
                        style={{ width: collapsed ? "30px" : "120px", transition: "width 0.3s", marginBottom: "2px" }}
                    />
                </div>
                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                    <Menu.Item key="1" icon={<MenuFoldOutlined />}>
                        <Link to='/'>Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<MenuUnfoldOutlined />}>
                        <Link to='/add-expense'>Add Expense</Link>
                    </Menu.Item>
                    <Menu.Item key="4"><Link to='/expense-chart'>Charts</Link></Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
                    <h1 style={{ margin: 0 }}>Expense Tracker</h1>
                </Header>
                <Content style={{ margin: "16px" }}>
                    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
                        <Table columns={Columns} dataSource={expense} rowKey="_id" loading={loading} />
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>Expense Tracker ©2025 Created by Vishal Gupta</Footer>
            </Layout>

            <Modal
                title="Edit Expense"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText="Update"
            >
                <Form form={form} layout="vertical" onFinish={handleEditExpense}>
                    <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please select a type" }]}>
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Please enter the amount" }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please enter a category" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter a description" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default ExpenseList;