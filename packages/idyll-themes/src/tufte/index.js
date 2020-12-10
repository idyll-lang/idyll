import createStyles from './styles';

const config = {
  headerColor: '#111',
  headerBackground: '#fffff8'
};

export default {
  ...config,
  styles: createStyles(config)
};
