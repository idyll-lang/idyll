import React from 'react';

class UserViewPlaceholder extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='placeholder'>
        {this.props.component}
        <p>Hello is a placeholder for now !!!!</p>
      </div>
    );
  }
}

export default UserViewPlaceholder;