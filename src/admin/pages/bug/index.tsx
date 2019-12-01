import React, { Component } from 'react'
import { Form } from 'antd';
import { FormComponentProps } from 'antd/es/form'
interface LoginListState {
}

interface IndexListProps extends FormComponentProps {
  loading: boolean;
}


class Login extends Component<IndexListProps> {
  state: LoginListState = {
  };
  
  render () {
    return (
      <div>
        后台 bug index
      </div>
    );
  }
}
export default Form.create<IndexListProps>({ name: 'status_modify' })(Login)
