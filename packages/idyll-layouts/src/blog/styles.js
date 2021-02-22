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

.idyll-text-container {
  max-width: 600px;
  margin-top: 0;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 50px;
}

.section {
  padding: 0 10px;
  margin: 0 auto;
}

.article-header {
  text-align: left;
  padding-left: 50px;
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
  display: block;
}
.aside {
  display: block;
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

.component-debug-view {
  position: relative;
  transition: background-color 0.3s ease-in;
}

.author-view-button {
  position: absolute;
  top: 3px;
  right: 0;
  opacity: .38;
  background-color: #E7E3D0;
  background-image: url('https://idyll-lang.org/static/images/quill-icon.png');
  background-repeat: no-repeat;
  background-size: contain;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  box-sizing: border-box;
  border-radius: 12px;
  cursor: pointer;
}

.author-view-button:focus {
  outline: none;
}

.component-debug-view:hover > .author-view-button {
  opacity: 0.87;
  transition: opacity 600ms linear;
}

.author-component-view {
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
}

.author-component-view h2, .author-component-view h3 {
  margin-top: 5px;
  margin-bottom: 5px;
}

.props-table {
  width: 90%;
  min-width: 500px;
  display: table;
  border: 1px solid #A4A2A2;
  border-radius: 20px;
  margin: 0 auto;
}

.props-table-type {
  font-family: 'Courier-New';
}

.props-table-row {
  text-align: center;
}

.debug-collapse {
  overflow: hidden;
  overflow-y: scroll;
  transition: height 0.3s ease-in;
  margin: 0;
  box-sizing: border-box;
}

.icon-links {
  margin-top: 13px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.icon-link {
  color: inherit;
}

.icon-link:hover {
  text-decoration: none;
}

.icon-link-image {
  cursor: pointer;
}

.button-tooltip {
  background-color: black !important;
  padding: 0 5px;
}

.button-tooltip.place-top:after {
  border-top-color: black !important;
}

.button-tooltip.place-right:after {
  border-right-color: black !important;
}

.button-tooltip.place-bottom:after {
  border-bottom-color: black !important;
}

.button-tooltip.place-left:after {
  border-left-color: black !important;
}

.tooltip-header {
  line-height: 1;
  margin: 6px 0;
  font-size: 18px;
}

.tooltip-subtitle {
  font-style: italic;
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
  .idyll-text-container {
    max-width: calc(100% - 2em);
    margin-top: 0;
    margin-right: 1em;
    margin-bottom: 0;
    margin-left: 1em;
  }
  .hed {
    width: 100%;
  }

  .idyll-root {
    padding: 15px 0;
  }

  .idyll-root {
    margin: 0 auto;
    padding-bottom: 80vh;
  }
  .article-header {
    margin: 0 auto;
    padding-left: 1em;
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
`;
