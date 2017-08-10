const React = require('react');
const ReactDOM = require('react-dom');

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

class IdyllComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    if (props.onEnteredView || props.onEnterView || props.onExitView) {
      this.componentDidMount = () => {
        const dom = ReactDOM.findDOMNode(this);
        const ScrollWatch = require('scrollwatch');
        var sw = new ScrollWatch({
          watch: fullPath(dom),
          onElementInView: props.onEnteredView || props.onEnterView || function(){},
          onElementOutOfView: props.onExitView || function(){},
          watchOnce: false
        });
      }
    }
  }
}

module.exports = IdyllComponent;
