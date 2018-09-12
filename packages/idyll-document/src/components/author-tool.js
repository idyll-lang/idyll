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
        <tr key={JSON.stringify(prop)} className="props-table-row">
          <td>{prop.name}</td>
          <td className="props-table-type">{prop.type}</td>
          <td>{prop.example}</td>
          <td>{currentPropValue}</td>
        </tr>
      )
    });
    const {isAuthorView, debugHeight} = this.state;
    const currentDebugHeight = isAuthorView ? debugHeight : 0;
    return (
      <div className="debug-collapse" 
        style={{
          height: currentDebugHeight + 'px',
        }}
      >
        <div className="author-component-view" ref="inner"> 
          <table className="props-table">
            <tbody>
              <tr className="props-table-row">
                <th>Prop</th>
                <th>Type</th>
                <th>Example</th>
                <th>Current Value</th>
              </tr>
              {showProps}
            </tbody>
          </table>
          <div className="icon-links">
            <span style={{fontFamily: 'courier', fontSize: '12px'}}>docs</span>
            <a className="icon-link" href={componentDocsLink}>
              <img className="icon-link-image"
                src="https://raw.githubusercontent.com/google/material-design-icons/master/action/svg/design/ic_description_24px.svg?sanitize=true"
              />
            </a>
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
    const addBorder = this.state.isAuthorView ? {
      boxShadow: '5px 5px 5px 6px lightGray',
      transition: 'box-shadow 0.4s linear',
      padding: '10px',
      margin: '-10px -10px 20px'} : null;
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
          <div className="tooltip-header">{props.authorComponent.type._idyll.name} Component</div>
          <div className="tooltip-subtitle">Click for more info</div>
        </ReactTooltip>
        {this.handleFormatComponent(props.authorComponent)}
      </div>
    );
  }
}

module.exports = AuthorTool;