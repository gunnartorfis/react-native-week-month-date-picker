import type { PlatformOSType } from 'react-native';

interface ElevationProps {
  elevation?: number;
  top?: boolean;
  os?: PlatformOSType;
}

const elevation = ({
  elevation: e = 2,
  top = false,
  os,
}: ElevationProps = {}) => {
  const iOS = {
    shadowOpacity: 0.0015 * e + 0.1,
    shadowRadius: 3 * e,
    shadowOffset: {
      height: top ? -0.6 * e : 1 * e,
      width: 0,
    },
  };

  const android = {
    elevation: e,
  };

  if (os) {
    if (os === 'ios') {
      return iOS;
    }
    return android;
  }

  if (os === 'ios') {
    return iOS;
  }

  return {
    ...iOS,
    ...android,
  };
};

export default elevation;
