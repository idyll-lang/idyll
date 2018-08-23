import { Link } from '../routes';

const imageUrl = (url) => /^http/.test(url) ? url : `/static/images/${url}`

function slugify(text)
{
  return text.toString().split(/([A-Z][a-z]+)/).join('-').toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}


export default ({ href, label, subtitle, image, sourceUrl }) => (
  <div className="example">
    <Link route='gallery-item' params={{slug: slugify(label)}}>
      <a>
        <div
          className="example-image"
          style={{ backgroundImage: `url(${imageUrl(image)})` }}
        >
          {
            sourceUrl ? <div>
              <div style={{
                padding: 10,
                background: '#fff',
                width: 125,
                margin: '0 auto',
                textAlign: 'center',
                border: 'solid 1px black',
                color: 'black',
                position: 'relative',
                top: 5
              }}>
                Source Available
              </div>
            </div> : null
          }
        </div>
        <div className="example-label">{ label }
          {
            subtitle ? (
            <div className="subtitle">{subtitle}</div>
            ) : null
          }
        </div>
      </a>
    </Link>

    <style jsx>{`
      .example {
        border: solid 2px #efefef;
        background: #efefef;
        transition: border 0.25s, background 0.25s, color 0.25s;
        cursor: pointer;
      }

      .example:hover {
        border: solid 2px #6122FB;
        background: #6122FB;
      }
      .example:hover .example-label {
        background: #6122FB;
        color: white;
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
)