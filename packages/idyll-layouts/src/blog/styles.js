

export default ({ maxWidth }) => `

body {
  margin: 0;
}

.idyll-root {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 60px 0;
  margin-bottom: 60px;
}

.section {
  padding: 0 10px;
  margin: 0 auto;
}

.article-header {
  width: 600px;
  max-width: 90vw;
  margin-bottom: 45px;
}

.inset {
  max-width: 400px;
  margin: 0 auto;
}

input {
  cursor: pointer;
}

.relative {
  position: relative;
}
.aside-container {
  position: relative;
}
.aside {
  position: absolute;
  width: 300px;
  right: calc((10vw + 600px + 150px) / -2);
}

.fixed {
  position: fixed;
  display: flex;
  align-self: center;
  flex-direction: column;
  align-items: center;
  right: 25px;
  top: 0;
  bottom: 0;
  width: calc((80vw - 600px) - 50px);
  justify-content: center;
}

.fixed div {
  width: 100%;
}

.idyll-scroll-graphic {
  position: -webkit-sticky;
  position: sticky;
}

.idyll-scroll-graphic img {
  max-height: 100vh;
}

.author-tool {
  position: relative;
}

.author-tool-view {
  position: relative;
  border: 1px solid #A4A2A2;
  border-radius: 15px;
}

.author-view-button {
  position: absolute;
  top: 0;
  right: 0;
  opacity: .2;
  background-color: #E7E3D0;
  background-image: url('https://idyll-lang.org/static/images/quill-icon.png');
  background-repeat: no-repeat;
  background-size: contain;
  width: 35px;
  height: 35px;
  margin-right: 10px;
}

.author-tool:hover > .author-view-button {
  opacity: 1;
  transition: opacity 600ms linear;
}

.author-tool-view:hover > .author-view-button {
  opacity: 1;
  transition: opacity 600ms linear;
}

.author-component-view {
  background-color: #E7E3D0;
  -webkit-transition: all .25s ease-in;
  transition: all .25s ease-in;
}

.author-component-hide-view {
  opacity:0;
  clear: both;
  height: 0;
  padding: 0 8px;
  overflow: hidden;
}

.props-table {
  width: 100%;
  display: table;
}

@media all and (max-width: 1600px) {
  .fixed {
    width: calc((85vw - 600px) - 50px);
  }
}

@media all and (max-width: 1000px) {
  /* put your css styles in here */
  .desktop {
    display: none;
  }
  .relative {
    position: static;
  }
  .aside {
    position: static;
    width: 100%;
    right: 0;
  }

  .hed {
    width: 100%;
  }

  .idyll-root {
    padding: 15px 0;
  }

  .idyll-root {
    width: 90vw;
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: 80vh;
  }
  .fixed {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    top: initial;
    background: white;
    padding: 20px 0;
    border-top: solid 2px black;
  }
}
`
