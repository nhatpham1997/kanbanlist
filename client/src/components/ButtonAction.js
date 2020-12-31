import React, {useState} from 'react';
import PlusOutlined from '@ant-design/icons';
import { Card, Input, CloseOutlined } from 'antd';

const { TextArea } = Input;

function ButtonAction() {
    const [formOpen, setformOpen] = useState(false);
    const [text, settext] = useState('');
    const openForm = () => {
        setformOpen(true);
    }
    const closeForm = () => {
        setformOpen(false);
    }
    const handleInputChange = e => {
        settext(e.target.value);
    }
    const handleAddList = () => {
        
    }
    const renderAddButton = (list) => {
        const buttonText = list ? "Thêm danh sách khác" : "Thêm thẻ khác";
        const buttonTextOpacity = list ? 1 : 0.5;
        const buttonTextColor = list ? "#172b4d" : "inherit";
        const buttonTextBackground = list ? "#ebecf0" : "inherit";

        return (
            <div
                onClick = {openForm}
                style = {{
                    ...styles.openFormButtonGroup,
                    opacity: buttonTextOpacity,
                    color: buttonTextColor,
                    backgroundColor: buttonTextBackground
                }}
            >
                <PlusOutlined />
                <p>{buttonText}</p>
            </div>
        )
    }
    const renderForm = (list) => {
        const placeholder = list ? "Nhập tiêu đề danh sách..." : "Nhập tiêu đề cho thẻ này...";
        const buttonTitle = list ? "Thêm danh sách" : "Thêm thẻ";
        return (
            <div>
                <Card>
                    <TextArea></TextArea>
                </Card>
                <div style={styles.formButtonGroup}>
                    <Button
                        onClick={
                            list ? this.handleAddList : this.handleAddCard
                        }
                        style={{ color: "white", backgroundColor: "#5aac44" }}
                    >
                        {buttonTitle}
                        {""}
                    </Button>
                    <CloseOutlined />
                </div>
            </div>
        );
    }
    return formOpen ? renderForm() : renderAddButton();
}

export default ButtonAction
