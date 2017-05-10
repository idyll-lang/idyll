React = require 'react'
ReactDOM = require 'react-dom'
d3 = require 'd3'

module.exports = React.createClass

  getDefaultProps: ->
    return {
      width: 100
      height: 16
      xAxis: false
      fillColor: 'black'
      data: [7,1,5,5,4,3,5,2,3,5,6] # Some semi-random data.
      tooltip: false
      tipOffset: [0,0]
      tipTemplate: (d, i) -> "Value: #{d}, index: #{i}"
    }

  componentDidMount: ->
    @renderBarChart()

  componentWillUnmount: ->
    if @tooltip?
      @tooltip.remove()

  render: ->
    <svg />

  renderBarChart: ->
    self = @
    unless @props.hoverColor?
      @props.hoverColor = @props.fillColor

    values = @props.data.slice()

    y = d3.scale.linear()
      .range([@props.height, 0])
    y.domain([0, Math.max.apply(null, values)])

    if @props.xAxis
      height = @props.height + 1
    else
      height = @props.height

    chart = d3.select(ReactDOM.findDOMNode(@))
        .attr("width", @props.width)
        .attr("height", height)

    barWidth = @props.width / values.length

    bar = chart.selectAll("g")
        .data(values)
      .enter().append("g")
        .attr("transform", (d, i) -> return "translate(" + i * barWidth + ",0)")

    if self.props.tooltip
      @tooltip = tooltip = d3.select("body").append("div")
                    .attr("class", "barchart-tooltip")
                    .style("opacity", 1e-6)
                    .style("position", "absolute")

    bar.append("rect")
        .attr("y", (d) -> return y(d))
        .attr("height", (d) => return @props.height - y(d))
        .attr("width", barWidth - 1)
        .attr("fill", @props.fillColor)
        .on("mouseover", (d, i) ->
          d3.select(@).attr("fill", self.props.hoverColor)

          if self.props.tooltip
            # Calculate position of the bar on the screen.
            point = chart[0][0].createSVGPoint()
            matrix = @getScreenCTM()
            box = @getBBox()

            point.x = box.x
            point.y = box.y
            coords =  point.matrixTransform(matrix)

            # Set HTML
            tooltip.html self.props.tipTemplate(d, i, values)

            # Measure height/width of tooltip.
            tipWidth = tooltip[0][0].offsetWidth
            tipHeight = tooltip[0][0].offsetHeight
            if tooltip[0][0].style.opacity < 0.5
              fadingIn = true

            # Account for window scroll.
            scrollTop  = document.documentElement.scrollTop || document.body.scrollTop
            scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

            if fadingIn
              # When fading in, don't transition to new position as that doesn't
              # feel natural.
              tooltip
                .style("visibility", "visible")
                .style("left", coords.x + scrollLeft - tipWidth/2 + barWidth/2 - self.props.tipOffset[0]  + "px")
                .style("top", coords.y + scrollTop - tipHeight - self.props.tipOffset[1] + "px")
                .transition()
                .duration(100)
                .style("opacity", 1)
            else
              tooltip
                .style("visibility", "visible")
                .transition()
                .duration(100)
                .style("opacity", 1)
                .style("left", coords.x + scrollLeft - tipWidth/2 + barWidth/2 - self.props.tipOffset[0]  + "px")
                .style("top", coords.y + scrollTop - tipHeight - self.props.tipOffset[1] + "px")

        )
        .on("mouseout", (d) ->
          d3.select(@).attr("fill", self.props.fillColor)

          if self.props.tooltip
            tooltip
              .transition()
              .duration(250)
              .style("opacity", 1/1e6)
              .each("end", -> tooltip.style("visibility", "hidden"))
        )
    if @props.onClick
      bar.on "click", (d, i) => @props.onClick(d, i)

    if @props.xAxis
      xAxis = d3.svg.axis()
        .scale(d3.scale.linear().range([@props.width-1, 0]))
        .orient("bottom")

      chart.append("g")
        .attr("class", "x axis")
        .attr("fill", @props.fillColor)
        .attr("transform", "translate(0," + @props.height + ")")
        .call xAxis
