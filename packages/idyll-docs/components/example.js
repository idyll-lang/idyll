
const imageUrl = (url) => /^http/.test(url) ? url : `/static/images/${url}`


export default ({ href, label, image }) => (
  <div className="example">
    <a href={ href } target="_blank">
      <div
        className="example-image"
        style={{ backgroundImage: `url(${imageUrl(image)})` }}
      ></div>
      <div className="example-label">{ label }</div>
    </a>

    <style jsx>{`
      .example {
        border: solid 2px #efefef;
        transition: border 0.25s;
      }

      .example:hover {
        border: solid 2px #6122FB;
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