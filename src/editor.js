const React = require('react');
const brace = require('brace');
var CodeMirror = require('react-codemirror');

class Editor extends React.PureComponent {

  render() {
    const { idyllMarkup, onChange } = this.props;
    return (
      <div className={"editor"} >
        <CodeMirror
          value={idyllMarkup}
          onChange={onChange}
          options={{
            mode: 'markdown',
            lineNumbers: true,
            viewportMargin: Number.POSITIVE_INFINITY
          }}
        />
      </div>
    );
  }
}

module.exports = Editor;