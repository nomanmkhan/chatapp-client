import React, { useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import { Divider, Input, Button, Form, notification } from 'antd';

import "./login.css"
function SignUp(props) {
    notification.config({ duration: 2 });
    let history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [disable, setDisable] = useState(false);

    async function handleRegister() {
        if (email === "") {
            sendNotification('error', {
                title: "Email",
                msg: "Please enter your email address"
            })
            return
        }
        if (username === "") {
            sendNotification('error', {
                title: "Username",
                msg: "Please enter your username"
            })
            return
        }
        if (password === "") {
            sendNotification('error', {
                title: "Password",
                msg: "Please enter your password"
            })
            return
        }
        if (password.length < 3) {
            sendNotification('warning', {
                title: "Password",
                msg: "Your Password is not secure"
            })
            return
        }


        let data = {
            email: email.trim(),
            username: username.trim(),
            password: password.trim(),
        }
        await fetch("https://chatapp-server-nmk.herokuapp.com/api/register", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(data)
        }).then(async response => {
            setDisable(true)
            let result = await response.json();
            if (response.status !== 200) {
                sendNotification('error', { title: "Registration", msg: result.data })
                setTimeout(() => { setDisable(false) }, 2000)
            }

            if (response.status === 200) {
                // message.success(result.data, 2)
                sendNotification('success', { title: "Registration Successful", msg: result.data })
                history.replace("/login");
                setDisable(false)

            }
        })
            .catch(err => console.log("err", err))

        setEmail('')
        setUsername('')
        setPassword('')
    }

    const sendNotification = (type, data) => {
        notification[type]({
            message: data.title,
            description: data.msg,
        });
    };
    return (
        <div className="container">
            <div className="form">
                <div className="formHeading">
                    <h3>Sign up</h3>
                    <p>Register hee with your details</p>
                </div>
                <Divider />
                <Form name="basic" autoComplete="off">
                    <div className="formBody">
                        <p>Email</p>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    message: "Please enter valid email",
                                }
                            ]}
                        >
                            <Input className="inputs" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        </Form.Item>
                        <p>Username</p>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter username",
                                }
                            ]}
                        >
                            <Input className="inputs" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                        </Form.Item>
                        <p>Password</p>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter password",
                                }
                            ]}
                        >
                            <Input type={"password"} className="inputs" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        </Form.Item>
                        <Button type="primary" loading={disable} onClick={handleRegister} >Sign Up</Button>
                        <span style={{ textAlign: "right", paddingTop: "15px", fontSize: "12px" }}>If already have an account? <Link style={{ color: "#1890ff" }} to="/login" >Login here</Link> </span>
                    </div>
                </Form>

            </div>
        </div>
    );
}

export default SignUp;
