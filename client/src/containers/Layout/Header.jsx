import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import React from 'react';
import authActions from '../AuthPage/actions';
import HeaderWrapper from './styles/HeaderWrapper';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
const { Header: AntHeader } = Layout;


const Header = () => {
    const dispatch = useDispatch();
    let userInfo = window.localStorage.getItem('kauth');
    userInfo = JSON.parse(userInfo);
    let doSignout = () => {
        dispatch(authActions.doSignout());
    };

    let doNavigateToProfile = () => {
        // getHistory().push('/profile');
    };

    let userMenu = (
        <Menu selectedKeys={[]}>
            <Menu.Item onClick={doNavigateToProfile} key="userCenter">
                <Link to={`/user/${userInfo?.user.id}/update`}>
                    <UserOutlined /> Thông tin cá nhân
                </Link>
            </Menu.Item>
            <Menu.Item key="updatePassword">
                <Link to={`/user/${userInfo?.user.id}/update-password`}>
                    <UserOutlined /> Đổi mật khẩu
                </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={doSignout} key="logout">
                <LogoutOutlined />
                Thoát
            </Menu.Item>
        </Menu>
    );

    return (
        <HeaderWrapper>
            <AntHeader style={{ height: "48px", lineHeight: "48px" }}>
                <div>
                </div>
                <div>
                    <Dropdown className="user-dropdown" overlay={userMenu}>
                        <span>
                            <Avatar
                                className="user-dropdown-avatar"
                                size="small"
                                src={`${process.env.REACT_APP_STATIC_AVATARS}/${userInfo?.user.picture}`}
                                alt={`${userInfo?.user.fullName}`}
                                style={{ margin: "12px 8px 12px 0" }}
                            />
                            <span className="user-dropdown-text">{userInfo?.user.fullName}</span>
                        </span>
                    </Dropdown>
                </div>
            </AntHeader>
        </HeaderWrapper>
    );

}

export default Header;
