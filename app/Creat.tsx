import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'important' | 'normal' | 'reminder';
}

export default function CreatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'important' | 'normal' | 'reminder'>('normal');
  const [isEditing, setIsEditing] = useState(false);
  const [noteId, setNoteId] = useState('');

  useEffect(() => {
    if (params.noteId) {
      setIsEditing(true);
      setNoteId(params.noteId as string);
      setTitle(params.title as string || '');
      setContent(params.content as string || '');
      setPriority((params.priority as 'important' | 'normal' | 'reminder') || 'normal');
    }
  }, [params]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      console.log('Current stored notes:', storedNotes); // Debug log
      
      const notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
      console.log('Current notes array:', notes); // Debug log
      
      const newNote: Note = {
        id: isEditing ? noteId : Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        date: isEditing ? (notes.find(n => n.id === noteId)?.date || new Date().toISOString()) : new Date().toISOString(),
        priority
      };

      console.log('New note to save:', newNote); // Debug log

      let updatedNotes: Note[];
      if (isEditing) {
        updatedNotes = notes.map(note => note.id === noteId ? newNote : note);
      } else {
        updatedNotes = [...notes, newNote];
      }

      console.log('Updated notes array:', updatedNotes); // Debug log

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      console.log('Notes saved successfully'); // Debug log
      
      Alert.alert('Success', 'Note saved successfully!', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const getPriorityColor = (priorityValue: string) => {
    switch (priorityValue) {
      case 'important':
        return '#F45b69';
      case 'normal':
        return '#456990';
      case 'reminder':
        return '#FFD4CA';
      default:
        return '#456990';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Note' : 'New Note'}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter note title"
              placeholderTextColor="#456990"
              maxLength={100}
            />
          </View>

          {/* Priority Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {(['important', 'normal', 'reminder'] as const).map((priorityOption) => (
                <TouchableOpacity
                  key={priorityOption}
                  style={[
                    styles.priorityButton,
                    { backgroundColor: getPriorityColor(priorityOption) },
                    priority === priorityOption && styles.priorityButtonActive
                  ]}
                  onPress={() => setPriority(priorityOption)}
                >
                  <Text style={styles.priorityButtonText}>
                    {priorityOption === 'important' ? 'Important' : 
                     priorityOption === 'normal' ? 'Normal' : 'Reminder'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              placeholder="Enter note content"
              placeholderTextColor="#456990"
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#114B5F',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#7EE4EC',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7EE4EC',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7EE4EC',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#7EE4EC',
    borderWidth: 1,
    borderColor: '#456990',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#114B5F',
  },
  contentInput: {
    backgroundColor: '#7EE4EC',
    borderWidth: 1,
    borderColor: '#456990',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#114B5F',
    height: 200,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  priorityButtonActive: {
    borderColor: '#FFFFFF',
  },
  priorityButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#F45b69',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});