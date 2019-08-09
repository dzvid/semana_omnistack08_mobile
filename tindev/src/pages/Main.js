import React from 'react';
import { View, Image } from 'react-native';

import logo from '../assets/logo.png';

export default function Main(){
    return (
        <View>
            <Image source={logo}/>
        </View>
    );
}