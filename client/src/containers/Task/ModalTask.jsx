import React from 'react'
import { Modal, Button, Popover, Upload, message, Popconfirm, Spin } from 'antd';
import { UserOutlined, TagOutlined, CheckSquareOutlined, ClockCircleOutlined, LinkOutlined, PictureOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import actions from './actions'
import selectors from './selectors'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import styled from 'styled-components'
import ToggleInput from '../../components/ToggleInput';
import TextAreaInput from '../../components/ToggleTextArea';
import UploadFile from './UploadFile';
import UploadFileList from './UploadFileList';
import api from '../../api/api';
import Comments from './Comments';

const TaskWrapper = styled.div`
    padding: 10px 15px;
    .task-header {
        font-size: 18px;
        margin: 10px 0px;
        font-weight: bold;
    }
    .task-body {
        font-size: 14px;
        margin: 10px 0px 15px 0px;
        display: flex;
        justify-content: space-between;
    }
`;

function ModalTask() {
    const text = <span>Title</span>;
    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );
    const dispatch = useDispatch();
    const taskId = useSelector(selectors.selectTaskId);
    const destroyLoading = useSelector(selectors.selectDestroyLoading);
    let task = useSelector(selectors.selectTask);
    const onCancel = () => {
        dispatch(actions.doSelectTask(null));
    }

    const onBlurTitleInput = (value) => {
        dispatch(actions.doUpdate({ title: value }, taskId));
    }

    const onBlurDescriptionInput = (value) => {
        dispatch(actions.doUpdate({ description: value }, taskId));
    }

    useEffect(() => {
        dispatch(actions.doFind(taskId));
    }, [])

    const fileList = [
    ];

    const props = {
        listType: 'picture',
        defaultFileList: [...fileList],
    };

    const confirmDelete = () => {
        dispatch(actions.doDestroy(task.shortid))
    }

    const cancelDelete = (e) => {
        console.log(e);
        message.error('Click on No');
    }

    return (
        <Modal
            visible={true}
            okText="Create"
            cancelText="Cancel"
            maskClosable={false}
            onOk={() => {
                console.log("hdhsfsdf");
            }}
            onCancel={onCancel}
            footer={false}
            width="fit-content"
        >
            <Spin spinning={destroyLoading} delay={500}>
                <TaskWrapper>
                    <div className="task-header">
                        <ToggleInput
                            value={task?.title}
                            onBlur={onBlurTitleInput}
                        />
                    </div>
                    <div className="task-body">
                        <div style={{ padding: "0 10px" }}>
                            <strong>Mô tả:</strong>
                            <TextAreaInput
                                value={task?.description}
                                onBlur={onBlurDescriptionInput}
                            />
                            <UploadFileList />
                            <strong>Comments:</strong>
                            <Comments/>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p><strong>Thêm vào thẻ</strong></p>
                            <Popover
                                placement="bottom"
                                title={text}
                                content={content}
                                trigger="click"
                            >
                                <Button><UserOutlined />Thành viên</Button>
                            </Popover>
                            <Popover
                                placement="bottom"
                                title={text}
                                content={content}
                                trigger="click"
                            >
                                <Button><ClockCircleOutlined />Ngày hết hạn</Button>
                            </Popover>
                            <UploadFile taskId={task?.shortid} />
                            <Popconfirm
                                title="Are you sure delete this task?"
                                onConfirm={confirmDelete}
                                onCancel={cancelDelete}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button><DeleteOutlined /> Xóa thẻ</Button>
                            </Popconfirm>

                        </div>
                    </div>
                </TaskWrapper>
            </Spin>
        </Modal>
    );
}

export default ModalTask
