import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

export default function Main({ navigation }){
    // Pega o parametro passado pela outra pagina
    const id = navigation.getParam('user');

    // Estado do componente
    const [users, setUsers] = useState([]);

    // Faz a chamada pra api assim que o componente é carregado na tela
    useEffect(() => {
        // Busco os usuarios disponiveis que ainda podem receber curtidas
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            });
            //Salvo a lista de usuarios no estado do componente
            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    // Trata o like dado a um usuario, envia a informação pra api
    async function handleLike() {
        // Pego o primeiro usuario que pode receber like e salvo o restante para uso posterior
        const [userTarget, ...rest] = users;

        await api.post(`/devs/${userTarget._id}/likes`, null, {
            headers: { user: id }
        });

        setUsers(rest);
    }

    // Trata o dislike dado a um usuario, envia a informação pra api
    async function handleDislike() {
        // Pego o primeiro usuario que pode receber like e salvo o restante para uso posterior
        const [userTarget, ...rest] = users;

        await api.post(`/devs/${userTarget._id}/dislikes`, null, {
            headers: { user: id }
        });

        setUsers(rest);
    }

    // Trata o logout do usuario, remove o usuario logado do asyncstorage
    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={logo} style={styles.logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                { users.length === 0
                ? <Text style={styles.empty}>Acabou :(</Text>
                : (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
        {/* Se houver usuários, mostra os botões de like e dislike */}
        { users.length > 0 && (
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleDislike}>
                    <Image source={dislike} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLike}>
                    <Image source={like} />
                </TouchableOpacity>
            </View>
        )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    logo: {
        marginTop: 30
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    }

});
