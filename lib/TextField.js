'use strict';
/* @flow */

import React, {
	Component,
	View,
	TextInput,
	StyleSheet,
	PropTypes,
	Dimensions
} from 'react-native';

import Underline from './Underline';
import FloatingLabel from './FloatingLabel';


var getRatio = function(percent, value, ratio){
    var r = ratio || 1;
    return parseInt(r * percent * value / 100);
}
var {width,height} = Dimensions.get('window');


export default class TextField extends Component {
  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      isFocused: false,
      text: props.value
    };
  }
  focus() {
		this.refs.input.focus();
  }
  render() {
		let {
			label,
			highlightColor,
			duration,
			labelColor,
			borderColor,
			onFocus,
			onBlur,
			onChangeText,
			value,
			dense,
			...props
		} = this.props;

		var textInputPadding = {paddingLeft: this.props.icon ? getRatio(7,width) : 0}
		var icon ;
		if (this.props.icon){
		    icon = (<View style={styles.icon}>{this.props.icon}</View>)
		}

    return (
      <View style={dense ? styles.denseWrapper : styles.wrapper} ref="wrapper">
        <TextInput
          style={[dense ? styles.denseTextInput : styles.textInput , textInputPadding]}
          onFocus={() => {
            this.setState({isFocused: true});
            this.refs.floatingLabel.floatLabel();
						this.refs.underline.expandLine();
						onFocus && onFocus();
          }}
          onBlur={() => {
            this.setState({isFocused: false});
						!this.state.text.length && this.refs.floatingLabel.sinkLabel();
						this.refs.underline.shrinkLine();
						onBlur && onBlur();
          }}
          onChangeText={(text) => {
            this.setState({text});
						onChangeText && onChangeText(text);
          }}
          ref="input"
					value={this.state.text}
					{...props}
        />
        {icon}
        <Underline
            ref="underline"
            highlightColor={highlightColor}
            duration={duration}
            borderColor={borderColor}
            />
        <FloatingLabel
          isFocused={this.state.isFocused}
          ref="floatingLabel"
          focusHandler={this.focus.bind(this)}
          label={label}
					labelColor={labelColor}
					highlightColor={highlightColor}
					duration={duration}
					dense={dense}
					hasValue={(this.state.text.length) ? true : false}
        />
      </View>
    );
  }
}

TextField.propTypes = {
	duration: PropTypes.number,
	label: PropTypes.string,
	highlightColor: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onChangeText: PropTypes.func,
	value: PropTypes.string,
	dense: PropTypes.bool
};

TextField.defaultProps = {
	duration: 200,
	labelColor: '#9E9E9E',
	borderColor: '#E0E0E0',
	value: '',
	dense: false,
	underlineColorAndroid: 'rgba(0,0,0,0)'
};

const styles = StyleSheet.create({
  wrapper: {
    height: 72,
    paddingTop: 30,
    paddingBottom: 7,
    position: 'relative'
  },
	denseWrapper: {
		height: 60,
		paddingTop: 28,
		paddingBottom: 4,
		position: 'relative'
	},
  textInput: {
    fontSize: 18,
    height: 34,
    lineHeight: 34
  },
	denseTextInput: {
		fontSize: 13,
		height: 27,
		lineHeight: 24,
		paddingBottom: 3
	},
	icon :{
	    position: "absolute",
        bottom : 10
	}
});
