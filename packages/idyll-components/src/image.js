const React = require('react');

class Image extends React.Component {
  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;
    return <img {...props} />;
  }
}

Image._idyll = {
  name: 'Image',
  tagType: 'closed',
  props: [
    {
      name: 'src',
      type: 'string',
      example: `"https://placebear.com/600/320"`
    },
    {
      name: 'style',
      type: 'expression',
      example: `\`{
  width: "100%",
  height: "auto",
  display: "block",
  margin: "1em auto",
  minHeight: 320
}\``
    }
  ]
};

export default Image;
