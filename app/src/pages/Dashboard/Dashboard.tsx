import React, { useCallback, useEffect, useMemo } from 'react';
import { Container } from 'components';
import { Layout, Col, Row, Spin, Button, Card } from 'antd';  
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { Redirect } from 'react-router-dom';
import { storageGet } from 'utils';
import { USER_STORAGE_KEY } from 'constant';
import { logout } from 'store/authSlice'; 
import { getBreeds } from 'store/breedSlice';
import Meta from 'antd/lib/card/Meta';

const { Header, Content, Footer } = Layout;
export const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootState) => state.auth.user);
  const loading = useSelector((state:RootState) => state.breed.loading);
  const breed = useSelector((state:RootState) => state.breed.breed);
  
  const userStorage = storageGet(USER_STORAGE_KEY); 
  const onLogout = useCallback(()=> { 
    dispatch(logout());
  },[dispatch]); 

  useEffect(()=>{
    dispatch(getBreeds());
  },[dispatch])
  const breeds = useMemo(()=>breed,[breed]);
  if(!userStorage || !user) {
    return <Redirect to='/login' />;
  }
  console.log(breeds)
  return (
    <Container>
      <Spin spinning={loading}>
      <Header style={{color: '#fff'}}>
          <Row justify="space-between" align="middle"> 
            <Col span={12}>Hello! {user.username} </Col>
            <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}><Button onClick={onLogout}>Logout</Button></Col>
          </Row>
      </Header>
      <Content>
        <>
        {breeds && breeds.map(breed => (
          <Card
            hoverable
            style={{ width: '32%' }}
            cover={<img alt="example" src={`/${breed.name}.png`} />}
          >
            <Meta title={breed.name}/>
          </Card>  
        ))} 
        </> 
        </Content>
      <Footer style={{justifyContent: 'center'}}>Copyright 2020</Footer>
      </Spin>
    </Container>
  );
};
