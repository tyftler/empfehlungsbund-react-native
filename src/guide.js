'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Alert,
  Text,
  TextInput,
  TouchableHighlight
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20
  },
  geolocationButton: {
    flex: 1,
    padding: 10,
    borderRadius: 3,
    backgroundColor: 'lightgrey'
  },
  saveButton: {
    flex: 2,
    marginLeft: 20,
    padding: 10,
    borderRadius: 3,
    backgroundColor: 'lightgrey'
  }
});

class Guide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      loadingVisible: false,
      query: 'Ruby',
      location: 'Dresden'
    }
  }

  _geolocation() {
    this.setState({loadingVisible: true});

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.apiService.reverseGeocode(position.coords.latitude, position.coords.longitude).then((data) => {
          this.setState({loadingVisible: false, location: data.city});

          Alert.alert('Standortermittlung', 'Ermittelter Standort: ' + data.city);
        }).catch((err) => {
          console.error(err);
          this.setState({loadingVisible: false});

          Alert.alert('Standortermittlung', 'Ihr Standort konnte leider nicht ermittelt werden.');
        });
      },
      (err) => {
        console.error(err);
        this.setState({loadingVisible: false});

        Alert.alert('Standortermittlung', 'Ihr Standort konnte leider nicht ermittelt werden.');
      },
      {
        enableHighAccuracy: true,
        timeout: 20000
      }
    );
  }

  _save() {
    this.props.settingsService.query = this.state.query;
    this.props.settingsService.location = this.state.location;
    this.setState({modalVisible: false});
    this.props.onClose();
  }

  render() {
    return (
      <Modal visible={this.state.modalVisible} transparent={false} onRequestClose={() => {this._save()}}>
        <View style={styles.container}>
          <TextInput value={this.state.query} onChangeText={(text) => this.setState({query: text})} placeholder="Schlagworte" />
          <TextInput value={this.state.location} onChangeText={(text) => this.setState({location: text})} placeholder="Ort" />
          <View style={styles.buttons}>
          <TouchableHighlight onPress={this._geolocation.bind(this)} style={styles.geolocationButton}>
            <Text>
              Geolocation
            </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._save.bind(this)} style={styles.saveButton}>
            <Text>
              Speichern
            </Text>
          </TouchableHighlight>
          </View>
          <Spinner overlayColor="lightgray" visible={this.state.loadingVisible} />
        </View>
      </Modal>
    );
  }
}

export default Guide;
