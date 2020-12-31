import React from 'react';
import { Button, Form, Input, Row } from "antd";
import { Eye, Mail, Triangle } from "react-feather";
import { Link, Route, Redirect, Router } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import actions from "./actions";
import selectors from "./selectors";
import { isAuthenticated } from "../utils/auth";
import Text from "antd/lib/typography/Text";

const FormItem = Form.Item;

const Content = styled.div`
    max-width: 400px;
    z-index: 2;
    min-width: 300px;
`;

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectors.selectSendResetPasswordLoading);
    const error = useSelector(selectors.selectSendResetPasswordError);
    const onFinish = values => {
        dispatch(actions.doSendResetPassword(values));
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <div>
            <Row
                type="flex"
                align="middle"
                justify="center"
                className="px-3 bg-white mh-page"
                style={{ minHeight: "100vh" }}
            >
                <Content>
                    <div className="text-center mb-5">
                        <Link to="/signin" className="brand mr-0">
                            <img src='/logo192.png' width="50px" />
                        </Link>
                        <h5 className="mb-0 mt-3">Reset your password</h5>

                        <p className="text-muted">Enter your user account's verified email address and we will send you a password reset link.</p>
                    </div>

                    {!!error && <Text type="danger">{error}</Text>}

                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <FormItem
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    message: "The input is not valid E-mail!",
                                },
                                {
                                    required: true,
                                    message: "Please input your E-mail!",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <Mail
                                        size={16}
                                        strokeWidth={1}
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                type="email"
                                placeholder="Email"
                            />
                        </FormItem>

                        <FormItem>
                            <Button
                                loading={loading}
                                type="primary"
                                htmlType="submit"
                                block
                            >
                                Reset password
                        </Button>
                        </FormItem>

                        <div className="text-center">
                            <small className="text-muted text-center">
                                <span>Don't have an account yet?</span>
                                <Link to="/signup">
                                    <span>&nbsp;Create one now!</span>
                                </Link>
                            </small>
                        </div>
                    </Form>
                </Content>
            </Row>
        </div>
    )
}

export default ForgotPassword;
