'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import NavigationBar from 'react-native-navbar';

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  _close() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.view}>
        <NavigationBar
          title={{title: 'Dashboard'}}
          leftButton={{title: 'Back', handler: () => this._close()}} />
        <View style={styles.container}>
          <Text>
            Dashboard
          </Text>
        </View>
      </View>
    );
  }
}

export default Dashboard;
