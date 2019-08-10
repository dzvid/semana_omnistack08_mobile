import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Platform, KeyboardAvoidingView, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

import api from "../services/api";

import logo from '../assets/images/logo/logo.png';

export default function Login({ navigation }){
    // estado do componente
    const [user, setUser] = useState('');

    useEffect(()=> {
        AsyncStorage.getItem('user').then(user => {
            if(user){
                navigation.navigate('Main', { user });
            }
        })
    }, []);

    async function handleLogin(){
        //  contato a api pra verificar se usuario existe
        const response = await api.post('/devs', {
            username: user
        });
        // se existir, pego o id dele
        const { _id } = response.data;
        
        // Depois que o usuario logar, salvo a informação de login dele
        await AsyncStorage.setItem('user', _id);

        navigation.navigate('Main', { user: _id });
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior="padding"
            enabled={Platform.OS === 'ios'}
        >
            <Image source={logo}/>
            <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
                placeholder="Digite seu usuário no GitHub"
                placeholderTextColor="#999"
                value={user}
                onChangeText={setUser}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});