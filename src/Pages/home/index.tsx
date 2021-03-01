import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import request from '../../request';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
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

interface CourseItem {
  title: string;
  count: number;
}

interface State {
  loaded: boolean;
  isLogin: boolean;
  data: DataStructure;
}
interface DataStructure {
  [key: string]: CourseItem[];
}

// interface LinData {
//   name: string;
//   type: 'line';
//   data: number[];
// }

class Home extends Component {
  //相对简单的写法
  state: State = {
    loaded: false,
    isLogin: true,
    data: {},
  };

  componentDidMount() {
    request.get('/api/isLogin').then((res) => {
      const data: boolean = res.data;
      if (!data) {
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

    request.get('/api/showData').then((res) => {
      const data: DataStructure = res.data;
      if (data) {
        this.setState({
          data,
        });
      }
    });
  }
  //退出方法
  handleLogoutClick = (e: React.MouseEvent) => {
    request.get('/api/logout').then((res) => {
      const data: boolean = res.data;
      if (data) {
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
    request.get('/api/getData').then((res) => {
      const data: boolean = res.data;
      if (data) {
        message.success('爬取成功');
      } else {
        message.error('爬取失败');
      }
    });
  };

  //使用描述文件限定数据类型
  getOption: () => echarts.EChartOption = () => {
    const { data } = this.state;
    const courseNmaes: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for (let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format('MM-DD HH:mm'));
      item.forEach((innerItem) => {
        const { title, count } = innerItem;
        //过滤重复title
        if (courseNmaes.indexOf(title) === -1) {
          courseNmaes.push(title);
        }
        tempData[title] ? tempData[title].push(count) : (tempData[title] = [count]);
      });
    }
    const result: echarts.EChartOption.Series[] = [];
    for (let i in tempData) {
      result.push({
        name: i,
        type: 'line',
        data: tempData[i],
      });
    }
    return {
      title: {
        text: '课程在线学习人数',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: courseNmaes,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: 'value',
      },
      series: result,
    };
  };

  render() {
    const { isLogin, loaded } = this.state;
    if (isLogin) {
      if (loaded) {
        return (
          <div className='home-page'>
            <div className='buttons'>
              <Button type='primary' onClick={this.handleCrowllerClick} style={{ marginRight: '25px' }}>
                爬取
              </Button>
              <Button type='primary' onClick={this.handleLogoutClick}>
                退出
              </Button>
            </div>

            <ReactECharts option={this.getOption()} />
          </div>
        );
      }
      return null;
    }
    return <Redirect to='/login' />;
  }
}

export default Home;
