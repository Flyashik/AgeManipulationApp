import React, {ForwardedRef, forwardRef, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {Text, StyleSheet, Pressable, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Animated, {useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Ionicons} from "@expo/vector-icons";
import {CommonActions, useNavigation} from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerSheet {
    handleOpenModal(): void;
}

export const ImagePickerRef = forwardRef((props, ref: ForwardedRef<ImagePickerSheet>) => (
    <ImagePickerSheet {...props} forwardedRef={ref}/>
));

const ImagePickerSheet: React.FC<{ forwardedRef: ForwardedRef<ImagePickerSheet> }> = ({forwardedRef}) => {
    const navigation = useNavigation();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = ['20%'];
    const active = useSharedValue(false);

    const handleOpenModal = () => {
        active.value = true;
        bottomSheetRef.current?.present();
    }

    const handleCloseModal = () => {
        active.value = false;
        bottomSheetRef.current?.close();
    }

    const rBackdropAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(active.value ? 1 : 0),
        };
    }, []);

    const rBackdropProps = useAnimatedProps(() => {
        return {
            pointerEvents: active.value ? 'auto' : 'none',
        } as any;
    }, [])

    useImperativeHandle(forwardedRef, () => ({
        handleOpenModal: handleOpenModal
    }));

    const openCamera = () => {
        handleCloseModal();
        navigation.navigate('Camera');
    };

    const pickImage = async () => {
        handleCloseModal();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            base64: true,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            navigateToAging({ imageUri: result.assets[0].uri, base64: result.assets[0].base64! });
        }
    };

    const navigateToAging = (image: { imageUri: string, base64: string }) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Aging', params: { imageUri: image?.imageUri, base64: image?.base64 } }],
            })
        );
    };

    return (
        <>
            <Animated.View
                onTouchStart={() => { handleCloseModal() }}
                animatedProps={rBackdropProps}
                style={[
                    {
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    rBackdropAnimatedStyle
                ]}/>
            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                backgroundStyle={{borderRadius: 15}}
                onDismiss={() => { active.value = false }}
            >
                <View style={styles.contentContainer}>
                    <Pressable style={styles.button} onPress={openCamera}>
                        <Ionicons name="camera-outline" size={24} />
                        <Text>Сделать фото</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => pickImage()}>
                        <Ionicons name="images-outline" size={24} />
                        <Text>Выбрать из галереи</Text>
                    </Pressable>
                </View>
            </BottomSheetModal>
        </>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        gap: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});

export default ImagePickerSheet;