import React, { useState } from 'react';
import PlusOutlined from '@ant-design/icons';
import { Input } from 'antd';

const { TextArea } = Input;

function ActionButton() {
    const [formOpen, setformOpen] = useState(false);
    const [text, settext] = useState("");
    const openForm = () => {
        setformOpen(true);
    };
    const closeForm = (e) => {
        setformOpen(false);
    };
    const handleInputChange = (e) => {
        settext(e.target.value);
    };
    const renderButton = (list) => {
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
                <TextArea
                    placeholder={placeholder}
                    autoFocus
                    onBlur={this.closeForm}
                    value={this.state.text}
                    onChange={this.handleInputChange}
                    style={{
                        resize: "none",
                        width: "100%",
                        overflow: "hidden",
                        outline: "none",
                        border: "none"
                    }}
                />
            </div>
        )
    }
    return formOpen ? renderForm() : renderButton();
}

const styles = {
    openFormButtonGroup: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: 3,
        height: 36,
        width: 272,
        paddingLeft: 10
    },
    formButtonGroup: {
        marginTop: 8,
        display: "flex",
        alignItems: "center"
    }
};

export default ActionButton
