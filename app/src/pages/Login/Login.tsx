import React, { useCallback } from 'react';
import { Container } from 'components';
import { Button, Col, Form, Input, Row, Spin, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getLoading, IAuthForm, login } from 'store/authSlice';
import { RootState } from 'store'; 
import { Redirect } from 'react-router-dom';
const { Title } = Typography; 
export const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state:RootState) => state.auth.loading);
  const user = useSelector((state:RootState) => state.auth.user);
  const onLogin = useCallback((user: IAuthForm)=> {
    dispatch(login(user));
  },[dispatch]);
  // after signin redirect to dashboard 
  if(user) {
    return <Redirect to="/" />;
  }
  console.log(user)
  return (
    <Container>
        <Row justify="space-around" align="middle" style={{minHeight:"100vh"}}>
          <Col xs={20} sm={10} md={6}> 
          <Title level={2} style={{marginBottom: 10, justifyContent: 'center'}}> Login </Title>
          <Spin spinning={loading} tip="Loading...">
          <Form
            name="login_form"
            className="login-form"
            initialValues={{ username: '', password: '' }} 
            onFinish={onLogin}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Username is required.' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Password is required.' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Button size="large" block type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
          </Form>
          </Spin>
          </Col>
        </Row>
    </Container>
  )
};
