import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../components/layout'


const Content = () => markdown`
# Gitter
`


export default ({ url }) => (
  <Layout url={ url }>
    <Content />
  </Layout>
)
