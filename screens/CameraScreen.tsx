import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {AutoFocus, Camera, CameraCapturedPicture, CameraType, FlashMode} from "expo-camera";
import {Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {PinchGestureHandler, PinchGestureHandlerGestureEvent, State} from "react-native-gesture-handler";

const MAX_ZOOM = 0.2;

const CameraScreen: React.FC = () => {
  const navigation = useNavigation();

  const [hasCameraPermission, setHasCameraPermission] = React.useState(false);
  const [image, setImage] = React.useState<CameraCapturedPicture | null>(null);
  const [type, setType] = React.useState<CameraType>(CameraType.back);
  const [flash, setFlash] = React.useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [focusSquare, setFocusSquare] = useState({visible: false, x: 0, y: 0});
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.granted);
      if (!cameraStatus.granted) {
        navigation.goBack();
      }
    })();

    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const handleTouch = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    setFocusSquare({visible: true, x: locationX, y: locationY});

    // Hide the square after 1 second
    setTimeout(() => {
      setFocusSquare((prevState) => ({...prevState, visible: false}));
    }, 1000);

    setIsRefreshing(true);
  };

  const takePicture = async () => {
    if (cameraRef && cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({base64: true});
        setImage(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const changeCameraType = async () => {
    setType((prevState) => prevState === CameraType.back ? CameraType.front : CameraType.back);
  }

  const handlePinch = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const scale = event.nativeEvent.scale;
      setZoom((prevZoom) => {
        let newZoom;
        if (scale > 1) {
          newZoom = prevZoom + (scale - 1) * 0.001;
        } else {
          newZoom = prevZoom - (1 - scale) * 0.01;
        }
        if (newZoom < 0) newZoom = 0;
        if (newZoom > MAX_ZOOM) newZoom = MAX_ZOOM;
        return newZoom;
      });
    }
  };

  const navigateToAging = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Aging', params: {imageUri: image?.uri, base64: image?.base64}}],
      })
    );
  }

  return (
    <View style={styles.container}>
      {!image ?
        <PinchGestureHandler onGestureEvent={handlePinch}>
          <>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              flashMode={flash}
              type={type}
              zoom={zoom}
              ratio={'1:1'}
              autoFocus={!isRefreshing ? AutoFocus.on : AutoFocus.off}
              onTouchEnd={handleTouch}
            />
            {(() => {
              if (flash === FlashMode.off) {
                return (
                  <TouchableOpacity onPress={() => setFlash(FlashMode.auto)}
                                    style={{
                                      ...styles.flashButton,
                                      borderColor: '#fff',
                                      borderWidth: 1
                                    }}>
                    <Ionicons name="flash-off" size={24} color="white"/>
                  </TouchableOpacity>
                )
              } else if (flash === FlashMode.auto) {
                return (
                  <TouchableOpacity onPress={() => setFlash(FlashMode.on)}
                                    style={{
                                      ...styles.flashButton,
                                      borderColor: '#fff',
                                      borderWidth: 1
                                    }}>
                    <Ionicons name="flash" size={24} color="white"/>
                  </TouchableOpacity>
                )
              } else {
                return (
                  <TouchableOpacity onPress={() => setFlash(FlashMode.off)} style={{
                    ...styles.flashButton,
                    borderColor: '#fff',
                    borderWidth: 1,
                    backgroundColor: '#fff'
                  }}>
                    <Ionicons name="flash" size={24} color="black"/>
                  </TouchableOpacity>
                )
              }
            })()}
            <View style={styles.bottomPanel}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                <Text style={{color: '#fff', fontSize: 18}}>Отменить</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePicture} style={styles.pictureButton}>
                <Ionicons name="radio-button-on" size={100} color="white"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={changeCameraType} style={{
                borderRadius: 50,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: 10,
                marginLeft: 'auto',
                marginRight: 25
              }}>
                <Ionicons name="sync-outline" size={30} color="white"/>
              </TouchableOpacity>
            </View>
            {focusSquare.visible && (
              <View
                style={[
                  styles.focusSquare,
                  {top: focusSquare.y - 25, left: focusSquare.x - 25},
                ]}
              />
            )}
          </>
        </PinchGestureHandler> :
        <>
          <View style={{height: '15%', backgroundColor: '#000', flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setImage(null)}
                              style={{marginTop: 'auto', marginBottom: 15, marginLeft: 15}}>
              <Ionicons name="close" size={40} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToAging()}
                              style={{marginTop: 'auto', marginBottom: 15, marginLeft: 'auto', marginRight: 15}}>
              <Ionicons name="arrow-forward-outline" size={40} color="white"/>
            </TouchableOpacity>
          </View>
          <Image source={{uri: image.uri!}} style={styles.container} />
          <View style={{height: '13%', backgroundColor: '#000'}}/>
          <StatusBar barStyle="light-content" backgroundColor="white"/>
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    flexDirection: 'column',
  },
  bottomPanel: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  pictureButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 50,
  },
  focusSquare: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: 'yellow',
    backgroundColor: 'transparent',
  },
  flashButton: {
    position: 'absolute',
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    top: 70,
    right: 25,
  }
})

export default CameraScreen;