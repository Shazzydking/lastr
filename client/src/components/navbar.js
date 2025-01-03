import React from "react";
import { Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const username = localStorage.getItem("name");
    const authToken = localStorage.getItem("authToken");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <div>
            <Menu mode="horizontal" theme="dark">
                <Menu.Item key="home">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="addExpense">
                    <Link to="/add-expense">Add Expense</Link>
                </Menu.Item>
                {authToken && (
                    <>
                        <Menu.Item key="username" disabled>
                            Welcome, {username}
                        </Menu.Item>
                        <Menu.Item key="logout">
                            <Button onClick={handleLogout} type="primary" danger>
                                Logout
                            </Button>
                        </Menu.Item>
                    </>
                )}
            </Menu>
        </div>
    );
};

export default Navbar;