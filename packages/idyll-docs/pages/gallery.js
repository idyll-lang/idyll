import Link from 'next/link'
import Layout from '../components/basic-layout'
import ExampleGroup from '../components/example-group'
import exampleGroups from '../gallery/contents';

const Examples = () => (
  <section>
    <h1>Example Gallery</h1>

    <p><b>Browse by category</b></p>
    <ul>
      {
        exampleGroups.map(({title}) => {
          return <li key={title}><a href={`#${title.split(' ').join('-')}`}>{title}</a></li>
        })
      }
    </ul>
    <p>
      <b>...or scroll down to see them all.</b> If you've made something with Idyll and would like to post it here,
      please <a href="https://github.com/idyll-lang/idyll/issues" target="_blank">open an issue on GitHub</a> with the title "Gallery Example".
    </p>
    {
      exampleGroups.map(eg => <ExampleGroup { ...eg } key={ eg.title } />)
    }
  </section>
)


export default ({ url }) => (
  <Layout url={ url } selected="gallery" >
    <Examples />
  </Layout>
)
