import React from 'react';

class AuthorTool extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {isAuthorView: false};
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
    const runtimeProps = Object.keys(runtimeValues.props);

    const showProps = metaValues.props.map((prop) => {
      const runtimeValue = runtimeValues.props[prop.name];
      if (runtimeValue != undefined) {
        let valueString = null;
        if (runtimeValue.constructor === Object) {
          valueString = JSON.stringify(runtimeValue);
        } else {
          valueString = runtimeValue;
        }
        return (
          <tr key={JSON.stringify(prop)}>
            <td>{prop.name}</td>
            <td>{prop.type}</td>
            <td>{prop.example}</td>
            <td>{valueString}</td>
          </tr>
        )
      } else {
        return (
          <tr key={JSON.stringify(prop)}>
            <td>{prop.name}</td>
            <td>{prop.type}</td>
            <td>{prop.example}</td>
            <td></td>
          </tr>
        )
      }
    });
    return (
      <div className="author-component-view">
        <p>{componentName} Component</p>
        <p>Link to <a href={componentDocsLink}>Docs</a></p>
        <p>Props</p>
        <table>
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
        <button className="author-view-button" onClick={this.handleClick}/>
        {this.state.isAuthorView ? this.handleFormatComponent(props.authorComponent) : null}
      </div>
    );
  }
}

module.exports = AuthorTool;