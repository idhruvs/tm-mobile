var React = require('react');

function MockIcon(props) {
  return React.createElement('Icon', props);
}

// Mock @expo/vector-icons — used by react-native-paper's Icon component
jest.mock('@expo/vector-icons', function () {
  return new Proxy(
    {},
    {
      get: function (_target, name) {
        if (name === '__esModule') return true;
        if (name === 'default') return MockIcon;
        return MockIcon;
      },
    },
  );
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', function () {
  return {
    getItem: jest.fn(function () { return Promise.resolve(null); }),
    setItem: jest.fn(function () { return Promise.resolve(); }),
    removeItem: jest.fn(function () { return Promise.resolve(); }),
  };
});

// Mock MaterialCommunityIcons — used by react-native-paper internally
jest.mock('react-native-vector-icons/MaterialCommunityIcons', function () {
  MockIcon.getImageSource = jest.fn();
  MockIcon.loadFont = jest.fn();
  MockIcon.hasIcon = jest.fn(function () { return true; });
  return MockIcon;
});
