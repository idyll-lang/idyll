

export default () => `
body {
  margin: 0;
}

.idyll-root {
  box-sizing: border-box;
  padding: 60px 0;
  margin-bottom: 60px;
}

.article-header {
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
.aside {
  position: absolute;
  width: 200px;
  right: -225px;
}

.idyll-scroll-graphic {
  position: -webkit-sticky;
  position: sticky;
}

.idyll-scroll-graphic img {
  max-height: 100vh;
}

.idyll-scroll-graphic > * {
  display: block;
}

@media all and (max-width: 1000px) {

  .idyll-root {
    max-width: 600px;
    margin: 0 auto;
    padding: 60px 20px;
    margin-bottom: 60px;
    width: 100%;
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

`
