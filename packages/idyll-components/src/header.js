import React from 'react';

class Header extends React.PureComponent {
  render() {
    return (
      <div className={'article-header'}>
        <h1 className={'hed'}>
          {this.props.title}
        </h1>
        {
          this.props.subtitle && (
            <h2 className={'dek'}>
              {this.props.subtitle}
            </h2>
          )
        }
        {
          this.props.author && (
            <div className={'byline'}>
              By: <a href={this.props.authorLink}>{this.props.author}</a>
            </div>
          )
        }
        {
          this.props.authors ? (
            <div className={'byline'}>
              By: {
                this.props.authors.map((author, i) => {
                  if (typeof author === 'string') {
                    return author;
                  }
                  return author.link ? (
                    <span key={author.name}>
                      <a href={author.link} >{author.name}</a>{
                        i < this.props.authors.length -1 ? (
                          i === this.props.authors.length - 2 ? ' and ' :  ', ' )
                        : ''}
                    </span>
                  ) : author.name;
                })
              }
              {}
            </div>
          ) : null
        }
        {
          this.props.date && (
          <div className={'idyll-pub-date'}>
            {this.props.date}
          </div>
          )
        }

      </div>
    );
  }
}

Header._idyll = {
  name: "Header",
  tagType: "closed",
  props: [{
    name: "title",
    type: "string",
    example: '"Article Title"'
  }, {
    name: 'subtitle',
    type: 'string',
    example: '"Article subtitle."'
  }, {
    name: 'author',
    type: 'string',
    example: '"Author Name"'
  }, {
    name: 'authorLink',
    type: 'string',
    example: '"author.website"'
  }]
}

export default Header;
