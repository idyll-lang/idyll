const React = require('react');
const ReactDOM = require('react-dom');
const ScrollWatch = require('scrollwatch');

//http://stackoverflow.com/questions/4588119/get-elements-css-selector-when-it-doesnt-have-an-id
function fullPath(el){
  var names = [];
  while (el.parentNode){
    if (el.id){
      names.unshift('#'+el.id);
      break;
    }else{
      if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
      else{
        for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
        names.unshift(el.tagName+":nth-child("+c+")");
      }
      el=el.parentNode;
    }
  }
  return names.join(" > ");
}

class IdyllComponent extends React.Component {
  constructor(props) {
    super(props);

    if (props.onEnteredView) {
      this.componentDidMount = () => {
        const dom = ReactDOM.findDOMNode(this);
        var sw = new ScrollWatch({
          watch: fullPath(dom),
          onElementInView: this.props.onEnteredView,
          watchOnce: false
        });
      }
    }
  }
  updateProps(newProps) {
    this.props.__handleUpdateProps(newProps);
  }
}

module.exports = IdyllComponent;
