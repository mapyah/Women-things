import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { signup } from '../services/user.service'; 
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SignUpScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!userName || !userMail || !userPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      await signup(userName, userMail, userPassword);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#f5f6fa' }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userMail}
          onChangeText={setUserMail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputInner}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={userPassword}
            onChangeText={setUserPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((s) => !s)}
            style={styles.eyeButton}
          >
            <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.6 }]} 
          onPress={handleSignUp} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    height: 50,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  inputInner: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#6200ee',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#6200ee',
    fontWeight: '500',
    marginTop: 12,
  },
});
