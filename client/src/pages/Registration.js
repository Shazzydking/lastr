import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', values);
            message.success("User  Created Successfully");
            navigate('/login');
        } catch (error) {
            message.error("Registration Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <h2>Register</h2>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please Enter Your Name" }]}>
                <Input placeholder='Enter your name' />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please Enter Your Email" }]}>
                <Input placeholder='Enter your email' />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please Enter Your Password" }]}>
                <Input.Password placeholder='Enter your password' />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Register</Button>
            </Form.Item>
        </Form>
    );
}

export default Register;