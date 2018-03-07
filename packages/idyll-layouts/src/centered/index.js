import createStyles from './styles';

const config = {
  maxWidth: 600,
  margin: '0 auto'
};

export default {
  ...config,
  styles: createStyles(config)
};
