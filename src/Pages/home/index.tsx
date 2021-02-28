import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import axios from 'axios';
import './style.css';

// interface State {
//   isLogin: boolean;
// }

//React.FC || ()=>JSX.Element
//Component<{}, State>接收的第一个泛型是props的类型，
//第二个泛型是state的类型，需要搭配构造器使用
//构造器的写法
// constructor(props: {}) {
//   super(props);
//   this.state = {
//     isLogin: true,
//   };
// }
class Home extends Component {
  //相对简单的写法
  state = {
    loaded: false,
    isLogin: true,
  };

  componentDidMount() {
    axios.get('/api/isLogin').then((res) => {
      if (!res.data?.data) {
        this.setState({
          loaded: true,
          isLogin: false,
        });
      } else {
        this.setState({
          loaded: true,
        });
      }
    });
  }
  //退出方法
  handleLogoutClick = (e: React.MouseEvent) => {
    axios.get('/api/logout').then((res) => {
      if (res.data?.data) {
        this.setState({
          isLogin: false,
        });
      } else {
        message.error('退出失败');
      }
    });
  };
  //点击调用爬虫
  handleCrowllerClick = (e: React.MouseEvent) => {
    axios.get('/api/getData').then((res) => {
      if (res.data?.data) {
        message.success('爬取成功');
      } else {
        message.error('爬取失败');
      }
    });
  };

  render() {
    const { isLogin, loaded } = this.state;
    if (isLogin) {
      if (loaded) {
        return (
          <div className='home-page'>
            <Button type='primary' onClick={this.handleCrowllerClick} style={{ marginLeft: '6px' }}>
              爬取
            </Button>
            <Button type='primary'>展示</Button>
            <Button type='primary' onClick={this.handleLogoutClick}>
              退出
            </Button>
          </div>
        );
      }
      return null;
    }
    return <Redirect to='/login' />;
  }
}

export default Home;
