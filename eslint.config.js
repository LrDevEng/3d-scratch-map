import ReactThree from '@react-three/eslint-plugin';
import upLeveledLint from 'eslint-config-upleveled';

const config = [...upLeveledLint, { plugins: { '@react-three': ReactThree } }];

export default config;
