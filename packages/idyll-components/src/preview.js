import React from 'react';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    this.setState({
      mounted: true
    });
  }
  render() {
    const {
      hasError,
      idyll,
      updateProps,
      title,
      description,
      cardSize,
      url,
      media,
      ...props
    } = this.props;

    if (!this.state.mounted) {
      return (
        <a href={url}>
          {title} - {description}
        </a>
      );
    }

    const ReactTinyLink = require('react-tiny-link').ReactTinyLink;
    if (this.props.media) {
      return (
        <ReactTinyLink
          header={title}
          description={description}
          cardSize={cardSize}
          showGraphic={true}
          url={url}
          defaultMedia={media}
        />
      );
    }
    return (
      <ReactTinyLink
        header={title}
        description={description}
        showGraphic={false}
        url={url}
      />
    );
  }
}

Preview._idyll = {
  name: 'Preview',
  tagType: 'closed',
  props: [
    {
      name: 'title',
      type: 'string',
      example: '"This is the preview title"',
      description: 'The title text to display on the card'
    },
    {
      name: 'description',
      type: 'string',
      example: '"This is the preview description"',
      description: 'The description text to display on the card'
    },
    {
      name: 'cardSize',
      type: 'string',
      example: '"small"',
      description: 'Designate size of the preview card, can be small or large'
    },
    {
      name: 'url',
      type: 'string',
      example: '"https://idyll-lang.org/"',
      description: 'The URL to open when the link is clicked'
    },
    {
      name: 'media',
      type: 'string',
      example: '"https://placebear.com/600/320"',
      description: 'The media url or directory of the image or gif'
    }
  ]
};

export default Preview;
