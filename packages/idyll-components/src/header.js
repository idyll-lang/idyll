import React from 'react';

const byLineDefault = { prefix: 'By:', joint: ',', suffix: 'and' };

const additionalTextByIndex = (authors, suffix, joint, index) => {
  const map = { [authors.length - 1]: '', [authors.length - 2]: ` ${suffix} ` };

  return index in map ? map[index] : `${joint} `;
};

const AuthorLink = ({ name, link }) => <a href={link}>{name}</a>;

const ByLineMultipleAuthors = ({ authors, prefix, joint, suffix }) => (
  <div className={'byline'}>
    {`${prefix} `}
    {authors.map((author, i) => {
      const authorDisplay = typeof author === 'string' ? author : author.name;

      return (
        <span key={authorDisplay}>
          {typeof author.link === 'string' ? (
            <AuthorLink {...author} />
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
    const { background, color, byLineTemplate } = this.props;
    const { joint, prefix, suffix } = { ...byLineDefault, ...byLineTemplate };

    return (
      <div className={'article-header'} style={{ background, color }}>
        <h1 className={'hed'}>{this.props.title}</h1>
        {this.props.subtitle && (
          <h2 className={'dek'}>{this.props.subtitle}</h2>
        )}
        {this.props.author && (
          <div className={'byline'}>
            {`${prefix.trim()} `}
            <a href={this.props.authorLink}>{this.props.author}</a>
          </div>
        )}
        {!!this.props.authors && (
          <ByLineMultipleAuthors
            authors={this.props.authors}
            prefix={prefix.trim()}
            joint={joint.trim()}
            suffix={suffix.trim()}
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
      type: 'string',
      example: '"Author Name"'
    },
    {
      name: 'authorLink',
      type: 'string',
      example: '"author.website"'
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
      example: '"blue"',
      defaultValue: '"#222"',
      description: 'The background of the header. Can pass a color or a url().'
    },
    {
      name: 'byLineTemplate',
      type: 'object',
      example: "{ prefix: 'Made by', joint: ' ', suffix: '&' }",
      description: 'Optional template to use in by line.'
    },
    {
      name: 'color',
      type: 'string',
      example: '"#000"',
      defaultValue: '"#fff"',
      description: 'The text color of the header.'
    }
  ]
};

export default Header;
