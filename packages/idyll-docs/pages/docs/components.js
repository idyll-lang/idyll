import React from 'react'
import { Link } from '../../routes';
import showdown from 'showdown'
import Parser from 'html-react-parser';
import Layout from '../../components/layout'

import Contents from '../../idyll-components/contents'
// import * as Descriptions from '../idyll-components/descriptions'
import * as Examples from '../../idyll-components/examples'

showdown.setFlavor('github')


function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const mdConverter = new showdown.Converter()
console.log(Contents)

function md2html(md, naked = false) {
  if (!md) return md
  let html = mdConverter.makeHtml(md)
  if (naked) html = html.replace(/^<p>/, '').replace(/<\/p>$/, '')
  return Parser(html)
}

function md2htmlNaked(md) {
  return md2html(md, true)
}

const titleFromName = name => name.split(/([A-Z][a-z]+)/).join(' ').trim()
const titleHrefFromTitle = title => title.replace(' ', '-')


class BaseSection {
  constructor(obj) {
    this.name = Object.keys(obj)[0]
    this.title = titleFromName(this.name)
  }

  get hrefId() {
    return this.name
  }
}

class IdyllComponentGroup extends BaseSection {
  constructor(obj) {
    super(obj)
    const { description, components } = obj[this.name]
    this.description = description
    this.components = components.map(sub => new IdyllComponentInfo(sub, this))
  }

  renderContents() {
    return (
      <div key={ this.name }>

        <h3>{ this.title }</h3>
        { md2html(this.description) }
        <div style={{display: 'flex', flexWrap: 'wrap', width: 'calc(100vw - 2em - 20% - 175px)'}}>
          { this.components.map(comp => comp.renderContents()) }
        </div>
      </div>
    )
  }
}

class IdyllComponentInfo extends BaseSection {
  constructor(obj, parent) {
    super(obj)
    this.parent = parent
    Object.assign(this, obj[this.name])
    // this.Description = this.description
    //   ? (() => md2html(this.description))
    //   : (Descriptions[this.name] || (() => null))
    this.Description = () => md2html(this.description) || null
    this.exampleCode = Examples[this.name]
  }


  get slug() {
    return slugify(this.title);
  }

  renderContents() {
    return (
      <Link route='component' params={{slug: this.slug}}  >
        <a style={{display: 'block', width: 140, margin: 20}} >
          <img style={{display: 'block' , width: '100%'}} src={`/static/images/components/thumbnails/${this.thumbnail}`} />
          <div style={{textAlign: 'center', margin: '10px 0'}} >{ this.title }</div>
        </a>
      </Link>
    )
  }
}

class IdyllComponentDoc extends React.Component {
  render() {
    const {
      name,
      title,
      hrefId,
      Description,
      image,
      exampleCode,
      idyllProps,
    } = this.props.component

    return (
      <div id={ hrefId } key={ name }>
        <h3>{ title }</h3>
        {/*{ md2html(this.description) }*/}
        <Description />
        { image &&
          <figure>
            <img src={ `static/images/${image}` } alt={ title } />
          </figure>
        }
        { exampleCode &&
          <pre>
            <code>{ exampleCode }</code>
          </pre>
        }
        { idyllProps && idyllProps.length > 0 &&
          <div>
            <h4>Props</h4>
            <div>
              { idyllProps.map(p => this.renderPropBullet(p)) }
            </div>
          </div>
        }
      </div>
    )
  }

  renderPropBullet(prop) {
    const [ name ] = Object.keys(prop)
    const description = prop[name]
    return (
      <li key={ name } className="idyll-prop">
        <code>{ name }</code>
        {' '}&mdash;{' '}
        <span>{ md2html(description) }</span>
      </li>
    )
  }
}

class IdyllComponentSection extends React.Component {
  render() {
    const {
      name,
      title,
      hrefId,
      components,
    } = this.props.group

    return (
      <section id={ hrefId } key={ name }>
        <h2>{ title }</h2>
        { components.map(comp => <IdyllComponentDoc component={ comp } key={ comp.name } />) }
      </section>
    )
  }
}


const groups = Contents.map(groupObj => new IdyllComponentGroup(groupObj))

export default ({ url }) => (
  <Layout url={ url }>
    <h1>Built-In Components</h1>
    <p>
      Idyll ships with a handful of components that handle common tasks. They are broken into three categories:{' '}
      <em>layout</em>, <em>presentation</em>, and <em>helpers</em>.
    </p>
    <div className="page-contents">
      <div>
        { groups.map(g => g.renderContents()) }
      </div>
    </div>

    {/* <p>
      Components are resolved according to following algorithm:
      <ul>
      <li>If there is a custom component with this name, use it.</li>
      <li>If there is a component installed from npm with this name, use it.</li>
      <li>If there is a built-in component with this name, use it.</li>
      <li>If there is a valid HTML tag with this name, use it.</li>
      </ul>
    </p> */}
    <p>
      Continue to{' '}
      <Link href="/docs/components/npm"><a>npm components</a></Link>.
    </p>
  </Layout>
)
