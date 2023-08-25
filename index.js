/**
 * @format
 */

import './shim';
import './polyfills';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";

const AppRoot = () => {
    return (
      <RecoilRoot>
          <App />
      </RecoilRoot>
    );
  };

AppRegistry.registerComponent(appName, () => AppRoot);
