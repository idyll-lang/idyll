import * as COMPONENTS from 'idyll-components';

const components = [
  {
    Layout: {
      description:
        'These components help manage page layout, for example putting text in the `Aside` component will render it in the article margin instead of inline with the rest of your text.',
      components: [
        {
          Aside: {
            description:
              'Content inside of an aside component will be displayed in the margin of your document. For example, the [consumer complaints](https://mathisonian.github.io/consumer-complaints/) article uses the `Aside` component to display a small chart and caption:',
            image: 'aside.png',
            thumbnail: 'aside.png',
            component: COMPONENTS.Aside
          }
        },
        {
          FullWidth: {
            description:
              "A `FullWidth` component will break out of the text container and expand to fill the full width of the reader's browser.",
            image: 'feature.png',
            thumbnail: 'feature.png'
          }
        },
        {
          Fixed: {
            description:
              'Content inside of a `fixed` component will be locked in place, even when the rest of the document scrolls. The [scroll](https://idyll-lang.github.io/idyll/scroll) example uses the `fixed` component to keep the dynamic chart in place:',
            thumbnail: 'fixed.gif',
            image: 'fixed.gif',
            component: COMPONENTS.Fixed
          }
        },
        {
          Float: {
            description:
              'Content inside of a float will use the CSS `float` attribute to float to the left or right of its parent container.',
            thumbnail: 'float.png',
            component: COMPONENTS.Float
          }
        },
        {
          Inline: {
            thumbnail: 'inline.png',
            description:
              'The `inline` component adds the `display: inline-block` style property, so that items inside of `inline` component will be displayed next to each other. For example, this code will display three images side by side:',
            component: COMPONENTS.Inline
          }
        },
        {
          Scroller: {
            description:
              'The `Scroller` component is used to create scroll-based presentations. See [this example](https://mathisonian.github.io/idyll/scaffolding-interactives/) for more details.',
            thumbnail: 'scroller.gif',
            image: 'scroller.gif',
            component: COMPONENTS.Scroller
          }
        },
        {
          Stepper: {
            description:
              'The `Step` component is used to create step-based presentations, like slideshows.  See [this example](https://mathisonian.github.io/idyll/scaffolding-interactives/) for more details.',
            thumbnail: 'stepper.gif',
            image: 'stepper.gif',
            component: COMPONENTS.Stepper
          }
        }
      ]
    }
  },
  {
    Input: {
      description:
        'The components are used to accept reader input and update variables in response.',
      components: [
        {
          Action: {
            thumbnail: 'action.png',
            component: COMPONENTS.Action,
            description:
              'The `action` component allows you to add event handlers to text. For example:'
          }
        },
        {
          Boolean: {
            thumbnail: 'boolean.png',
            image: 'boolean.gif',
            component: COMPONENTS.Boolean,
            description: 'This will display a checkbox.'
          }
        },
        {
          Button: {
            thumbnail: 'button.png',
            description:
              'This will display a button. To control what happens when the button is clicked, add an `onClick` property:',
            image: 'button.gif',
            component: COMPONENTS.Button
          }
        },
        {
          Dynamic: {
            thumbnail: 'dynamic.png',
            description: 'This will render a dynamic variable to the screen.',
            image: 'dynamic.gif',
            component: COMPONENTS.Dynamic
          }
        },
        {
          Radio: {
            thumbnail: 'radio.png',
            component: COMPONENTS.Radio,
            description: 'This component displays a set of radio buttons.'
          }
        },
        {
          Range: {
            thumbnail: 'range.png',
            component: COMPONENTS.Range,
            description: 'This component displays a range slider.',
            image: 'displayvar.gif'
          }
        },
        {
          Select: {
            thumbnail: 'select.png',
            component: COMPONENTS.Select,
            description: 'This component displays a selection dropdown.'
          }
        },
        {
          TextInput: {
            thumbnail: 'text-input.png',
            component: COMPONENTS.TextInput,
            description: 'A user-editable text input field.'
          }
        }
      ]
    }
  },
  {
    Presentation: {
      description:
        'These components render something to the screen, for example the `Chart` component takes data as input and can display several types of charts.',
      components: [
        {
          Chart: {
            thumbnail: 'chart.png',
            component: COMPONENTS.Chart,
            description: 'This will display a chart.',
            image: 'chart.png'
          }
        },
        {
          Conditional: {
            thumbnail: 'conditional.png',
            description:
              'This component will conditionally display its children.',
            component: COMPONENTS.Conditional
          }
        },
        {
          Display: {
            thumbnail: 'display.png',
            component: COMPONENTS.Display,
            description:
              'This will render the value of a variable to the screen. It is mostly useful for debugging:',
            image: 'displayvar.gif'
          }
        },
        {
          Equation: {
            thumbnail: 'equation.png',
            component: COMPONENTS.Equation,
            description:
              'This uses [KaTeX](https://github.com/Khan/KaTeX) to typeset mathematical equations. Example:',
            image: 'equation.png'
          }
        },
        {
          Gist: {
            thumbnail: 'gist.png',
            component: COMPONENTS.Gist,
            description: 'Embed a github gist',
            image: 'gist.png'
          }
        },
        {
          Header: {
            thumbnail: 'header.png',
            component: COMPONENTS.Header,
            description:
              'This component makes it easy to add a title, subtitle, and byline to your article:',
            image: 'header.png'
          }
        },
        {
          Link: {
            thumbnail: 'link.png',
            component: COMPONENTS.Link,
            description:
              'This component just acts as syntactic sugar for displaying links inline in your text.'
          }
        },
        {
          SVG: {
            thumbnail: 'svg.png',
            component: COMPONENTS.SVG,
            description:
              'This component will display an SVG file inline using https://github.com/matthewwithanm/react-inlinesvg. This makes it easy to style the SVG with css, as opposed to displaying the svg inside of an image tag.'
          }
        },
        {
          Table: {
            thumbnail: 'table.png',
            component: COMPONENTS.Table,
            description:
              'Display tabular data. Uses https://github.com/react-tools/react-table under the hood to render the table.',
            image: 'table.png'
          }
        },
        {
          Youtube: {
            thumbnail: 'youtube.png',
            component: COMPONENTS.Youtube,
            description:
              'Plays a video from YouTube. All of the parameters are optional except for id, which must be provided. See all available options at https://developers.google.com/youtube/player_parameters'
          }
        }
      ]
    }
  },
  {
    Helpers: {
      description:
        "These components don't affect the page content, but help with common tasks. The `Analytics` component makes it easy to add Google Analytics to your page.",
      components: [
        {
          Analytics: {
            thumbnail: 'analytics.png',
            component: COMPONENTS.Analytics,
            description:
              'This component makes it easy to insert a Google Analytics code on your page.'
          }
        },
        {
          Meta: {
            thumbnail: 'meta.png',
            component: COMPONENTS.Meta,
            description:
              'The meta component adds context to the page template when building your app for publication. The following variables are available and will be inserted as `<meta>` properties into the head of your HTML page if you define them:',
            idyllProps: [
              {
                name: 'title',
                type: 'string',
                description: 'the page title.'
              },
              {
                name: 'description',
                type: 'string',
                description: 'A short description of your project.'
              },
              {
                name: 'url',
                type: 'string',
                description: 'The canonical URL from this project.'
              },
              {
                name: 'twitterHandle',
                type: 'string',
                description:
                  "The author's twitter handle, it will create a link in the twitter card."
              },
              {
                name: 'shareImageUrl',
                type: 'string',
                description:
                  'The URL of an image to be shared on social media (twitter cards, etc.). This must be a fully qualified URL, e.g. https://idyll-lang.github.io/images/logo.png.'
              },
              {
                name: 'shareImageWidth',
                type: 'string',
                description: 'The width of the share image in pixels.'
              },
              {
                name: 'shareImageHeight',
                type: 'string',
                description: 'The height of the share image in pixels.'
              }
            ]
          }
        },
        {
          Preload: {
            thumbnail: 'preload.png',
            component: COMPONENTS.Preload,
            description:
              'This will preload an array of images, useful if you want to show them later on in the article and not have a loading flash.'
          }
        }
      ]
    }
  }
];

function slugify(text) {
  return text
    .toString()
    .split(/([A-Z][a-z]+)/)
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

const indexedComponents = {};
components.forEach(g => {
  Object.keys(g)
    .map(key => g[key].components)
    .forEach(comps => {
      comps.forEach(comp => {
        Object.keys(comp).forEach(key => {
          const slug = slugify(key);
          indexedComponents[slug] = Object.assign({}, comp[key], {
            slug: slug,
            title: key,
            name: key
          });
        });
      });
    });
});

export { indexedComponents };
export default components;
