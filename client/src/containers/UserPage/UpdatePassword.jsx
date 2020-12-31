import { Button, Form, Input, Row } from "antd";
import actions from "./actions";
import selectors from "./selectors";
import React from "react";
import FormWrapper, {
} from "./styles/FormWrapper";
import { useSelector, useDispatch } from "react-redux";
import {  Eye} from "react-feather";
import { Link } from "react-router-dom";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
const UpdatePassword = () => {
    const dispatch = useDispatch();
    const saveLoading = useSelector(selectors.selectSaveLoading);
    let onFinish = values => {
        dispatch(actions.doUpdatePassword(values));
    };

    let renderForm = () => {
        return (
            <Row
                type="flex"
                align="middle"
                justify="center"
                className="px-3 bg-white"
                style={{ minHeight: "100vh" }}
            >
                <FormWrapper>
                    <Form
                        style={{ maxWidth: "500px" }}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Old Password"
                            name="Old Password"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your old Password!",
                                },
                                {
                                    min: 6,
                                    message: "At less 6 characters!",
                                },
                                {
                                    max: 128,
                                    message:
                                        "Must be 128 characters or less!",
                                },
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
                                placeholder="Old password"
                            />
                        </Form.Item>
                        <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!"
                            }
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
                    </Form.Item>

                    <Form.Item
                        label="Confirm password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your password!"
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        "The two passwords that you entered do not match!"
                                    );
                                }
                            })
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
                    </Form.Item>
                        <Form.Item className="form-buttons">
                            <Button
                                loading={saveLoading}
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined/>}
                            >
                                Save
                            </Button>
                            <Link to="/">
                                <Button icon={<RollbackOutlined/>}>Back</Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </FormWrapper>
            </Row>
        );
    };

    // if (dataLoading) {
    //     return <Spinner />;
    // }

    // if (isEditing() && !record) {
    //     return <Spinner />;
    // }
    return renderForm();
};

export default UpdatePassword;
