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
              {`${citation.authors}: `}
              <a href={citation.source}>{citation.title}</a>
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
    const { authors, source, title } = this.props;
    citationsProxy.push({ authors, source, title });
    this.state = { citationNumber: citations.length };
  }
  render() {
    const { authors, title } = this.props;
    const { citationNumber } = this.state;
    return (
      <a title={`${authors}: ${title}`} href="#references">
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
      name: 'source',
      type: 'string',
      description: 'Link to the citation.'
    }
  ]
};
export { References };
Cite.References = References;
export default Cite;
