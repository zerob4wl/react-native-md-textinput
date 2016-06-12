'use strict';
/* @flow */

import React, {Component, PropTypes} from 'react';

import {View, TextInput, StyleSheet, Dimensions, PixelRatio} from 'react-native';

import Underline from './Underline';
import FloatingLabel from './FloatingLabel';



var display = Dimensions.get("window");
var screenWidth = display.width;
var screenHeight = display.height;


var getRatio = function(percent, value, ratio){
	var r = ratio || 1;
	return parseInt(r * percent * value / 100);
}
var {width,height} = Dimensions.get('window');


function getCorrectFontSizeForScreen(currentFont){
	let devRatio = PixelRatio.get();
	let factor = (((screenWidth*devRatio)/320)+((screenHeight*devRatio)/640))/2.0;
	let maxFontDifferFactor = 5; //the maximum pixels of font size we can go up or down
	// console.log("The factor is: "+factor);
	if(factor<=1){
		return currentFont-float2int(maxFontDifferFactor*0.3);
	}else if((factor>=1) && (factor<=1.6)){
		return currentFont-float2int(maxFontDifferFactor*0.1);
	}else if((factor>=1.6) && (factor<=2)){
		return currentFont;
	}else if((factor>=2) && (factor<=3)){
		return currentFont+float2int(maxFontDifferFactor*0.65);
	}else if (factor>=3){
		return currentFont+float2int(maxFontDifferFactor);
	}

}

function float2int (value) {
	return value | 0;
}

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

	componentWillReceiveProps(newProps) {
		this.setState({
			text : newProps.value
		})
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

		var textInputPadding = {paddingLeft: this.props.icon ? getRatio(9,width) : 0}
		var icon ;
		if (this.props.icon){
			icon = (<View style={styles.icon}>{this.props.icon}</View>)
		}

		var height = {fontFamily : "irsans"};
		if (this.props.multiline){
			height = {
				height  : 150
			}
		}

		return (

			<View style={[dense ? styles.denseWrapper : styles.wrapper]} ref="wrapper">
				<TextInput

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
					style={[styles.textInput , textInputPadding,height,{fontFamily : "irsans" }]}
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

		paddingTop: 30,
		paddingBottom: 7,
		position: 'relative'
	},
	denseWrapper: {
		fontFamily : "irsans",
		height: 60,
		paddingTop: 28,
		paddingBottom: 4,
		position: 'relative'
	},
	textInput: {
		fontSize: getCorrectFontSizeForScreen(13),
		height: PixelRatio.roundToNearestPixel(50),
		fontFamily : "irsans",
		color :"#000",
		lineHeight: 24,paddingBottom: -10
	},
	denseTextInput: {
		fontFamily : "irsans",
		fontSize: 13,
		height: 27,
		lineHeight: 24,
		paddingBottom: 3
	},
	icon :{
		position: "absolute",
		bottom : PixelRatio.roundToNearestPixel(20),
		left : -1 * PixelRatio.roundToNearestPixel(0),
	}
});
