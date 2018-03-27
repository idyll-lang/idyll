import createStyles from './styles';

const config = {
  maxWidth: 600,
  marginLeft: 50
};

export default {
  ...config,
  styles: createStyles(config)
};
