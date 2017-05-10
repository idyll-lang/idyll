React = require('react')
Table = require 'react-simple-table'
faker = require 'faker'
MicroBarChart = require '../src/index'

columns = ['apple', 'peach', {
  displayName: 'activity'
  function: (data) -> <MicroBarChart xAxis data={data.data} />
}]

data = for i in [0..5]
  {
    apple: faker.lorem.words(1)
    peach: faker.lorem.words(1)
    data: for i in [0..7]
      faker.helpers.randomNumber(200)
  }

module.exports = React.createClass
  render: ->
    <div style={width:'500px', margin:'0 auto'}>
      <h1>React-Micro-Bar-Chart</h1>
      <a href="https://github.com/KyleAMathews/react-micro-bar-chart">Code on Github</a>
      <br />
      <br />

      <h2>Default look</h2>
      <pre><code>
      {"""
      <MicroBarChart />
        """}
      </code></pre>
      <MicroBarChart />
      <br />
      <br />
      <br />

      <h2>Add a hover color</h2>
      <pre><code>
      {"""
      <MicroBarChart
        width=200
        height=50
        hoverColor="rgb(161,130,214)"
        fillColor="rgb(210,193,237)" />
        """}
      </code></pre>
      <MicroBarChart
        width=200
        height=50
        hoverColor="rgb(161,130,214)"
        fillColor="rgb(210,193,237)" />
      <br />
      <br />
      <br />

      <h2>Add a tooltip with template</h2>
      <pre><code>
      {"""
      <MicroBarChart
        width=200
        height=50
        tooltip
        tipOffset={[0,20]}
        tipTemplate={(d, i, data) -> "value of \#{d} at index \#{i}, with \#{data.length} data points"}
        hoverColor="rgb(161,130,214)"
        fillColor="rgb(210,193,237)" />
        """}
      </code></pre>
      <br />
      <br />
      <br />
      <MicroBarChart
        width=200
        height=50
        tooltip
        tipOffset={[0,20]}
        tipTemplate={(d, i, data) -> "value of #{d} at index #{i}, with #{data.length} data points"}
        hoverColor="rgb(161,130,214)"
        fillColor="rgb(210,193,237)" />
      <br />
      <br />
      <br />

      <h2>Override all options</h2>
      <pre><code>
      {"""
      <MicroBarChart
        width=200
        height=50
        xAxis
        hoverColor="pink"
        fillColor="steelblue" />
        """}
      </code></pre>
      <MicroBarChart
        width=200
        height=50
        xAxis
        hoverColor="pink"
        fillColor="steelblue" />
      <br />
      <br />
      <br />

      <h2>Use in table</h2>
      <Table columns={columns} data={data} />
      <br />
      <br />
      <br />
      <br />

    </div>
