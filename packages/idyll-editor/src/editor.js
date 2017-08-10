const React = require('react');
import {Editor, EditorState, ContentState } from 'draft-js';

class EditorComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(ContentState.createFromText(props.initialValue))
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(editorState) {
    this.setState({ editorState });
    this.props.onChange(editorState.getCurrentContent().getPlainText());
  }

  parseVal(val) {
    return val;
  }

  render() {
    const { handleChange } = this;
    const { editorState } = this.state;
    return (
      <div className={"editor"} >
        <Editor editorState={editorState} onChange={handleChange} />
      </div>
    );
  }
}

module.exports = EditorComponent;