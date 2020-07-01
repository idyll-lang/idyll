import GroupItem from './group-item';

export default function GalleryGroup({ title, items }) {
  console.log('ITEMS', items);
  console.log('TITLE', title);
  return (
    <div className="example-group" id={title.split(' ').join('-')}>
      <h3 className="anchor">{title}</h3>
      <div className="examples">
        {items.map(ex => (
          <GroupItem
            href={ex.href}
            label={ex.label}
            subtitle={ex.subtitle}
            image={ex.image}
            sourceUrl={ex.sourceUrl}
            key={ex.href}
          />
        ))}
      </div>

      <style jsx>{`
        .example-group {
          margin-top: 60px;
        }
        .examples {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 6px;
          margin-bottom: 3em;
        }
        .anchor {
          padding-top: 100px;
          margin-top: -100px;
        }

        @media all and (max-width: 960px) {
          .examples {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media all and (max-width: 600px) {
          .examples {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
