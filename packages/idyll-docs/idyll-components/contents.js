const components = [
  {
    "Layout": {
      "description": "These components help manage page layout, for example putting text in the `Aside` component will render it in the article margin instead of inline with the rest of your text.",
      "components": [
        {
          "Aside": {
            "description": "Content inside of an aside component will be displayed in the margin of your document. For example, the [consumer complaints](https://mathisonian.github.io/consumer-complaints/) article uses the `Aside` component to display a small chart and caption:",
            "image": "aside.png",
            "thumbnail": "aside.png"
          }
        },
        {
          "Feature": {
            "description": "A `feature` component will lock a component in place on the reader's screen while a specified set of content scrolls by.",
            "image": "feature.gif",
            "thumbnail": "feature.png",
            "idyllProps": [
              {
                "value": "the percentage of the the feature that the user has scrolled through. Bind a variable to this and it will be updated automatically."
              }
            ]
          }
        },
        {
          "Fixed": {
            "description": "Content inside of a `fixed` component will be locked in place, even when the rest of the document scrolls. The [scroll](https://idyll-lang.github.io/idyll/scroll) example uses the `fixed` component to keep the dynamic chart in place:",
            "thumbnail": "fixed.gif",
            "image": "fixed.gif"
          }
        },
        {
          "Float": {
            "description": "Content inside of a float will use the CSS `float` attribute to float to the left or right of its parent container.",
            "thumbnail": "float.png",
            "idyllProps": [
              {
                "position": "the float position: left or right."
              },
              {
                "width": "the width of the component, specified in pixels or percentage."
              }
            ]
          }
        },
        // {
        //   "FullScreen": {
        //     "thumbnail": "full-screen.png",
        //     "description": "This container component will break out of the article column and take up the readers entire viewport.",
        //     "idyllProps": [
        //       {
        //         "backgroundImage": "an image to be displayed."
        //       }
        //     ]
        //   }
        // },
        {
          "Inline": {
            "thumbnail": "inline.png",
            "description": "The `inline` component adds the `display: inline-block` style property, so that items inside of `inline` component will be displayed next to each other. For example, this code will display three images side by side:"
          }
        },
        // {
        //   "Panel": {
        //     "thumbnail": "panel.png",
        //     "description": "A panel is a section that will \"slide up\" after a the end of a `Feature` was reached. This component must be used directly after a `Feature` component for it to work properly."
        //   }
        // },
        {
          "Waypoint": {
            "thumbnail": "waypoint.png",
            "description": "A `Waypoint` component just adds some padding around your text to make it easier to trigger events when a certain section has been reached."
          }
        }
      ]
    }
  },
  {
    "Presentation": {
      "description": "These components render something to the screen, for example the `Chart` component takes data as input and can display several types of charts.",
      "components": [
        {
          "Action": {
            "thumbnail": "action.png",
            "description": "The `action` component allows you to add event handlers to text. For example:",
            "idyllProps": [
              {
                "onClick": null
              },
              {
                "onMouseEnter": null
              },
              {
                "onMouseLeave": null
              }
            ]
          }
        },
        {
          "Boolean": {
            "thumbnail": "boolean.png",
            "description": "This will display a checkbox.",
            "idyllProps": [
              {
                "value": "A value for the checkbox. If this value is truthy, the checkbox will be shown."
              }
            ]
          }
        },
        {
          "Button": {
            "thumbnail": "button.png",
            "description": "This will display a button. To control what happens when the button is clicked, add an `onClick` property:",
            "image": "button.gif",
            "idyllProps": [
              {
                "onClick": null
              }
            ]
          }
        },
        {
          "Chart": {
            "thumbnail": "chart.png",
            "description": "This will display a chart.",
            "image": "chart.png",
            "idyllProps": [
              {
                "data": "A JSON object containing the data for this chart. It uses the [victory](https://formidable.com/open-source/victory/docs) library to handle rendering, so see those docs for more information on what types of data can be passed in."
              },
              {
                "type": "The type of the chart to display, can be `line`, `scatter`, `bar`, `pie`, or `time`. The time type is a line chart that expects the `x` values in the data to be in the temporal domain."
              }
            ]
          }
        },
        {
          "Display": {
            "thumbnail": "display.png",
            "description": "This will render the value of a variable to the screen. It is mostly useful for debugging:",
            "image": "displayvar.gif"
          }
        },
        {
          "Dynamic": {
            "thumbnail": "dynamic.png",
            "description": "This will render a dynamic variable to the screen.",
            "image": "dynamic.gif",
            "idyllProps": [
              {
                "value": "The value to display."
              },
              {
                "max": "The maximum value."
              },
              {
                "min": "The minimum value."
              },
              {
                "interval": "The granularity of the changes."
              }
            ]
          }
        },
        {
          "Equation": {
            "thumbnail": "equation.png",
            "description": "This uses [KaTeX](https://github.com/Khan/KaTeX) to typeset mathematical equations. Example:",
            "image": "equation.png"
          }
        },
        {
          "Gist": {
            "thumbnail": "gist.png",
            "description": "Embed a github gist",
            "image": "gist.png"
          }
        },
        {
          "Header": {
            "thumbnail": "header.png",
            "description": "This component makes it easy to add a title, subtitle, and byline to your article:",
            "image": "header.png"
          }
        },
        {
          "Link": {
            "thumbnail": "link.png",
            "description": "This component just acts as syntactic sugar for displaying links inline in your text."
          }
        },
        {
          "Radio": {
            "thumbnail": "radio.png",
            "description": "This component displays a set of radio buttons.",
            "idyllProps": [
              {
                "value": "the value of the \"checked\" radio button"
              },
              {
                "options": "an array representing the different buttons. Can be an array of strings like `[\"val1\", \"val2\"]` or an array of objects `[{ value: \"val1\", label: \"Value 1\" }, { value: \"val2\", label: \"Value 2\" }]`."
              }
            ]
          }
        },
        {
          "Range": {
            "thumbnail": "range.png",
            "description": "This component displays a range slider.",
            "image": "displayvar.gif",
            "idyllProps": [
              {
                "value": "The value to display; if this is a variable, the variable will automatically be updated when the slider is moved."
              },
              {
                "max": "The maximum value."
              },
              {
                "min": "The minimum value."
              },
              {
                "step": "The granularity of the slider."
              }
            ]
          }
        },
        {
          "Select": {
            "thumbnail": "select.png",
            "description": "This component displays a selection dropdown.",
            "idyllProps": [
              {
                "value": "the currently selected value."
              },
              {
                "options": "an array representing the different options. Can be an array of strings like `[\"val1\", \"val2\"]` or an array of objects `[{ value: \"val1\", label: \"Value 1\" }, { value: \"val2\", label: \"Value 2\" }]`."
              }
            ]
          }
        },
        {
          "Slideshow": {
            "thumbnail": "slideshow.png",
            "description": "This component is used to dynamically display different content. It can be used to make slideshows, but is generally useful for dynamically displaying different content of any type.",
            "image": "slides.gif"
          }
        },
        {
          "SVG": {
            "thumbnail": "svg.png",
            "description": "This component will display an SVG file inline using https://github.com/matthewwithanm/react-inlinesvg. This makes it easy to style the SVG with css, as opposed to displaying the svg inside of an image tag."
          }
        },
        {
          "Table": {
            "thumbnail": "table.png",
            "description": "Display tabular data. Uses https://github.com/glittershark/reactable under the hood to render the table.",
            "image": "table.png"
          }
        },
        {
          "TextInput": {
            "thumbnail": "text-input.png",
            "description": "A user-editable text input field.",
            "idyllProps": [
              {
                "value": "the current value of the text entry box."
              }
            ]
          }
        }
      ]
    }
  },
  {
    "Helpers": {
      "description": "These components don't affect the page content, but help with common tasks. The `Analytics` component makes it easy to add Google Analytics to your page.",
      "components": [
        {
          "Analytics": {
            "thumbnail": "analytics.png",
            "description": "This component makes it easy to insert a Google Analytics code on your page."
          }
        },
        {
          "Meta": {
            "thumbnail": "meta.png",
            "description": "The meta component adds context to the page template when building your app for publication. The following variables are available and will be inserted as `<meta>` properties into the head of your HTML page if you define them:",
            "idyllProps": [
              {
                "title": "the page title."
              },
              {
                "description": "a short description of your project."
              },
              {
                "url": "the canonical URL from this project."
              },
              {
                "twitterHandle": "the author's twitter handle, it will create a link in the twitter card."
              },
              {
                "shareImageUrl": "the URL of an image to be shared on social media (twitter cards, etc.). This must be a fully qualified URL, e.g. https://idyll-lang.github.io/images/logo.png."
              },
              {
                "shareImageWidth": "the width of the share image in pixels."
              },
              {
                "shareImageHeight": "the height of the share image in pixels."
              }
            ]
          }
        },
        {
          "Preload": {
            "thumbnail": "preload.png",
            "description": "This will preload an array of images, useful if you want to show them later on in the article and not have a loading flash.",
            "idyllProps": [
              {
                "images": "the array of images: `[\"image-url-1.png\", \"image-url-2.jpg\"]`."
              }
            ]
          }
        }
      ]
    }
  }
];

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const indexedComponents = {};
components.forEach((g) => {
  Object.keys(g).map(key => g[key].components).forEach((comps) => {

    comps.forEach((comp) => {
      Object.keys(comp).forEach((key) => {
        const slug = slugify(key);
        indexedComponents[slug] = Object.assign({}, comp[key], { slug: slug, title: key, name: key });
      })
    })
  })
})

export { indexedComponents };
export default components;