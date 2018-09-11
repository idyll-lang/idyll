import React from 'react';
import ReactTooltip from 'react-tooltip';

class AuthorTool extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isAuthorView: false, debugHeight: 0};
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
    const componentLowerCase = componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const componentDocsLink = "https://idyll-lang.org/docs/components/default/" +
      componentLowerCase;

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
    const {isAuthorView, debugHeight} = this.state;
    const currentDebugHeight = isAuthorView ? debugHeight : 0;
    const marginToGive = isAuthorView ? 15 : 0;
    return (
      <div className="debug-collapse" 
        style={{
          height: currentDebugHeight + 'px',
          marginBottom: marginToGive + 'px'
        }}
      >
        <div className="author-component-view" ref="inner">
          <table className="props-table">
            <tbody>
              <tr>
                <th>Prop Name</th>
                <th>Type</th>
                <th>Example</th>
                <th>Current Value</th>
              </tr>
              {showProps}
            </tbody>
          </table>
          <div className="icon-links">
            <a className="icon-link" href={componentDocsLink}>
              <img className="icon-link-image"
                src="https://raw.githubusercontent.com/google/material-design-icons/master/action/svg/design/ic_description_24px.svg?sanitize=true"
              />
            </a>
            <div className="icon-tooltip">docs</div>
          </div>
        </div>
      </div>
    );
  }

  handleClick() {
    this.setState(prevState => ({
      isAuthorView: !prevState.isAuthorView,
      debugHeight: this.refs.inner.clientHeight
    }));
  }

  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    const addBorder = this.state.isAuthorView ? {outline: '2px solid grey',
      backgroundColor: '#F5F5F5',
      transition: 'background-color 0.4s linear'} : null;
    return (
      <div className="component-debug-view" style={addBorder}>
        {props.component}
        <button className="author-view-button"
          onClick={this.handleClick}
          data-tip data-for={props.uniqueKey}
        />
        <ReactTooltip
          className="button-tooltip"
          id={props.uniqueKey}
          type='info'
          effect='solid'
          place='right'
          disable={this.state.isAuthorView}
        >
          <h4>{props.authorComponent.type._idyll.name} Component</h4>
          <p>Click for more info</p>
        </ReactTooltip>
        {this.handleFormatComponent(props.authorComponent)}
      </div>
    );
  }
}

module.exports = AuthorTool;