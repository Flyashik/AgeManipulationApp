import * as React from 'react';
import {FlatList, Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {useEffect, useState} from "react";
import * as FileSystem from "expo-file-system";
import {CommonActions, useNavigation} from "@react-navigation/native";

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();

    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
                const imageUris = files.map(file => `${FileSystem.documentDirectory}${file}`);
                setImages(imageUris);
            } catch (error) {
                console.error("Error loading images: ", error);
            }
        };

        loadImages();
    }, []);

    const renderImageItem: ListRenderItem<string> = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigateToAging(item)} style={{padding: 2}}>
                <Image source={{ uri: item }} style={styles.imageItem} />
            </TouchableOpacity>
        );
    };

    const navigateToAging = async (item: string) => {
        const base64 = await FileSystem.readAsStringAsync(item, {
            encoding: FileSystem.EncodingType.Base64,
        });

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Aging', params: { imageUri: item, base64: base64 } }],
            })
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.recentBlock}>
                <View style={styles.recentHeader}>
                    <Ionicons name="refresh" size={24} />
                    <Text style={{fontSize: 20, fontWeight: '600' }}>Недавнее</Text>
                </View>
                <FlatList
                    data={images}
                    renderItem={renderImageItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    style={styles.imageGrid}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    recentBlock: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 100, paddingHorizontal: 5,
        backgroundColor: '#fff',
    },
    recentHeader: {
        width: '100%',
        flexDirection: 'row',
    },
    imageGrid: {
        marginTop: 10,
        paddingHorizontal: 5,
        gap: 5,
    },
    imageItem: {
        width: 120,
        height: 120,
        marginTop: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
});

export default HomeScreen;