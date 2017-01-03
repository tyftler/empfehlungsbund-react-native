'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  PanResponder,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { default as Carousel } from 'react-native-swiper2';

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dashboardButton: {
    position: 'absolute',
    top: 5,
    left: 5
  },
  pagination: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  paginationText: {
    fontSize: 18
  },
  uninterestingLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  interestingLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  uninterestingLabelText: {
    fontSize: 20,
    color: 'red'
  },
  interestingLabelText: {
    fontSize: 20,
    color: 'green'
  },
  swiperLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
  },
  slide: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  preview: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16
  }
});

class Swiper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      jobs: this.props.jobs,
      jobIndex: -1
    }
  }

  componentWillMount() {
    this._y = 0;
    this.state.pan.y.addListener((value) => {
      this._y = value.value

      if (this._y > 0) {
        this._uninterestingLabel.setNativeProps({style: [styles.uninterestingLabel, {opacity: 1, transform: [{ translateY: value.value / 2 }]}]});
        this._interestingLabel.setNativeProps({style: {opacity: 0}});
      } else if (this._y < 0) {
        this._uninterestingLabel.setNativeProps({style: {opacity: 0}});
        this._interestingLabel.setNativeProps({style: [styles.interestingLabel, {opacity: 1, transform: [{ translateY: value.value / 2 }]}]});
      }

      return this._y;
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: 0, y: 0});
        this.state.pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([
        null, {dy: this.state.pan.y},
      ]),
      onPanResponderRelease: () => {
        if (this._y < -200) {
          Animated.timing(this.state.pan, {
            toValue: {x: 0, y: -Dimensions.get('window').height},
            duration: 500
          }).start(() => {
            this._carousel.state.index = 0;
            this._carousel.scrollTo(0);

            setTimeout(() => {
              this.state.pan.setValue({x: 0, y: 0});

              console.log(this.state.jobs[this.state.jobIndex].id + ' is interesting');

              this._nextJob();
            }, 500);
          });
        } else if (this._y > 200) {
          Animated.timing(this.state.pan, {
            toValue: {x: 0, y: Dimensions.get('window').height},
            duration: 500
          }).start(() => {
            this._carousel.state.index = 0;
            this._carousel.scrollTo(0);

            setTimeout(() => {
              this.state.pan.setValue({x: 0, y: 0});

              this.props.settingsService.ignoredJobs.push(this.state.jobs[this.state.jobIndex].id);
              console.log(this.state.jobs[this.state.jobIndex].id + ' is uninteresting');

              this._nextJob();
            }, 500);
          });
        } else {
          Animated.spring(this.state.pan, {
            toValue: 0
          }).start();
        }
      }
    });

    this._nextJob();
  }

  componentWillUnmount() {
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
  }

  _nextJob() {
    if (typeof this.state.jobs[this.state.jobIndex + 1] == 'undefined') {
      this.props.navigator.pop();
      return;
    }

    this.setState({jobIndex: this.state.jobIndex + 1})
  }

  _openDashboard() {
    this.props.navigator.push({name: 'dashboard'});
  }

  render() {
    return (
      <View style={styles.view}>
        <View style={styles.container}>
          <View ref={component => this._uninterestingLabel = component} style={styles.uninterestingLabel}>
            <Text style={styles.uninterestingLabelText}>
              Uninteressant
            </Text>
          </View>
          <View ref={component => this._interestingLabel = component} style={styles.interestingLabel}>
            <Text style={styles.interestingLabelText}>
              Interessant
            </Text>
          </View>
        </View>
        <Animated.View horizontal={false} style={[styles.swiperLayer, {transform: [{translateY: this.state.pan.y}]}]} {...this._panResponder.panHandlers}>
          <Carousel ref={component => this._carousel = component} horizontal={true} loop={false}>
            <View style={styles.slide}>
              <Text style={styles.title}>
                {this.state.jobs[this.state.jobIndex].title}
              </Text>
              <Text style={styles.preview}>
                {this.state.jobs[this.state.jobIndex].preview}
              </Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.title}>
                Slide 2
              </Text>
              <Text style={styles.preview}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              </Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.title}>
                Slide 3
              </Text>
              <Text style={styles.preview}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              </Text>
            </View>
          </Carousel>
        </Animated.View>
        <View style={styles.dashboardButton}>
          <Icon.Button name="bars" onPress={this._openDashboard.bind(this)} size={30} color={'black'} backgroundColor={'transparent'} />
        </View>
        <View style={styles.pagination}>
          <Text style={styles.paginationText}>
            {this.state.jobIndex + 1} / {this.state.jobs.length}
          </Text>
        </View>
      </View>
    );
  }
}

export default Swiper;
