import React, { useEffect } from "react";
import { Button, Card, Col, Row } from "antd";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configStore, getHistory } from "./containers/configStore";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { GlobalStyles } from "./components/GlobalStyles";
import Layout from "./containers/Layout";
import Board from "./containers/BoardPage";
import Task from "./containers/Task";
import BoardForm from "./containers/BoardPage/form";
import Signin from "./containers/AuthPage/Signin";
import Signup from "./containers/AuthPage/Signup";
import ForgotPassword from "./containers/AuthPage/ForgotPassword";
import PrivateRoute from "./containers/utils/PrivateRoute";
import AuthRoute from "./containers/utils/AuthRoute";
import ChangePassword from "./containers/AuthPage/ChangePassword";
import UpdatePassword from "./containers/UserPage/UpdatePassword";
import FormPage from "./containers/UserPage/FormPage";
import api from "./api/api";
import boardConstants from './containers/BoardPage/constants';
import selector from "./containers/BoardPage/selectors";

const store = configStore();

const HomePage = () => {
    const dispatch = useDispatch();
    const boards = useSelector(selector.selectBoards);
    const getListBoard = async()=>{
        const res = await api.get(`/board`);
        
        dispatch({
            type: boardConstants.BOARD_GET_LIST_SUCCESS,
            payload: res.data.boards,
        });
    }

    useEffect(() => {
        // call api
        getListBoard()
    }, []);
    return (
        <div style={{ padding: "30px", background: "#ececec" }}>
            <Row gutter={16}>
                {boards.map((item) => (
                    <Col span={6}>
                        <Link to={`/b/${item.shortid}`}>
                            <Card  bordered={false} hoverable style={{marginBottom: "30px"}}>
                                <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <strong>{item.name}</strong> 

                                </div>
                            </Card>
                        </Link>
                       
                    </Col>
                ))}
                <Col span={6}>
                <Link to={`/board/new`}>
                            <Card  bordered={false} hoverable >
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100px"}}>
                                <strong>Add new</strong> 

                                </div>
                            </Card>
                        </Link>
                </Col>
            </Row>
        </div>
    );
};
function App() {
    
        return (
            <Provider store={store}>
                <ConnectedRouter history={getHistory()}>
                    <Switch>
                        <AuthRoute path="/signin" exact>
                            <Signin />
                        </AuthRoute>
                        <AuthRoute path="/signup" exact>
                            <Signup />
                        </AuthRoute>
                        <AuthRoute path="/forgot" exact>
                            <ForgotPassword />
                        </AuthRoute>
                        <AuthRoute path="/new-password" exact>
                            <ChangePassword />
                        </AuthRoute>

                        <Layout>
                            <Route path="/demo" exact>
                                <Board />
                            </Route>
                            <PrivateRoute path="/t/:boardId/:taskId" exact>
                                <Task />
                            </PrivateRoute>
                            <PrivateRoute path="/b/:id" exact>
                                <Board />
                            </PrivateRoute>
                            <PrivateRoute path="/board/new" exact>
                                <BoardForm />
                            </PrivateRoute>
                            <PrivateRoute path={`/user/:userId/update`} exact>
                                <FormPage />
                            </PrivateRoute>
                            <PrivateRoute path={`/user/:id/update-password`} exact>
                                <UpdatePassword />
                            </PrivateRoute>
                            <PrivateRoute path="/" exact>
                                <HomePage />
                            </PrivateRoute>
                        </Layout>
                    </Switch>
                </ConnectedRouter>
                <GlobalStyles />
            </Provider>
        );
}

export default App;
