import { useState } from "react";
import { Form, Button, message, Input, Select, DatePicker, InputNumber } from 'antd';
import axios from 'axios';

const AddExpense = () => {
    const [loading, setLoading] = useState(false); // Fixed here
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true); // Fixed here
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://localhost:5000/api/expense",
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            message.success("Expense Added successfully");
            form.resetFields();
        } catch (error) {
            message.error("Failed to add expense: " + error.response.data.message);
        } finally {
            setLoading(false); // Fixed here
        }
    };

    return (
        <div>
            <h2>Add New Expense</h2>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item name="type" label="Type" 
                    rules={[{ required: true, message: "Please select the type of expense" }]}
                >
                    <Select placeholder="Select Type">
                        <Select.Option value="income">Income</Select.Option>
                        <Select.Option value="expense">Expense</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="amount" label="Amount" 
                    rules={[{ required: true, message: "Please enter the amount!" }]}
                >
                    <InputNumber placeholder="Please Enter the Amount" min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="category" label="Category" 
                    rules={[{ required: true, message: "Please Enter the Category" }]}
                >
                    <Select placeholder="Select Category">
                        <Select.Option value="shopping">Shopping</Select.Option>
                        <Select.Option value="food">Food</Select.Option>
                        <Select.Option value="salary">Salary</Select.Option>
                        <Select.Option value="bike-repair">Bike Repair</Select.Option>
                        <Select.Option value="transport">Transport</Select.Option>
                        <Select.Option value="credit-card">Credit Card</Select.Option>
                        <Select.Option value="subscription">Subscription</Select.Option>
                        <Select.Option value="investment">Investment</Select.Option>
                        <Select.Option value="insurance">Insurance</Select.Option>
                        <Select.Option value="petrol">Petrol</Select.Option>
                        <Select.Option value="gift">Gift</Select.Option>
                        <Select.Option value="fun">Fun</Select.Option>
                        <Select.Option value="self-care">Self Care</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="description" label="Description"
                    rules={[{ required: true, message: "Please enter the description" }]}
                >
                    <Input.TextArea placeholder="Enter description" rows={4} />
                </Form.Item>
                <Form.Item name="date" label="Date" 
                    rules={[{ required: true, message: "Please select the date!" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>Add Expense</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddExpense;