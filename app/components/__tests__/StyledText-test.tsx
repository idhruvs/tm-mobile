import { render } from '@testing-library/react-native';

import { MonoText } from '../StyledText';

describe('<MonoText>', () => {
  test('MonoText renders correctly', () => {
    const tree = render(<MonoText>Snapshot Test!</MonoText>);

    expect(tree).toMatchSnapshot();
  });
});