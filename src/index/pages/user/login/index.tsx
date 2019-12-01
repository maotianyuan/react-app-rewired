import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form'
import { proxyLogin, proxyLogout } from './service'
interface LoginListState {
}

interface LoginListProps extends FormComponentProps {
  loading: boolean;
}

function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends Component<LoginListProps> {
  state: LoginListState = {
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        proxyLogin(values).then((data)=>{
          console.log(data)
        })
      }
    });
  };
  componentDidMount (){
    this.props.form.validateFields();
  }
  logout () {
    proxyLogout().then((data)=>{
      console.log(data)
    })
  }
  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const emailError = isFieldTouched('email') && getFieldError('email');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            前台登陆
          </Button>
        </Form.Item>
        <Button type="primary" htmlType="submit" onClick={()=>this.logout()}>
            前台退出
          </Button>
      </Form>
    );
  }
}
export default Form.create<LoginListProps>({ name: 'status_modify' })(Login)
