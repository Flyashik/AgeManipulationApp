import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as FileSystem from 'expo-file-system';

const SettingsScreen: React.FC = () => {
    const clearCache = async () => {
        const documentDirectory = FileSystem.documentDirectory;

        try {
            const files = await FileSystem.readDirectoryAsync(documentDirectory!);

            for (const file of files) {
                const filePath = `${documentDirectory}${file}`;
                await FileSystem.deleteAsync(filePath, { idempotent: true });
            }
            console.log('Document directory cleared successfully.');
        } catch (error) {
            console.error('Error clearing document directory:', error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Настройки</Text>
            </View>
            <View style={styles.content}>
                <BouncyCheckbox
                    size={25}
                    fillColor="#1EB1FC"
                    textComponent={(<Text style={{fontSize: 16, fontWeight: '500', marginLeft: 15 }}>Автоматически сохранять в галерею</Text>)}
                    iconStyle={{ borderColor: "#1EB1FC", borderRadius: 5 }}
                    innerIconStyle={{ borderWidth: 2, borderRadius: 5 }}
                    onPress={(isChecked: boolean) => {}}
                />
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '50%', gap: 15}} onPress={()=> clearCache()}>
                    <Ionicons name="trash-outline" color="red" size={24} />
                    <Text style={{ fontSize: 16, color: 'red', fontWeight: '500' }}>Очистить кэш</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        marginTop: 80,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    content: {
        width: '100%',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
        marginTop: 10,
    }
});