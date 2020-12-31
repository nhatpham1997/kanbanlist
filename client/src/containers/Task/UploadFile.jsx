import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { isAuthenticated } from "../shared/routes/permissionChecker";
import constants from './constants';
import { useDispatch } from 'react-redux';

function UploadFile({ taskId }) {
    const dispatch = useDispatch();
    const [imageUploadFile, setImageUploadFile] = useState(null);
    const [setFileUploadFile] = useState(null);
    const onInputFileListChange = ({ file, fileList }) => {
        setFileUploadFile(fileList)

        if (file.status === 'uploading') {
            return;
        }
        dispatch({
            type: constants.INPUT_FILE_LIST_CHANGE,
            payload: fileList.map(item=>({_id: item.response.uid,  name: item.response.name, path: item.response.path})),
        });

        setFileUploadFile(null)
    };
    const onInputImageListChange = ({ file, fileList }) => {
        setImageUploadFile(fileList)

        if (file.status === 'uploading') {
            // console.log(file, fileList);
            return;
          }
        dispatch({
            type: constants.INPUT_IMAGE_LIST_CHANGE,
            payload: fileList.map(item=>({_id: item.response.uid,  name: item.response.name, path: item.response.path})),
        });
        setImageUploadFile(null)
    };

    return (
        <div
            style={{
                width: "max-content",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Upload
                name="files"
                accept="text/plain, application/pdf, .csv, .docx, .xlsx"
                multiple={false}
                action={`${process.env.REACT_APP_API_URI}/task/files/${taskId}`}
                headers={{
                    Authorization: "Bearer " + isAuthenticated(),
                }}
                showUploadList={false}
                onChange={onInputFileListChange}
            >
                <Button>
                    <UploadOutlined /> Đính kèm tệp.
                </Button>
            </Upload>
            <Upload
                listType='picture'
                name="photos"
                accept="file/*"
                fileList={imageUploadFile}
                multiple={false}
                action={`${process.env.REACT_APP_API_URI}/task/photos/${taskId}`}
                headers={{
                    Authorization: "Bearer " + isAuthenticated(),
                }}
                showUploadList={false}
                onChange={onInputImageListChange}
            >
                <Button>
                    <UploadOutlined /> Đính kèm ảnh
                </Button>
            </Upload>
        </div>
    );
}

export default UploadFile
