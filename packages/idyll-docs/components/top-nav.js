import Link from 'next/link'

export default ({ selected }) => (
  <header>
    <Link href="/">
      <a className="logo-container">
        <img src="/static/images/quill.svg" alt="idyll-lang" className="nav-logo" />
        <span className="logo-text">idyll</span>
      </a>
    </Link>

    <div className="link-group">
      <Link href="/docs"><a className={`link ${selected === 'docs' ? 'selected' : ''}`}>Docs</a></Link>
      <Link href="/gallery"><a className={`link ${selected === 'gallery' ? 'selected' : ''}`}>Gallery</a></Link>
      <Link href="/editor"><a className={`link ${selected === 'editor' ? 'selected' : ''}`}>Editor</a></Link>
    </div>
    <style jsx>{`
      header {
        width: 100%;
        height: 70px;
        position: fixed;
        top: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background: #EAE7D6;
        // border-bottom: solid 1px #999;
        z-index: 1;
      }

      header img {
        height: calc(100% - 20px);
        padding-right: 10px;
        padding-left: 20px;
      }
      .logo-text {
        font-weight: bold;
      }

      .logo-container {
        // color: black;
        font-family: 'Fira Mono';
        font-size: 36px;
        text-decoration: none;
      }

      .link-group {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .nav-logo {
        // width: 100%;
        // max-width: 250px;
        position: relative;
        top: 10px;
        // right: 30px;

      }
      a {
        font-family: 'Fira Mono';
        font-size: 18px;
        // width: 100%;
        margin-right: 20px;
        margin-left: 20px;
        text-decoration: none;
      }

      a.selected {
        // color: rgb(97, 34, 251);
        border-bottom: solid 2px black;
      }


      @media (max-width: 760px) {
        header {
          height: 50px
        }

        .logo-container {
          font-size: 24px;
          margin: 0;
        }
        .nav-logo {
          // top: 1px;
        }
        .logo-text {
          display: none;
        }
      }

    `}
    </style>
  </header>
)
