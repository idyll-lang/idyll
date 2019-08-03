const React = require('react');

const citations = [];
const referenceInstances = [];

const citationsChangeHandler = {
  set: function(target, property, value) {
    referenceInstances.forEach(referenceInstance => {
      referenceInstance.forceUpdate();
    });
    target[property] = value;
    return true;
  }
};

var citationsProxy = new Proxy(citations, citationsChangeHandler);

class References extends React.Component {
  constructor() {
    super();
    referenceInstances.push(this);
  }
  render() {
    return (
      <div id="references">
        <h1>References</h1>
        <ol>
          {citations.map((citation, index) => (
            <li key={index}>
              <a href={citation.url} target="_blank">
                {citation.title}
              </a>
              , {citation.authors}.
              <em>{citation.venue ? ' ' + citation.venue + '.' : ''}</em>
              {citation.date ? ' ' + citation.date + '.' : ''}
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

class Cite extends React.Component {
  constructor(props) {
    super(props);
    const { authors, url, title, date, venue, id } = this.props;
    const foundCitation = citationsProxy.find(
      citation => citation.id === id && id !== undefined
    );
    if (foundCitation) {
      this.state = {
        citationNumber: citationsProxy.indexOf(foundCitation) + 1,
        ...foundCitation
      };
      if (authors || title) {
        console.warn(
          'Warning: Ignoring authors and title as Cite with the given id was declared before.'
        );
      }
    } else if (authors && title) {
      const newCitation = { authors, url, title, date, venue, id };
      citationsProxy.push(newCitation);
      this.state = { citationNumber: citationsProxy.length, ...newCitation };
    } else {
      console.warn(
        `Warning: Cite with given id not found or invalid id. Check if a Cite with the id "${id}" was declared before this line.`
      );
      this.state = {};
    }
  }
  render() {
    const { citationNumber, authors, title, url } = this.state;
    return (
      <a title={`${title}, ${authors}`} href={url || '#references'}>
        [{citationNumber}]
      </a>
    );
  }
}

Cite._idyll = {
  name: 'Cite',
  tagType: 'closed',
  props: [
    {
      name: 'authors',
      type: 'string'
    },
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'url',
      type: 'string',
      description: 'Link to the citation.'
    },
    {
      name: 'date',
      type: 'string'
    },
    {
      name: 'venue',
      type: 'string'
    },
    {
      name: 'id',
      type: 'string',
      description:
        'Can be used to refer a previously stated citation using the same id.'
    }
  ]
};
export { References };
Cite.References = References;
export default Cite;
