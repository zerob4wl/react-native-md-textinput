'use strict';
/* @flow */

import React, {Component, PropTypes} from 'react';

import {StyleSheet, Animated, Dimensions} from 'react-native';

var getRatio = function(percent, value, ratio){
    var r = ratio || 1;
    return parseInt(r * percent * value / 100);
}

export default class FloatingLabel extends Component {
  constructor(props: Object) {
    var {width,height} = Dimensions.get('window');
    super(props);
		if(props.dense) {
			this.posTop = 12;
			this.posBottom = 32;
			this.fontLarge = 13;
			this.fontSmall = 18;
		} else {
			this.posTop = 16;
			this.posBottom = 37;
			this.fontLarge = 16;
			this.fontSmall = 15;
		}
		let posTop = (props.hasValue) ? this.posTop : this.posBottom;
		let fontSize = (props.hasValue) ? this.fontSmall : this.fontLarge;
    this.state = {
      top: new Animated.Value(posTop),
      fontSize: new Animated.Value(fontSize)
    };
  }
	shouldComponentUpdate(nextProps: Object, nextState: Object) : bool {
		return (this.props.hasValue !== nextProps.hasValue) ? false : true;
	}
  floatLabel() {
    Animated.parallel([
      Animated.timing(this.state.top, {
        toValue: this.posTop,
        duration: this.props.duration
      }),
      Animated.timing(this.state.fontSize, {
        toValue: this.fontSmall,
        duration: this.props.duration
      })
    ]).start();
  }
  sinkLabel() {
    Animated.parallel([
      Animated.timing(this.state.top, {
        toValue: this.posBottom,
        duration: this.props.duration
      }),
      Animated.timing(this.state.fontSize, {
        toValue: this.fontLarge,
        duration: this.props.duration
      })
    ]).start();
  }
  render() : Object {
		let {
			label,
			labelColor,
			highlightColor
		} = this.props;
    return (
      <Animated.Text
        style={[{
          fontSize: this.state.fontSize,
          top: this.state.top,
					color: labelColor
        }, styles.labelText, this.props.isFocused && {
					color: highlightColor
				}]}
        onPress={()=> {
          this.props.focusHandler();
        }}
      >
        {label}
      </Animated.Text>
    );
  }
}

FloatingLabel.propTypes = {
	duration: PropTypes.number,
	label: PropTypes.string,
	labelColor: PropTypes.string,
	highlightColor: PropTypes.string,
	dense: PropTypes.bool
};

const styles = StyleSheet.create({
  labelText: {
      fontFamily : "irsans",
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(0,0,0,0)'
  }
});
