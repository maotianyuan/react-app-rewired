import React from 'react';
import ReactDOM from 'react-dom';

const Root: React.FC = () => {
  return (
    <div >
      index
    </div>
  )
}

/**
 * 此文件不会用到，只是为了防止报错
 */
ReactDOM.render(<Root/>, document.getElementById('root'));
