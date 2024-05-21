import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {Pressable, StatusBar, StyleSheet} from "react-native";
import ImagePicker, {ImagePickerRef} from "../components/ImagePicker";
import {useRef} from "react";
import CameraScreen from "../screens/CameraScreen";
import {createStackNavigator} from "@react-navigation/stack";
import AgingScreen from "../screens/AgingScreen";

export type RootStackParamList = {
    Main: undefined;
    Camera: undefined;
    Aging: { imageUri: string, base64: string };
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName="Main"
            >
                <Stack.Screen name="Main" component={TabNavigator}/>
                <Stack.Screen name="Camera" component={CameraScreen}/>
                <Stack.Screen name="Aging" component={AgingScreen} />
            </Stack.Navigator>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
        </NavigationContainer>
    );
};

const TabNavigator: React.FC = () => {
    const imagePickerRef = useRef<ImagePicker>(null);

    function openModal() {
        imagePickerRef.current?.handleOpenModal();
    }

    return (
        <>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    headerShown: false,
                    tabBarIcon: ({focused}) => {
                        if (route.name === 'Home') {
                            return <Ionicons name={focused ? 'home' : 'home-outline'} size={24}/>;
                        } else if (route.name === 'Settings') {
                            return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24}/>;
                        }

                        return <Ionicons name={'home'} size={24}/>;
                    },
                    tabBarLabel: ''
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen}/>
                <Tab.Screen name="Settings" component={SettingsScreen}/>
            </Tab.Navigator>
            <ImagePickerRef ref={imagePickerRef}/>
            <Pressable onPress={openModal} style={styles.button}>
                <Ionicons name={'add'} size={45} color="white"/>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 24,
        backgroundColor: '#4E81DA',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.17,
        shadowRadius: 2.54,
        elevation: 3
    }
})

export default Navigation;