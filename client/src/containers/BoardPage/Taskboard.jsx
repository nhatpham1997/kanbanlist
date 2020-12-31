import React,{ useState, useEffect } from 'react'
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import reorder, { reorderQuoteMap, getSortOrder } from "../Column/reorder";
import Column from "../Column/Column";
import styled from "styled-components";
import { UserOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, Popover, Form, Input } from 'antd';
import {useParams, Link, Route} from 'react-router-dom'
import Text from 'antd/lib/typography/Text';
import { useDispatch, useSelector } from 'react-redux';
import actions from './actions'
import selectors from './selectors';
import columnSelectors from "../Column/selectors";
import columnActions from "../Column/actions";
import taskSelectors from '../Task/selectors'
import ModalTask from '../Task/ModalTask';
import { Mail } from 'react-feather';

const FormItem = Form.Item;

const TitleWrapper = styled.div`
    height: 48px;
    lineheight: "48px";
    display: flex;
    justify-content: space-between;
    padding: 0px 15px;
`;

const ListsContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const Taskboard = () => {
    const dispatch = useDispatch();
    let {id} = useParams();
    const columns = useSelector(columnSelectors.selectColumns);
    const board = useSelector(selectors.selectBoard);
    const boards = useSelector(selectors.selectBoards);
    const taskId = useSelector(taskSelectors.selectTaskId);

    const onDragEnd = result => {
        const { source, destination, type, draggableId } = result;
        // droped outside the list
         if (!destination) return;

        // cùng 1 cột cùng index 
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }
        
        if (type ==='column') {
            const newColumnOrder = [...columns];
            const [removed] = newColumnOrder.splice(source.index, 1);
            const sortOrder = getSortOrder(columns, destination.index)
            newColumnOrder.splice(destination.index, 0, {...removed, sortOrder});
            columnActions.doReorder({columnId: removed.id, sortOrder})
            dispatch(columnActions.doColumnReorder(newColumnOrder));
        return;
        }


        const data = reorderQuoteMap({
            quoteMap: columns,
            source,
            destination
        });

        dispatch(columnActions.doColumnReorder(data.quoteMap));
    };

     useEffect(() => {
        // call api
        dispatch(actions.doFind(id));
     }, [id]);

    useEffect(() => {
        // call api
        dispatch(actions.list());
    }, [])
    const [email, setemail] = useState();
    const handleChange = (event) => {
        setemail(event.target.value)
    };
    const doAddMember = () => {
        dispatch(actions.doAddMember(id, email));
    };
    const menu = (
        <Menu style={{ minWidth: "200px" }}>
            {boards.map((item, index) => (
                <Menu.Item key={index}>
                    <Link to={`/b/${item.shortid}`}>{item.name}</Link>
                </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item key="3">
                <Link to="/board/new">Create new board</Link>
            </Menu.Item>
        </Menu>
    );

    const addMembers = (
        <div style={{
            minHeight: '300px', display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <Form layout="vertical">
                <FormItem
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
                        name="emailMember"
                        placeholder="Địa chỉ email"
                        onChange={handleChange}
                        prefix={
                            <Mail
                                size={16}
                                strokeWidth={1}
                                style={{ color: "rgba(0,0,0,.25)" }}
                            />
                        }
                        type="email"
                    >
                    </Input>
                </FormItem>
            </Form>          
            <Button type="primary" onClick={doAddMember}>Gửi lời mời</Button>
        </div>
    );

    return (
        <div style={{ backgroundColor: "#f6f8fc" }}>
            {taskId && <ModalTask/>}
            <TitleWrapper>
                <div style={{ lineHeight: "48px" }}>
                    <Text style={{ color: "#73737c", fontSize: "22px" }}>
                        {board && board.name}
                    </Text>
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button
                            style={{ marginLeft: "5px" }}
                            shape="circle"
                            icon={<DownOutlined />}
                            size="small"
                        />
                    </Dropdown>
                </div>
                <div style={{ lineHeight: "48px" }}>
                    <Avatar
                        style={{ margin: "0 2px" }}
                        icon={<UserOutlined />}
                    />
                    <Avatar style={{ margin: "0 2px" }}>U</Avatar>
                    <Avatar style={{ margin: "0 2px" }}>U</Avatar>
                    <Avatar style={{ margin: "0 2px" }}>U</Avatar>
                    <Popover
                        content={addMembers}
                        title="Mời vào bảng"
                        trigger="click"
                    >
                        <Button
                            style={{ marginLeft: "2px" }}
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </Popover>    
                </div>
            </TitleWrapper>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {(provided) => (
                        <div
                            className="full-workspace scroll-x text-nowrap px-2"
                            // style={{ display: "flex", flexDirection: "row" }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >

                            {columns.map((item, index) => (
                                <Column
                                    key={item.id}
                                    index={index}
                                    info={item}
                                    tasks={[]}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Taskboard;
