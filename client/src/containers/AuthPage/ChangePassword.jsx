import React from "react";
import { Button, Form, Input, Typography, Row } from "antd";
import { Eye } from "react-feather";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import actions from "./actions";
import selectors from "./selectors";
const FormItem = Form.Item;
const { Text } = Typography;

const Content = styled.div`
    max-width: 400px;
    z-index: 2;
    min-width: 300px;
`;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ChangePassword = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const loading = useSelector(selectors.selectChangePasswordLoading)
    const error = useSelector(selectors.selectChangePasswordError)
    const onFinish = (userInfo) => {
        const email = query.get("email");
        const resetToken = query.get("resetToken")
        dispatch(actions.doChangePassword({...userInfo, email, resetToken}));
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row
            type="flex"
            align="middle"
            justify="center"
            className="px-3 bg-white"
            style={{ minHeight: "100vh" }}
        >
            <Content>
                <div className="text-center mb-5">
                    <Link to="/signup">
                        <span className="brand mr-0">     
                            <img width="50" src="/logo192.png" />
                        </span>
                    </Link>
                    <h5 className="mb-0 mt-3">Change password</h5>
                </div>

                {/* Display errors  */}
                <div className="mb-3">
                    <Text type="danger">{error}</Text>
                </div>

                <Form
                    layout="vertical"
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <FormItem
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                            {
                                min: 6,
                                message: "At less 6 characters!",
                            },
                            {
                                max: 128,
                                message: "Must be 128 characters or less!",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input
                            prefix={
                                <Eye
                                    size={16}
                                    strokeWidth={1}
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            type="password"
                            placeholder="Password"
                        />
                    </FormItem>

                    <FormItem
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input
                            prefix={
                                <Eye
                                    size={16}
                                    strokeWidth={1}
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            type="password"
                            placeholder="Confirm password"
                        />
                    </FormItem>

                    <FormItem>
                        <Button
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            Change password
                        </Button>
                    </FormItem>
                </Form>
            </Content>
        </Row>
    );
};

export default ChangePassword;