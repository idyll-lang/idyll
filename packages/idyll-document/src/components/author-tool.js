import React from 'react';
import ReactTooltip from 'react-tooltip';

class AuthorTool extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorView: false,
      debugHeight: 0,
      componentHeight: 0,
      hasPressedButton: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // For all available props in metaValues, display them
  // If runtimeValues has a value for given prop, display it
  // Returns this in a single table row <tr>
  handleTableValues(metaValues, runtimeValues) {
    return metaValues.props.map(prop => {
      const runtimeValue = runtimeValues.props[prop.name];
      let currentPropValue = null;
      if (runtimeValue !== undefined) {
        if (
          runtimeValue &&
          {}.toString.call(runtimeValue) === '[object Function]'
        ) {
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
      );
    });
  }

  // Returns authoring information for the prop values in table format
  // and includes a link to the docs page at the bottom
  handleFormatComponent(runtimeValues) {
    const metaValues = runtimeValues.type._idyll;
    const componentName = metaValues.name;

    // Docs use lowercase component name for link
    const componentLowerCase =
      componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const componentDocsLink =
      'https://idyll-lang.org/docs/components/default/' + componentLowerCase;

    const showProps = this.handleTableValues(metaValues, runtimeValues);
    const { isAuthorView, debugHeight, componentHeight } = this.state;
    const currentDebugHeight = isAuthorView ? debugHeight : 0;
    const marginToGive = isAuthorView ? 15 : 0;
    // If a component's height is too small, button will overlap with table
    // so add margin to get a minimal height (40px seems fine)
    const marginAboveTable =
      componentHeight < 40 && isAuthorView ? 40 - componentHeight : 0;
    return (
      <div
        className="debug-collapse"
        style={{
          height: currentDebugHeight + 'px',
          marginBottom: marginToGive + 'px',
          marginTop: marginAboveTable + 'px'
        }}
      >
        <div
          className="author-component-view"
          ref={inner => (this.innerHeight = inner)}
        >
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
            <a className="icon-link" href={componentDocsLink}>
              <img
                className="icon-link-image"
                src="https://raw.githubusercontent.com/google/material-design-icons/master/action/svg/design/ic_description_24px.svg?sanitize=true"
              />
            </a>
            <a className="icon-link" href={componentDocsLink}>
              <span
                style={{
                  fontFamily: 'courier',
                  fontSize: '12px',
                  marginTop: '8px'
                }}
              >
                docs
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Flips between whether we are in the author view of a component
  handleClick() {
    this.setState(prevState => ({
      isAuthorView: !prevState.isAuthorView,
      debugHeight: this.innerHeight.getBoundingClientRect().height
    }));
    if (!this.state.hasPressedButton) {
      this.setState({
        componentHeight: this._refContainer.getBoundingClientRect().height,
        hasPressedButton: true
      });
    }
  }

  // Returns an entire author view, including the component itself,
  // a quill icon to indicate whether we're hovering in the component,
  // and debugging information when the icon is pressed
  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    const addBorder = this.state.isAuthorView
      ? {
          boxShadow: '5px 5px 10px 1px lightGray',
          transition: 'box-shadow 0.35s linear',
          padding: '0px 10px 10px',
          margin: '0px -10px 20px'
        }
      : null;
    const putButtonBack = this.state.isAuthorView
      ? {
          right: '10px',
          top: '3px'
        }
      : null;

    return (
      <div
        className="component-debug-view"
        style={addBorder}
        ref={ref => (this._refContainer = ref)}
      >
        {props.component}
        <button
          className="author-view-button"
          style={putButtonBack}
          onClick={this.handleClick}
          data-tip
          data-for={props.uniqueKey}
        />
        <ReactTooltip
          className="button-tooltip"
          id={props.uniqueKey}
          type="info"
          effect="solid"
          place="bottom" // TODO not showing up ?
          disable={this.state.isAuthorView}
        >
          <div className="tooltip-header">
            {props.authorComponent.type._idyll.name} Component
          </div>
          <div className="tooltip-subtitle">Click for more info</div>
        </ReactTooltip>
        {this.handleFormatComponent(props.authorComponent)}
      </div>
    );
  }
}

export default AuthorTool;
