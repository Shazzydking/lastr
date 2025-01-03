import axios from "axios";
import { Form, Input, Button, message } from 'antd';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setAuthToken }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const trimmedValues = {
            email: values.email.trim(),
            password: values.password.trim(),
        };
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", trimmedValues);
            const { token, name } = response.data; 

            if (!token) {
                throw new Error("Token is missing in the response");
            }
            localStorage.setItem("authToken", token);
            localStorage.setItem("name", name); 
            setAuthToken(token);
            message.success("Login successful");
            navigate("/");
        } catch (error) {
            message.error(error.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please Enter Your Email" }]}>
                <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please Enter Your Password" }]}>
                <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
            </Form.Item>
            <p>New User? <Link to="/register">Register</Link></p>
        </Form>
    );
};

export default Login;