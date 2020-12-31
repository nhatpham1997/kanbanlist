import React, {useState} from "react";
import { Inner, Wrapper } from "../BoardPage/styles/Taskboard";
import { Draggable } from "react-beautiful-dnd";
import TaskList from "./TaskList";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import FormComp from "./form/FormComp";

const Column = ({ tasks, index, info }) => {

    const [formCompVisible, setFormCompVisible] = useState(false)

    return (
        <Draggable draggableId={info.shortid} index={index}>
            {(provided) => (
                <Wrapper
                    key={index}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    {formCompVisible && (
                        <FormComp
                            visible={formCompVisible}
                            toggle={() => setFormCompVisible(!formCompVisible)}
                            columnId={info.shortid}
                        />
                    )}
                    <Inner>
                        <div
                            {...provided.dragHandleProps}
                            type="task"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h5 className="mx-2 mt-2 text-capitalize">{info.name}</h5>
                            <div>
                                <Button
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                    onClick={() => setFormCompVisible(!formCompVisible)}
                                ></Button>
                            </div>
                        </div>
                        <div
                            className="p-1"
                        >
                            <TaskList listId={info.shortid} tasks={info.tasks} />
                        </div>
                    </Inner>
                </Wrapper>
            )}
        </Draggable>
    );
};

export default Column;
