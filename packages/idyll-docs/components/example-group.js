import Example from './example'

export default ({ title, examples }) => (
  <div className="example-group">
    <h3>{ title }</h3>
    <div className="examples">
      {
        examples.map(ex => <Example {...ex} key={ ex.href } />)
      }
    </div>

    <style jsx>{`
      .examples {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 6px;
        margin-bottom: 3em;
      }

      @media all and (max-width: 600px) {
        .examples {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </div>
)

