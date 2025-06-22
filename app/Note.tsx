import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'important' | 'normal' | 'reminder';
}

export default function NoteScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    console.log('NoteScreen mounted, noteId:', noteId); // Debug log
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    try {
      console.log('Loading note with ID:', noteId); // Debug log
      const storedNotes = await AsyncStorage.getItem('notes');
      console.log('Stored notes in NoteScreen:', storedNotes); // Debug log
      
      if (storedNotes) {
        const notes: Note[] = JSON.parse(storedNotes);
        console.log('All notes:', notes); // Debug log
        const foundNote = notes.find(n => n.id === noteId);
        console.log('Found note:', foundNote); // Debug log
        setNote(foundNote || null);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const handleEdit = () => {
    if (note) {
      router.push({
        pathname: '/Creat',
        params: { 
          noteId: note.id,
          title: note.title,
          content: note.content,
          priority: note.priority
        }
      });
    }
  };

  const handleDelete = () => {
    console.log('Delete button pressed, noteId:', noteId); // Debug log
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting deletion process...'); // Debug log
              const storedNotes = await AsyncStorage.getItem('notes');
              console.log('Stored notes before deletion:', storedNotes); // Debug log
              
              if (storedNotes) {
                const notes: Note[] = JSON.parse(storedNotes);
                console.log('Notes array before deletion:', notes); // Debug log
                console.log('Looking for note with ID:', noteId); // Debug log
                
                const noteToDelete = notes.find(n => n.id === noteId);
                console.log('Note to delete:', noteToDelete); // Debug log
                
                const updatedNotes = notes.filter(n => n.id !== noteId);
                console.log('Notes array after deletion:', updatedNotes); // Debug log
                
                await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
                console.log('Notes saved after deletion'); // Debug log
                
                router.replace('/(tabs)');
              } else {
                console.log('No stored notes found'); // Debug log
                Alert.alert('Error', 'No notes found to delete');
              }
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'important':
        return 'Important';
      case 'normal':
        return 'Normal';
      case 'reminder':
        return 'Reminder';
      default:
        return 'Normal';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Note not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Note</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.noteCard, { borderLeftColor: getPriorityColor(note.priority) }]}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(note.priority) }]}>
              <Text style={styles.priorityText}>{getPriorityText(note.priority)}</Text>
            </View>
          </View>
          
          <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
          
          <Text style={styles.noteContent}>{note.content}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
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
  noteCard: {
    backgroundColor: '#7EE4EC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#114B5F',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  noteDate: {
    fontSize: 14,
    color: '#456990',
    marginBottom: 16,
  },
  noteContent: {
    fontSize: 16,
    color: '#114B5F',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#456990',
  },
  deleteButton: {
    backgroundColor: '#F45b69',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#F45b69',
    textAlign: 'center',
    marginTop: 100,
  },
}); 