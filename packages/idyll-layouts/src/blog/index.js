import createStyles from './styles';

const config = {
  maxWidth: 600,
  margin: '0 0 0 50px'
};

export default {
  ...config,
  styles: createStyles(config)
};
