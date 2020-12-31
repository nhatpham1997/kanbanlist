import { Button, Form, Input, Row, Col, Spin } from "antd";
import actions from "./actions";
import selectors from "./selectors";
import React, { useEffect, useState } from "react";
import FormWrapper from "./styles/FormWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { User, Mail } from "react-feather";
import UpdateAvatar from "./UpdateAvatar";
import { Link } from 'react-router-dom';
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
const FormComp = () => {
    const dispatch = useDispatch();
    const saveLoading = useSelector(selectors.selectSaveLoading);
    const record = useSelector(selectors.selectRecord);
    let { userId } = useParams();
    let doSubmit = values => {
        dispatch(actions.doUpdate(values));
    };
    useEffect(() => {
        dispatch(actions.doFind(userId));
    },[]);

    let renderForm = () => {
        if (!record) {
            return <Spin tip="Loading..."></Spin>
        } else {
            return (
                <Row
                    type="flex"
                    align="middle"
                    justify="center"
                    className="px-3 bg-white"
                    style={{ minHeight: "100vh" }}
                >
                    <FormWrapper>
                        <Row type="flex" justify="center">
                            <Col>
                                <UpdateAvatar
                                    picture={
                                        record
                                            ? `${process.env.REACT_APP_STATIC_URI}/images/users/${record.picture}`
                                            : null
                                    }
                                    onSuccess={(picture) =>
                                        dispatch(actions.doChangeAvatar(picture))
                                    }
                                />
                            </Col>
                        </Row>
                        <span
                            style={{
                                display: "inline-block",
                                width: "24px",
                                textAlign: "center",
                            }}
                        ></span>
                        <Form
                            style={{ maxWidth: "500px" }}
                            layout="vertical"
                            onFinish={doSubmit}
                            initialValues={{
                                ['fullName']: record?.fullName,
                                ['email']: record?.email,
                            }}
                        >
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Form.Item
                                    name="fullName"
                                    label="Full Name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input your full name!",
                                        },
                                        {
                                            min: 2,
                                            message: "At less 2 characters!",
                                        },
                                        {
                                            max: 50,
                                            message:
                                                "Must be 50 characters or less!",
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <User
                                                size={16}
                                                strokeWidth={1}
                                                style={{
                                                    color: "rgba(0,0,0,.25)",
                                                }}
                                            />
                                        }
                                        placeholder="Full Name"
                                    />
                                </Form.Item>

                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email!"
                                    },
                                    { type: "email" }
                                ]}
                                hasFeedback
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
                            </Form.Item>
                            <Form.Item className="form-buttons">
                                <Button
                                    loading={saveLoading}
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                >
                                    Save
                            </Button>
                                <Link to="/">
                                    <Button icon={<RollbackOutlined />}>Back</Button>
                                </Link>
                            </Form.Item>
                        </Form>
                    </FormWrapper>
                </Row>
            );
        }
    };
    return renderForm();
};

export default FormComp;
