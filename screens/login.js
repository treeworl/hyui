import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	ImageBackground,
	Image,
	Alert,
	ToastAndroid,
	KeyboardAvoidingView,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config';
import {
	collection,
	query,
	where,
	getDocs,
	Timestamp,
	limit,
	addDoc,
	doc,
	updateDoc,
	increment,
} from 'firebase/firestore';

const bgImage = require('../assets/background2.png');
const appIcon = require('../assets/appIcon.png');
const appName = require('../assets/appName.png');

export default class TransactionScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bookId: '',
			studentId: '',
			domState: 'normal',
			hasCameraPermissions: null,
			scanned: false,
			bookName: '',
			studentName: '',
		};
	}

	checkStudentEligibilityForBookIssue = async (studentId) => {
		let dbQuery = query(
			collection(db, 'students'),
			where('student_id', '==', studentId)
		);

		let studentRef = await getDocs(dbQuery);

		var isStudentEligible = '';
		if (studentRef.docs.length == 0) {
			this.setState({
				bookId: '',
				studentId: '',
			});
			isStudentEligible = false;
			Alert.alert("The student id doesn't exist in the database!");
		} else {
			studentRef.forEach((doc) => {
				if (doc.data().number_of_books_issued < 2) {
					isStudentEligible = true;
				} else {
					isStudentEligible = false;
					Alert.alert('The student has already issued 2 books!');
					this.setState({
						bookId: '',
						studentId: '',
					});
				}
			});
		}

		return isStudentEligible;
	};
    handleLogin=(email,password)=>{
        const auth=getAuth();
        signInWithEmailAndPassword(auth,email,password)
        .then(()=>{
            this.props.navigation.navigate('bottomTab');
        }).catch((error)=>{
            Alert.alert(error.message);
        })
    }
	render() {
		const { bookId, studentId, domState, scanned } = this.state;
		if (domState !== 'normal') {
			return (
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
					style={StyleSheet.absoluteFillObject}
				/>
			);
		}
		return (
			<KeyboardAvoidingView behavior='padding' style={styles.container}>
				<ImageBackground source={bgImage} style={styles.bgImage}>
					<View style={styles.upperContainer}>
						<Image source={appIcon} style={styles.appIcon} />
						<Image source={appName} style={styles.appName} />
					</View>
					<View style={styles.lowerContainer}>
						<View style={styles.textinputContainer}>
							<TextInput
								style={styles.textinput}
								placeholder={'Password'}
								placeholderTextColor={'#FFFFFF'}
								secureTextEntry
								onChangeText={(text) => this.setState({ Password: text })}
							/>
						</View>
						<View style={[styles.textinputContainer, { marginTop: 25 }]}>
							<TextInput
								style={styles.textinput}
								placeholder={'Enter Email'}
								placeholderTextColor={'#FFFFFF'}
								onChangeText={(text) => this.setState({ email: text })}
							/>
							
							
						</View>
						<TouchableOpacity
							style={[styles.button, { marginTop: 25 }]}
							onPress={this.handleLogin(email,password)}>
							<Text style={styles.buttonText}>Submit</Text>
						</TouchableOpacity>
					</View>
				</ImageBackground>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	bgImage: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
	},
	upperContainer: {
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	appIcon: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		marginTop: 80,
	},
	appName: {
		width: 80,
		height: 80,
		resizeMode: 'contain',
	},
	lowerContainer: {
		flex: 0.5,
		alignItems: 'center',
	},
	textinputContainer: {
		borderWidth: 2,
		borderRadius: 10,
		flexDirection: 'row',
		backgroundColor: '#9DFD24',
		borderColor: '#FFFFFF',
	},
	textinput: {
		width: '57%',
		height: 50,
		padding: 10,
		borderColor: '#FFFFFF',
		borderRadius: 10,
		borderWidth: 3,
		fontSize: 18,
		backgroundColor: '#5653D4',
		fontFamily: 'Rajdhani_600SemiBold',
		color: '#FFFFFF',
	},
	scanbutton: {
		width: 100,
		height: 50,
		backgroundColor: '#9DFD24',
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scanbuttonText: {
		fontSize: 24,
		color: '#0A0101',
		fontFamily: 'Rajdhani_600SemiBold',
	},
	button: {
		width: '43%',
		height: 55,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F48D20',
		borderRadius: 15,
	},
	buttonText: {
		fontSize: 24,
		color: '#FFFFFF',
		fontFamily: 'Rajdhani_600SemiBold',
	},
});