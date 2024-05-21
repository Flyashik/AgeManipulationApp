import * as React from 'react';
import {FlatList, Image, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {useEffect, useState} from "react";
import * as FileSystem from "expo-file-system";

const HomeScreen: React.FC = () => {
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
            <Image source={{ uri: item }} style={styles.imageItem} />
        );
    };

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
        backgroundColor: '#fff',
    },
    recentBlock: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 100, paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    recentHeader: {
        flexDirection: 'row',
    },
    imageGrid: {
        marginTop: 10,
    },
    imageItem: {
        width: 100,
        height: 100,
        margin: 5,
        backgroundColor: '#e0e0e0'
    },
});

export default HomeScreen;