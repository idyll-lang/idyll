import React from 'react';

const byLineDefault = { prefix: 'By:', joint: ',', suffix: 'and' };

const additionalTextByIndex = (authors, suffix, joint, index) => {
  const map = { [authors.length - 1]: '', [authors.length - 2]: ` ${suffix} ` };

  return index in map ? map[index] : `${joint} `;
};

const AuthorLink = ({ name, link, color }) => (
  <a target="_blank" href={link} style={{ color: color }}>
    {name}
  </a>
);

const ByLineMultipleAuthors = ({ authors, prefix, joint, suffix, color }) => (
  <div className={'byline'}>
    {`${prefix} `}
    {authors.map((author, i) => {
      const authorDisplay = typeof author === 'string' ? author : author.name;

      return (
        <span key={authorDisplay}>
          {typeof author.link === 'string' ? (
            <AuthorLink {...author} color={color} />
          ) : (
            authorDisplay
          )}
          {additionalTextByIndex(authors, suffix, joint, i)}
        </span>
      );
    })}
  </div>
);

class Header extends React.PureComponent {
  render() {
    const { background, color, byLineTemplate, idyll } = this.props;
    const { joint, prefix, suffix } = { ...byLineDefault, ...byLineTemplate };

    const _background =
      background ||
      (idyll && idyll.theme ? idyll.theme.headerBackground : undefined);

    const _color =
      color || (idyll && idyll.theme ? idyll.theme.headerColor : undefined);

    return (
      <div
        className={'article-header'}
        style={{
          background: _background,
          color: _color,
          ...this.props.style
        }}
      >
        <h1 className={'hed'}>{this.props.title}</h1>
        {this.props.subtitle && (
          <h2 className={'dek'}>{this.props.subtitle}</h2>
        )}
        {this.props.author && (
          <div className={'byline'}>
            {`${prefix.trim()} `}
            <a
              target="_blank"
              href={this.props.authorLink}
              style={{ color: _color }}
            >
              {this.props.author}
            </a>
          </div>
        )}
        {!!this.props.authors && (
          <ByLineMultipleAuthors
            authors={this.props.authors}
            prefix={prefix.trim()}
            joint={joint.trim()}
            suffix={suffix.trim()}
            color={_color}
          />
        )}
        {this.props.date && (
          <div className={'idyll-pub-date'}>{this.props.date}</div>
        )}
      </div>
    );
  }
}

Header._idyll = {
  name: 'Header',
  tagType: 'closed',
  props: [
    {
      name: 'title',
      type: 'string',
      example: '"Article Title"'
    },
    {
      name: 'subtitle',
      type: 'string',
      example: '"Article subtitle."'
    },
    {
      name: 'author',
      type: 'string'
    },
    {
      name: 'authorLink',
      type: 'string'
    },
    {
      name: 'authors',
      type: 'array',
      example: "`[{name: 'Jane Doe', link: 'https://website.com'}]`",
      description:
        'An array of authors. Each element of the array can be an object or a string.'
    },
    {
      name: 'date',
      type: 'string',
      example: '"December 25, 2018"',
      description: 'The publication date.'
    },
    {
      name: 'background',
      type: 'string',
      example: '"#999"',
      description: 'The background of the header. Can pass a color or a url().'
    },
    {
      name: 'byLineTemplate',
      type: 'object',
      example: "`{ prefix: 'Made by', joint: ' ', suffix: '&' }`",
      description: 'Optional template to use in by line.'
    },
    {
      name: 'color',
      type: 'string',
      example: '"#000"',
      description: 'The text color of the header.'
    }
  ]
};

export default Header;
