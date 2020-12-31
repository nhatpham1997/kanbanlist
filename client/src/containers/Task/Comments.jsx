import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Comment, Tooltip, List, Avatar, Form, Button, Input, Spin } from 'antd';
import moment from 'moment';
import actions from './actions';
import selectors from './selectors';
import constants from './constants';

const { TextArea } = Input;

function Comments() {
    const dispatch = useDispatch();
    let userInfo = window.localStorage.getItem('kauth');
    userInfo = JSON.parse(userInfo);
    const task = useSelector(selectors.selectTask);
    const comments = useSelector(selectors.selectComments);
    const getCommentLoading = useSelector(selectors.selectGetCommentLoading);
    const [commentState, setCommentState] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');

    const handleUpdate = (id) => {
        console.log(id);
        // return 
    }

    const handleDelete = (id) => {
        console.log(id);
        dispatch(actions.doDestroyComment(id));
    }

    const data = {
        listComments: comments.map(item=>{
            return {
                id: item.id,
                action: [<span onClick={(id)=>handleUpdate(item.id)} key="comment-list-delete">Chỉnh sửa</span>,<span onClick={(id)=>handleDelete(item.id)} key="comment-list-delete">Xóa</span>],
                author: item.owner.fullName,
                avatar: `${process.env.REACT_APP_STATIC_AVATARS}/${item.owner.picture}`,
                content: (<p>{item.content}</p>),
                datetime: (
                    <Tooltip
                      title={moment(item.createdAt)
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD HH:mm:ss')}
                    >
                      <span>
                        {moment(item.createdAt)
                          .subtract(1, 'days')
                          .fromNow()}
                      </span>
                    </Tooltip>
                  ),
            }
        })
    }

    useEffect(() => {
        dispatch({
                type: constants.TASK_LIST_COMMENT_CHANGE,
                payload: commentState,
            })
    }, [commentState])
    
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = () => {
        
        dispatch(actions.addComment(task.id, {content: value}));

        if (!value) {
            return;
        }
        setSubmitting(true);
        setSubmitting(false);
        setValue('');
        setCommentState([
            {
                owner: {
                    fullName: `${userInfo?.user.fullName}`,
                    picture: `${userInfo?.user.picture}`,
                },
                content: value,
                datetime: moment().fromNow(),
            },
            ...commentState,
        ],);
    };

    return (
        <div>
            <Spin spinning={getCommentLoading} delay={500}>
                <List
                    className="comment-list"
                    dataSource={data.listComments}
                    header={`${data.listComments.length} replies`}
                    itemLayout="horizontal"
                    renderItem={item => (
                        <li>
                            <Comment
                                actions={item.action}
                                author={item.author}
                                avatar={item.avatar}
                                content={item.content}
                                datetime={item.datetime}
                            />
                        </li>
                    )}
                />
            </Spin>
            <Comment
                avatar={
                    <Avatar
                        src={`${process.env.REACT_APP_STATIC_AVATARS}/${userInfo?.user.picture}`}
                        alt={`${userInfo?.user.fullName}`}
                    />
                }
                content={
                    <>
                    <Form.Item>
                        <TextArea rows={2} onChange={handleChange} value={value} />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
                            Add Comment
                        </Button>
                    </Form.Item>
                    </>             
                }
            />
        </div>
    )
}

export default Comments;
