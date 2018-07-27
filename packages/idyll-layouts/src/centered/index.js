import createStyles from './styles';

const config = {
  maxWidth: 600,
  marginTop: 0,
  marginRight: 'auto',
  marginBottom: 0,
  marginLeft: 'auto'
};

export default {
  ...config,
  styles: createStyles(config)
};
