const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

Enzyme.configure({ adapter: new Adapter() });

global.fetch = () => {};
const mockJsonResponse = [
  {
    x: 0,
    y: 0
  },
  {
    x: 1,
    y: 1
  }
];
const mockTextResponse = `x,y
0,0
1,1
`;
const mockJsonPromise = Promise.resolve(mockJsonResponse);
const mockTextPromise = Promise.resolve(mockTextResponse);

const mockFetchPromise = Promise.resolve({
  json: () => mockJsonPromise,
  text: () => mockTextPromise
});
jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
