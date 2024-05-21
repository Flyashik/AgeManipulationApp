import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const SettingsScreen: React.FC = () => {
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
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '50%', gap: 15}}>
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