import React, { useContext } from 'react';
import { Button } from 'react-native';
import { TokenContext } from '../Context/Context'; 

export default function SignOutScreen({ navigation }) {
    const [_, setToken] = useContext(TokenContext); 

    const deconnect = () => {
        setToken(null);
        navigation.navigate('Navigation');
    };

    return <Button title='Sign me out' onPress={deconnect} />;
}
