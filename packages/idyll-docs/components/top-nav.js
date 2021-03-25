import Link from 'next/link';
import { useState, useEffect } from 'react';

const TopNav = ({ selected }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });
  const handleClick = e => {
    const header = document.getElementsByTagName('header')[0];
    if (!header.contains(e.target)) {
      setMenuOpen(false);
    }
  };
  return (
    <header className={menuOpen ? 'expanded' : ''}>
      <Link href="/docs">
        <a className="logo-container">
          <img
            src="/static/images/quill.svg"
            alt="idyll-lang"
            className="nav-logo"
          />
          <span className="logo-text">idyll</span>
        </a>
      </Link>

      <div className="link-group">
        <Link href="/docs">
          <a className={`link ${selected === 'docs' ? 'selected' : ''}`}>
            Docs
          </a>
        </Link>
        <Link href="/tutorials">
          <a className={`link ${selected === 'tutorials' ? 'selected' : ''}`}>
            Tutorials
          </a>
        </Link>
        <Link href="/gallery">
          <a className={`link ${selected === 'gallery' ? 'selected' : ''}`}>
            Gallery
          </a>
        </Link>
        <Link href="/editor">
          <a className={`link ${selected === 'editor' ? 'selected' : ''}`}>
            Editor
          </a>
        </Link>
      </div>
      <img
        className="header-menu"
        src="/static/images/burgermenu.svg"
        alt="menu"
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <style>
        {`
          header {
            width: 100%;
            height: 70px;
            position: fixed;
            top: 0;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: #eae7d6;
            // border-bottom: solid 1px #999;
            z-index: 2;
          }
          .header-menu {
            display: none;
            position: absolute;
            right: 10px;
            top: 10px;
            height: 30px;
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
          .link-group a {
            font-family: 'Fira Mono';
            font-size: 18px;
            // width: 100%;
            margin-right: 20px;
            margin-left: 20px;
            color: black;
            text-decoration: none;
          }

          .link-group a.selected {
            // color: rgb(97, 34, 251);
            border-bottom: solid 2px black;
          }

          @media (max-width: 760px) {
            header {
              height: 50px;
              overflow: hidden;
              flex-direction: column;
            }
            header img {
              height: 30px;
            }
            .header-menu {
              display: block;
            }
            .link-group {
              flex-direction: column;
              align-items: flex-start;
            }
            .expanded {
              height: auto;
            }
            .link {
              margin-top: 15px;
              margin-bottom: 10px;
            }

            .logo-container {
              font-size: 24px;
              margin: 0;
              width: 50px;
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
  );
};

export default TopNav;
