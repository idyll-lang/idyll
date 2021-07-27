export default () => `
* {
  box-sizing: border-box;
}

html {
  margin: 0;
  padding: 0;
}

img {
  display: block;
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
}

h1,h2,h3,h4,h5,h6{
  margin: 40px 0 20px 0;
  font-weight: bold;
}


body {
  color: black;
}

p, .article-body {
  font-size: 1.15rem;
  line-height: 1.75rem;
}

.byline a {
  color: black;
}

.ReactTable{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;border:1px solid rgba(0,0,0,0.1);}.ReactTable *{box-sizing:border-box}.ReactTable .rt-table{-webkit-box-flex:1;-ms-flex:1;flex:1;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;width:100%;border-collapse:collapse;overflow:auto}.ReactTable .rt-thead{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.ReactTable .rt-thead.-headerGroups{background:rgba(0,0,0,0.03);border-bottom:1px solid rgba(0,0,0,0.05)}.ReactTable .rt-thead.-filters{border-bottom:1px solid rgba(0,0,0,0.05);}.ReactTable .rt-thead.-filters .rt-th{border-right:1px solid rgba(0,0,0,0.02)}.ReactTable .rt-thead.-header{box-shadow:0 2px 15px 0 rgba(0,0,0,0.15)}.ReactTable .rt-thead .rt-tr{text-align:center}.ReactTable .rt-thead .rt-th,.ReactTable .rt-thead .rt-td{padding:5px 5px;line-height:normal;position:relative;border-right:1px solid rgba(0,0,0,0.05);-webkit-transition:box-shadow .3s cubic-bezier(.175,.885,.32,1.275);transition:box-shadow .3s cubic-bezier(.175,.885,.32,1.275);box-shadow:inset 0 0 0 0 transparent;}.ReactTable .rt-thead .rt-th.-sort-asc,.ReactTable .rt-thead .rt-td.-sort-asc{box-shadow:inset 0 3px 0 0 rgba(0,0,0,0.6)}.ReactTable .rt-thead .rt-th.-sort-desc,.ReactTable .rt-thead .rt-td.-sort-desc{box-shadow:inset 0 -3px 0 0 rgba(0,0,0,0.6)}.ReactTable .rt-thead .rt-th.-cursor-pointer,.ReactTable .rt-thead .rt-td.-cursor-pointer{cursor:pointer}.ReactTable .rt-thead .rt-th:last-child,.ReactTable .rt-thead .rt-td:last-child{border-right:0}.ReactTable .rt-thead .rt-resizable-header{overflow:visible;}.ReactTable .rt-thead .rt-resizable-header:last-child{overflow:hidden}.ReactTable .rt-thead .rt-resizable-header-content{overflow:hidden;text-overflow:ellipsis}.ReactTable .rt-thead .rt-header-pivot{border-right-color:#f7f7f7}.ReactTable .rt-thead .rt-header-pivot:after,.ReactTable .rt-thead .rt-header-pivot:before{left:100%;top:50%;border:solid transparent;content:" ";height:0;width:0;position:absolute;pointer-events:none}.ReactTable .rt-thead .rt-header-pivot:after{border-color:rgba(255,255,255,0);border-left-color:#fff;border-width:8px;margin-top:-8px}.ReactTable .rt-thead .rt-header-pivot:before{border-color:rgba(102,102,102,0);border-left-color:#f7f7f7;border-width:10px;margin-top:-10px}.ReactTable .rt-tbody{-webkit-box-flex:99999;-ms-flex:99999 1 auto;flex:99999 1 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;overflow:auto;}.ReactTable .rt-tbody .rt-tr-group{border-bottom:solid 1px rgba(0,0,0,0.05);}.ReactTable .rt-tbody .rt-tr-group:last-child{border-bottom:0}.ReactTable .rt-tbody .rt-td{border-right:1px solid rgba(0,0,0,0.02);}.ReactTable .rt-tbody .rt-td:last-child{border-right:0}.ReactTable .rt-tbody .rt-expandable{cursor:pointer}.ReactTable .rt-tr-group{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.ReactTable .rt-tr{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.ReactTable .rt-th,.ReactTable .rt-td{-webkit-box-flex:1;-ms-flex:1 0 0px;flex:1 0 0;white-space:nowrap;text-overflow:ellipsis;padding:7px 5px;overflow:hidden;-webkit-transition:.3s ease;transition:.3s ease;-webkit-transition-property:width,min-width,padding,opacity;transition-property:width,min-width,padding,opacity;}.ReactTable .rt-th.-hidden,.ReactTable .rt-td.-hidden{width:0 !important;min-width:0 !important;padding:0 !important;border:0 !important;opacity:0 !important}.ReactTable .rt-expander{display:inline-block;position:relative;margin:0;color:transparent;margin:0 10px;}.ReactTable .rt-expander:after{content:'';position:absolute;width:0;height:0;top:50%;left:50%;-webkit-transform:translate(-50%,-50%) rotate(-90deg);transform:translate(-50%,-50%) rotate(-90deg);border-left:5.04px solid transparent;border-right:5.04px solid transparent;border-top:7px solid rgba(0,0,0,0.8);-webkit-transition:all .3s cubic-bezier(.175,.885,.32,1.275);transition:all .3s cubic-bezier(.175,.885,.32,1.275);cursor:pointer}.ReactTable .rt-expander.-open:after{-webkit-transform:translate(-50%,-50%) rotate(0);transform:translate(-50%,-50%) rotate(0)}.ReactTable .rt-resizer{display:inline-block;position:absolute;width:36px;top:0;bottom:0;right:-18px;cursor:col-resize;z-index:10}.ReactTable .rt-tfoot{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;box-shadow:0 0 15px 0 rgba(0,0,0,0.15);}.ReactTable .rt-tfoot .rt-td{border-right:1px solid rgba(0,0,0,0.05);}.ReactTable .rt-tfoot .rt-td:last-child{border-right:0}.ReactTable.-striped .rt-tr.-odd{background:rgba(0,0,0,0.03)}.ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover{background:rgba(0,0,0,0.05)}.ReactTable .-pagination{z-index:1;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:3px;box-shadow:0 0 15px 0 rgba(0,0,0,0.1);border-top:2px solid rgba(0,0,0,0.1);}.ReactTable .-pagination .-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;display:block;width:100%;height:100%;border:0;border-radius:3px;padding:6px;font-size:1em;color:rgba(0,0,0,0.6);background:rgba(0,0,0,0.1);-webkit-transition:all .1s ease;transition:all .1s ease;cursor:pointer;outline:none;}.ReactTable .-pagination .-btn[disabled]{opacity:.5;cursor:default}.ReactTable .-pagination .-btn:not([disabled]):hover{background:rgba(0,0,0,0.3);color:#fff}.ReactTable .-pagination .-previous,.ReactTable .-pagination .-next{-webkit-box-flex:1;-ms-flex:1;flex:1;text-align:center}.ReactTable .-pagination .-center{-webkit-box-flex:1.5;-ms-flex:1.5;flex:1.5;text-align:center;margin-bottom:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-ms-flex-pack:distribute;justify-content:space-around}.ReactTable .-pagination .-pageInfo{display:inline-block;margin:3px 10px;white-space:nowrap}.ReactTable .-pagination .-pageJump{display:inline-block;}.ReactTable .-pagination .-pageJump input{width:70px;text-align:center}.ReactTable .-pagination .-pageSizeOptions{margin:3px 10px}.ReactTable .rt-noData{display:block;position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background:rgba(255,255,255,0.8);-webkit-transition:all .3s ease;transition:all .3s ease;z-index:1;pointer-events:none;padding:20px;color:rgba(0,0,0,0.5)}.ReactTable .-loading{display:block;position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(255,255,255,0.8);-webkit-transition:all .3s ease;transition:all .3s ease;z-index:-1;opacity:0;pointer-events:none;}.ReactTable .-loading > div{position:absolute;display:block;text-align:center;width:100%;top:50%;left:0;font-size:15px;color:rgba(0,0,0,0.6);-webkit-transform:translateY(-52%);transform:translateY(-52%);-webkit-transition:all .3s cubic-bezier(.25,.46,.45,.94);transition:all .3s cubic-bezier(.25,.46,.45,.94)}.ReactTable .-loading.-active{opacity:1;z-index:2;pointer-events:all;}.ReactTable .-loading.-active > div{-webkit-transform:translateY(50%);transform:translateY(50%)}.ReactTable input,.ReactTable select{border:1px solid rgba(0,0,0,0.1);background:#fff;padding:5px 7px;font-size:inherit;border-radius:3px;font-weight:normal;outline:none}.ReactTable .rt-resizing .rt-th,.ReactTable .rt-resizing .rt-td{-webkit-transition:none !important;transition:none !important;cursor:col-resize;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}

.ReactTable .-pagination .-btn {
  margin: 0;
}
.hed {
  font-size: 3rem;
  line-height: 3rem;
  margin: 20px 0 20px;
  font-weight: bold;
  width: 150%;
  max-width: 90vw;
}

.dek {
  margin: 0;
  display: block;
  font-size: 1.5rem;
  line-height: 2.2rem;
  color: black;
  margin-top: 1rem;
  max-width: 90vw;
}

.byline {
  font-size: .95rem;
  line-height: 1rem;
  color: black;
  margin-top: 1rem;
}

a, a:visited, a:hover {
  color: black;
  cursor: pointer;
  text-decoration: none;
  /*border-bottom: 1px solid #EAE7D6;*/
  box-shadow: inset 0 -4px 0 #EAE7D6;
  transition: box-shadow 0.25s ease-out;
}

a:hover {
  color: black;
  /*background: #EAE7D6;*/
  box-shadow: inset 0 -20px 0 #EAE7D6;
}

pre {
  margin-top: 25px;
  margin-bottom: 25px;
}

pre code {
  background: #F2F3F2;
  color: black;
  padding: 20px 15px;
  width: 100%;
  display: block;
  overflow-x: auto;
  font-size: 12px;
  text-align: initial;
  font-style: normal;
}
code {
  background: #F2F3F2;
  color: black;
  padding: 1px 5px;
}



span.action {
  border-color: #5601FF;
  border-width: 2px;
  border-style: none none solid none;
  color: #5601FF;
  /*font-size: 0.9em;*/
  padding: -4px 5px;
  margin: 0 5px;
  cursor: pointer;
}

.idyll-dynamic {
  text-decoration: underline;
  text-decoration-style: dotted;
}

.idyll-action {
  text-decoration: underline;
  cursor: pointer;
}

.idyll-document-error {
  color: red;
  font-family: monospace;
}

input[type='text'].idyll-input-error {
  border-color: red;
}

span.idyll-input-error{
  display: block;
  margin: 0 auto;
  padding: 10px 5px;
  color: red;
  width: 100%;
}


.idyll-step-graphic {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
}

.idyll-scroll-graphic {

  text-align: center;
  width: 100%;
}

.idyll-step-graphic img {
  flex-shrink: 0;
  min-width: 100%;
  min-height: 100%
}

.idyll-step-content {
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  color: white;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
}

.idyll-stepper-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}

.idyll-stepper-control-button {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-weight: bold;
  padding: 15px 10px;
  cursor: pointer;
}

.idyll-stepper-control-button-previous {
  position: absolute;
  left: 10px;
}

.idyll-stepper-control-button-next {
  position: absolute;
  right: 10px;
}

.idyll-stepper {
  margin: 60px 0;
}

.idyll-scroll {
  margin-top: 25vh;
}

.idyll-scroll-text {
  padding: 0 0 50vh 0;
}

.idyll-scroll-text .idyll-step {
  margin: 0 0 90vh 0;
  padding: 50px;
  background: white;
}


/* annotated-text container */
.annotated-text {
  position: relative;
  display: inline-block;
  cursor: help;
}

.annotated-text .annotation-text img {
  display: block;
  max-width: 100%;
}

.annotated-text p {
  margin: 0;
}

.annotated-text,
.annotated-text:visited {
  background: #efefef;
  padding: 0 2.5px;
  transition: background 0.25s ease-out;
}

.annotated-text:hover {
  background: #ccc;
}

/* annotated-text CSS */
.annotated-text .annotation-text {
  visibility: hidden;
  border: solid 0.5px #666;
  box-shadow: 0 0 5px #ccc;
  background: #fff;
  text-align: left;
  padding: 5px;
  /* border-radius: 4px; */
  position: absolute;
  z-index: 1;
  font-size: 0.9em;
  line-height: 1.2;
}

.annotated-text .annotation-text {
  width: 250px;
  bottom: 120%;
  left: 50%;
  margin-left: -125px; /* Use half of the width (120/2 = 60), to center the annotated-text */
  opacity: 0;
  font-weight: initial;
}

.annotated-text:hover .annotation-text {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.25s ease-out;
}

@media all and (max-width: 800px) {
  .annotated-text .annotation-text {
    width: 50vh;
  }
}

@media all and (max-width: 600px) {
  .annotated-text .annotation-text {
    width: 50vw;
    position: fixed;
    left: 50%;
    bottom: 20%;
  }
}



`;
