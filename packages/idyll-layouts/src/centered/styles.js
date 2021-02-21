export default () => `
body {
  margin: 0;
}

.idyll-root {
  box-sizing: border-box;
  padding: 60px 0;
  margin-bottom: 60px;
}

.idyll-text-container {
  max-width: 600px;
  margin: 0 auto;
}
.article-header {
  margin-bottom: 45px;
  text-align: center;
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
  right: calc((10vw + 350px + 150px) / -2);
}

.idyll-scroll-graphic {
  position: -webkit-sticky;
  position: sticky;
  overflow: hidden;
}

.idyll-scroll-graphic img {
  max-height: 100vh;
}

.idyll-scroll-graphic > * {
  display: block;
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

@media all and (max-width: 1000px) {

  .idyll-root {
    margin: 0 auto;
    padding: 60px 20px;
    margin-bottom: 60px;
    width: 100%;
  }
  .idyll-text-container {
    max-width: calc(100% - 2em);
    margin: 0 1em;
  }
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

}

`;
