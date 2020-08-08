import Link from 'next/link';

const imageUrl = url => (/^http/.test(url) ? url : `/static/images/${url}`);

function slugify(text) {
  return text
    .toString()
    .split(/([A-Z][a-z]+)/)
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export default function GroupItem({ href, label, subtitle, image, sourceUrl }) {
  return (
    <div className="example">
      <div
        className="example-image"
        style={{ backgroundImage: `url(${imageUrl(image)})` }}
      />
      <div className="example-label">
        {label}
        {subtitle ? <div className="subtitle">{subtitle}</div> : null}
      </div>
      <div className="example-links">
        <a href={href} className="example-button">
          Open
        </a>
        {sourceUrl ? (
          <a href={sourceUrl} className="example-button">
            View Source
          </a>
        ) : null}
      </div>

      <style jsx>{`
      .example {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: solid 2px #efefef;
        background: #efefef;
        transition: border 0.25s, background 0.25s, color 0.25s;
      }

      .example-links {
        display: flex;
        flex-direction: row;
        margin-bottom: 1em;
        justify-content: space-around;
        width: 100%;
      }

      .example-button {
        display: block;
        padding: 10px
        background: #fff;
        width: 50%;
        max-width:125px;
        text-align: center;
        border: solid 1px black;
        color: black;
        cursor: pointer;
      }

      .example-button:hover {
        transition: border 0.25s, background 0.25s, color 0.25s;
        color: white;
        background: #6122FB;
      }

      .example a {
        display: block;
        text-decoration: none;
      }

      .example-label {
        color: black;
        text-align: center;
        font-weight: bold;
        background: #efefef;
        padding: 15px;
        transition: background 0.25s, color 0.25s;
        min-height: 85px;
      }
      .example-label .subtitle {
        font-weight: normal;
      }

      .example-image {
        width: 100%;
        height: 275px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    `}</style>
    </div>
  );
}
