import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, ScrollView 
} from 'react-native';
import { addUser, updateUser } from '../services/user.service';

export default function AddEditUserScreen({ route, navigation }) {
  const existingUser = route.params?.user; // If null, we are in "Add" mode
  const isEdit = !!existingUser;

  const [userName, setUserName] = useState(existingUser?.userName || '');
  const [userMail, setUserMail] = useState(existingUser?.userMail || '');
  const [userPassword, setUserPassword] = useState(''); // Only needed for new users
  const [role, setRole] = useState(existingUser?.role || 'user');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!userName || !userMail || (!isEdit && !userPassword)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const userData = { userName, userMail, role };
      if (!isEdit) userData.userPassword = userPassword;

      if (isEdit) {
        await updateUser(existingUser._id, userData);
        Alert.alert('Success', 'User updated successfully');
      } else {
        await addUser(userData);
        Alert.alert('Success', 'User created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit User' : 'Add New User'}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          style={styles.input} 
          value={userName} 
          onChangeText={setUserName} 
          placeholder="John Doe" 
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput 
          style={styles.input} 
          value={userMail} 
          onChangeText={setUserMail} 
          keyboardType="email-address" 
          autoCapitalize="none"
          placeholder="john@example.com"
        />

        {!isEdit && (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              value={userPassword} 
              onChangeText={setUserPassword} 
              secureTextEntry 
              placeholder="Min 6 characters"
            />
          </>
        )}

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleRow}>
          {['user', 'admin'].map((r) => (
            <TouchableOpacity 
              key={r} 
              style={[styles.roleButton, role === r && styles.roleButtonActive]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{isEdit ? 'Update' : 'Create'} User</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  form: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  roleRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  roleButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  roleButtonActive: { backgroundColor: '#6200ee', borderColor: '#6200ee' },
  roleText: { color: '#666', fontWeight: 'bold' },
  roleTextActive: { color: '#fff' },
  submitButton: { backgroundColor: '#6200ee', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});