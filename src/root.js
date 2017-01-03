'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  View
} from 'react-native';
import buildStyleInterpolator from 'buildStyleInterpolator';
import SettingsService from './services/settings';
import ApiService from './services/api';
import SwiperStart from './swiper-start';
import Swiper from './swiper';
import Dashboard from './dashboard';

var settingsService = new SettingsService();
var apiService = new ApiService();

var NoTransition = {
    opacity: {
        from: 1,
        to: 1,
        min: 1,
        max: 1,
        type: 'linear',
        extrapolate: false,
        round: 100
    }
};

const NoTransitionSceneConfig = {
  ...Navigator.SceneConfigs.FloatFromLeft,
  gestures: null,
  defaultTransitionVelocity: 1000,
  animationInterpolators: {
    into: buildStyleInterpolator(NoTransition),
    out: buildStyleInterpolator(NoTransition)
  }
};

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
});

class Root extends Component {
  constructor(props) {
    super(props);
  }

  _renderScene(route, navigator) {
    if (route.name == 'swiper-start') {
      return <SwiperStart navigator={navigator} settingsService={settingsService} apiService={apiService} />
    }
    else if (route.name == 'swiper') {
      return <Swiper navigator={navigator} {...route.params} settingsService={settingsService} />
    }
    else if (route.name == 'dashboard') {
      return <Dashboard navigator={navigator} />
    }
  }

  _configureScene(route) {
    if (route.name == 'swiper') {
      return NoTransitionSceneConfig;
    }

    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {
    return (
      <View style={styles.view}>
        <Navigator
          initialRoute={{name: 'swiper-start'}}
          renderScene={this._renderScene.bind(this)}
          configureScene={this._configureScene} />
      </View>
    );
  }
}

export default Root;