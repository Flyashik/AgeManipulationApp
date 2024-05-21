import * as React from "react";
import {ActivityIndicator, Button, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NativeStackScreenProps} from "react-native-screens/native-stack";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import {useState} from "react";
import {RootStackParamList} from "../navigation/Navigation";
import * as FileSystem from 'expo-file-system';

type AgingScreenProps = NativeStackScreenProps<RootStackParamList, 'Aging'>;

const AgingScreen: React.FC<AgingScreenProps> = ({route}) => {
    const image = route.params;

    const navigation = useNavigation();
    const [sliderValue, setSliderValue] = useState(50);
    const [loading, setLoading] = useState(false);

    const [resultImage, setResultImage] = useState<string | null>(null);

    const navigateToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Main'}],
            })
        );
    };

    const generateImage = async () => {
        setLoading(true);
        // const response = await fetch('http://192.168.0.11:5000', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         targetAge: sliderValue,
        //         imageData: image!.base64,
        //     }),
        // });
        // if (response.ok) {
        //     setResultImage('hello');
        // }
        await saveImage();
        setLoading(false);
    };

    const saveImage = async () => {
        try {
            const fileName = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
            await FileSystem.writeAsStringAsync(fileName, image.base64, { encoding: FileSystem.EncodingType.Base64 });
            return fileName;
        } catch (error) {
            console.error("Error saving image: ", error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <ActivityIndicator size="large" color="black"/>
                </View>
            ) : (
                <>
                    <View style={styles.topPanel}>
                        <TouchableOpacity onPress={() => navigateToHome()}
                                          style={{marginTop: 'auto', marginBottom: 20, marginLeft: 20}}>
                            <Ionicons name="home" size={30} color="black"/>
                        </TouchableOpacity>
                    </View>
                    {resultImage ? (
                        <></>
                    ) : (
                        <>
                            <Image source={{uri: image.imageUri}} style={styles.image}/>
                            <View style={styles.bottomPanel}>
                                <View style={styles.sliderRow}>
                                    <Text style={styles.text}>0</Text>
                                    <Slider
                                        style={{width: '80%', height: 40, alignSelf: 'center'}}
                                        minimumValue={0}
                                        maximumValue={100}
                                        step={1}
                                        value={sliderValue}
                                        onValueChange={setSliderValue}
                                        minimumTrackTintColor="#1EB1FC"
                                        maximumTrackTintColor="#8ED1FC"
                                        thumbTintColor="#1EB1FC"
                                    />
                                    <Text style={styles.text}>100</Text>
                                </View>
                                <Text style={styles.text}>Целевой возраст: {sliderValue}</Text>
                                <TouchableOpacity style={styles.genButton} onPress={() => generateImage()}>
                                    <Text style={{...styles.text, color: 'white'}}>Сгенерировать фото</Text>
                                </TouchableOpacity>
                            </View>
                            <StatusBar barStyle="dark-content" backgroundColor="white"/>
                        </>
                    )}
                </>
            )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    image: {
        flex: 1,
        alignSelf: 'center',
        width: '98%',
    },
    topPanel: {
        height: '15%',
    },
    bottomPanel: {
        height: '30%',
        alignItems: 'center',
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: 15,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    genButton: {
        marginTop: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1EB1FC',
        width: '90%',
        borderRadius: 10,
    }
})

export default AgingScreen;