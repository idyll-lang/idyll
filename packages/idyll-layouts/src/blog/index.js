import createStyles from './styles';

const config = {
  maxWidth: 600,
  marginLeft: '10vw'
};

export default {
  ...config,
  styles: createStyles(config)
};
