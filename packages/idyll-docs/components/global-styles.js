
export default () => <style jsx global>{`
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,600i,700,700i');

html, body {
  margin: 0;
  padding: 0;
}

html {
  opacity: 0;
  transition: opacity 0.25s ease-in;
}
html.loaded {
  opacity: 1;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  // color: rgb(80, 80, 80);
  color: black;
}

a, a:visited {
  color: black;
}

a:hover, a:visited:hover {
  color: #6122FB;
}




figure {
  margin: 0;
}

._markdown_ img,
figure img {
  max-width: 75%;
  margin: 60px auto;
  display: block;
}

code {
  padding: 0;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin: 0;
  // font-size: 85%;
  background-color: rgba(0,0,0,0.04);
  border-radius: 3px;
}

code:before,
code:after {
  letter-spacing: -0.2em;
  content: "\00a0";
}

pre {
  padding: 15px 10px;
  overflow: auto;
  line-height: 1.45;
  background-color: #f7f7f7;
  // border-radius: 3px;
  word-wrap: normal;
  background: #4C4B63;
  font-family: 'Fira Mono', monospace;
  color: white;
}

pre code {
  display: inline;
  max-width: initial;
  padding: 0;
  margin: 0;
  overflow: initial;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
  font-size: 100%;
  white-space: pre;
}

pre code:before,
pre code:after {
  content: normal;
}

li p {
  display: inline;
}
`}</style>
