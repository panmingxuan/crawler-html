import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import request from '../../request';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
//引入lib库里定义的组件类型
import { WrappedFormUtils } from 'antd/lib/form/Form';
import './style.css';

interface Props {
  form: WrappedFormUtils<FormFields>;
}
//定义WrappedFormUtils的属性内容
interface FormFields {
  password: string;
}

//使用泛型的方式告诉组件从外部接收的数据类型
class LoginForm extends Component<Props> {
  state = {
    isLogin: false,
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values) => {
      //校验无问题后提交登录数据
      if (!err) {
        request
          .post('/api/login', qs.stringify({ password: values.password }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((res) => {
            const data: responseResult.login = res.data;
            if (data) {
              this.setState({
                isLogin: true,
              });
            } else {
              message.error('登陆失败');
            }
          });
      }
    });
  };

  render() {
    const { isLogin } = this.state;
    const { getFieldDecorator } = this.props.form;
    //判断是否登录，登录跳转首页，非登录状态则展示登录页面
    return isLogin ? (
      <Redirect to='/' />
    ) : (
      <div className='login-page'>
        <Form onSubmit={this.handleSubmit} className='login-form'>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入登录密码' }],
            })(<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />)}
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className='login-form-button'>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default WrappedLoginForm;
