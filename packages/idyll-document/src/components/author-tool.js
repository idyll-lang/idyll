import React from 'react';

class AuthorTool extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isAuthorView: false };
    this.handleClick = this.handleClick.bind(this);
  }

  /* Returns authoring information for the values in the form of
    ComponentName
    Link to Docs page
    Information about each prop
  */
  handleFormatComponent(runtimeValues) {
    const metaValues = runtimeValues.type._idyll
    const componentName = metaValues.name;

    // Docs use lowercase component name for link
    const componentLowerCase = componentName.charAt(0).toLowerCase()
                              + componentName.slice(1);
    const componentDocsLink = "https://idyll-lang.org/docs/components/default/" + componentLowerCase;

    // For all available props in metaValues, display them
    // If runtimeValues has a value for given prop, display it
    const showProps = metaValues.props.map((prop) => {
      const runtimeValue = runtimeValues.props[prop.name];
      let currentPropValue = null;
      if (runtimeValue != undefined) {
        if (runtimeValue && {}.toString.call(runtimeValue) === '[object Function]') {
          currentPropValue = <em>function</em>;
        } else {
          currentPropValue = runtimeValue;
        }
      }
      return (
        <tr key={JSON.stringify(prop)}>
          <td>{prop.name}</td>
          <td>{prop.type}</td>
          <td>{prop.example}</td>
          <td>{currentPropValue}</td>
        </tr>
      )
    });
    return (
      <div className="author-component-view">
        <h2>{componentName} Component</h2>
        <h3><a href={componentDocsLink}>Docs</a> Link</h3>
        <h3>Props</h3>
        <table className="props-table">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Example</th>
              <th>Current Value</th>
            </tr>
            {showProps}
          </tbody>
        </table>
      </div>
    );
  }

  handleClick() {
    this.setState(prevState => ({
      isAuthorView: !prevState.isAuthorView
    }));
  }

  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    return (
      <div className="author-component">
        {props.component}
        <button className="author-view-button" onClick={this.handleClick} />
        {this.state.isAuthorView ? this.handleFormatComponent(props.authorComponent) : null}
      </div>
    );
  }
}

module.exports = AuthorTool;