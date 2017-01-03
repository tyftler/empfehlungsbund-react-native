'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Button
} from 'react-native';
import Guide from './guide';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 16
  },
  swiperButton: {
    marginTop: 10
  },
  dashboardButton: {
    position: 'absolute',
    top: 5,
    left: 5
  }
});

class SwiperStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingVisible: false
    };
  }

  _openDashboard() {
    this.props.navigator.push({name: 'dashboard'});
  }

  _openSwiper() {
    this.setState({loadingVisible: true});

    this.props.apiService.searchJobs(this.props.settingsService.query, this.props.settingsService.location).then((data) => {
      this.setState({loadingVisible: false});

      let jobs = [];
      for (let job of data.jobs) {
        if (this.props.settingsService.ignoredJobs.indexOf(job.id) == -1) {
          jobs.push(job);
        }
      }

      if (jobs.length > 0) {
        this.props.navigator.push({
          name: 'swiper',
          params: {
            jobs: jobs
          }
        });
      }
    }).catch((err) => {
      console.error(err);
      this.setState({loadingVisible: false});

      Alert.alert('Jobsuche', 'Die aktuellen Stellenangebote konnten leider nicht abgerufen werden.');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Alle Stellenangebote angesehen
        </Text>
        <Icon.Button name="refresh" onPress={this._openSwiper.bind(this)} size={40} color={'black'} backgroundColor={'transparent'} style={styles.swiperButton} />
        <View style={styles.dashboardButton}>
          <Icon.Button name="bars" onPress={this._openDashboard.bind(this)} size={30} color={'black'} backgroundColor={'transparent'} />
        </View>
        <Spinner overlayColor="lightgray" visible={this.state.loadingVisible} />
        <Guide onClose={this._openSwiper.bind(this)} settingsService={this.props.settingsService} apiService={this.props.apiService} />
      </View>
    );
  }
}

export default SwiperStart;
