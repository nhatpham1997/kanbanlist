import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, Button, Modal, Row } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import selectors from './selectors'
import actions from './actions';
function UploadFileList() {
    const dispatch = useDispatch();
    const taskId = useSelector(selectors.selectTaskId);
    const fileList = useSelector(selectors.selectFileList);
    const imageList = useSelector(selectors.selectImageList);
    const props = {
        listType: 'picture',
        fileList: imageList.map(item=>{
            if(item._id){
                return {
                    uid: item._id,
                    name: item.name,
                    status: 'done',
                    url: `${process.env.REACT_APP_STATIC_PHOTOS}/${item.path}`,
                    thumbUrl: `${process.env.REACT_APP_STATIC_PHOTOS}/${item.path}`,
                }
            }else{
                return item.response;
            }
        }),
    }


    const props2 = {
        fileList: fileList.map(item=>({
            uid: item._id,
            name: item.name,
            status: 'done',
            url: `${process.env.REACT_APP_STATIC_FILES}/${item.path}`,
        })),
    }

    const [previewVisible, setpreviewVisible] = useState(false);
    const [previewImage, setpreviewImage] = useState('');
    const [previewTitle, setpreviewTitle] = useState('');
    const handlePreview = async (list) => {
        setpreviewImage(list.url);
        setpreviewVisible(true);
        setpreviewTitle(list.name);
    };

    const handleCancel = () => {
        setpreviewVisible(false);
    };

    const handleRemove = (file, type) => {
        console.log(file)
        const imageId = file.uid;
        dispatch(actions.doDestroyFile(taskId, imageId,type))
    }

    return (
        <div style={{ padding: "0 20px" }}>
            <Upload
                {...props}
                onPreview={handlePreview}
                onRemove={(file)=>handleRemove(file, "image")}
                >
            </Upload>
            <Upload
                {...props2}
                onRemove={(file)=>handleRemove(file, "file")}
            >
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div> 
    )
}

export default UploadFileList
