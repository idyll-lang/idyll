import createStyles from './styles';

const config = {
  headerColor: '#ffffff',
  headerBackground: '#222222'
};

export default {
  ...config,
  styles: createStyles(config)
};
