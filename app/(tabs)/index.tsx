import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'important' | 'normal' | 'reminder';
}

export default function DashboardScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Dashboard focused, reloading notes...');
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      console.log('Stored notes:', storedNotes);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        console.log('Parsed notes:', parsedNotes);
        setNotes(parsedNotes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    }
  };

  const handlePressCreat = () => {
    router.push('/Creat');
  };

  const handleNotePress = (note: Note) => {
    router.push({
      pathname: '/Note',
      params: { noteId: note.id }
    } as any);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'important':
        return '#F45b69'; // Rouge pour important
      case 'normal':
        return '#456990'; // Bleu pour normal
      case 'reminder':
        return '#FFD4CA'; // Rose clair pour pense-bête
      default:
        return '#456990';
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes ({notes.length})</Text>
      
      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No notes created yet</Text>
          <Text style={styles.emptySubtext}>Create your first note by tapping the + button</Text>
        </View>
      ) : (
        <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={[styles.noteCard, { borderLeftColor: getPriorityColor(note.priority) }]}
              onPress={() => handleNotePress(note)}
            >
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteDate}>{formatDate(note.date)}</Text>
              </View>
              <Text style={styles.noteContent}>{truncateText(note.content)}</Text>
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(note.priority) }]} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handlePressCreat}
        testID="creatbutton"
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#114B5F',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7EE4EC',
    marginBottom: 30,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: '#7EE4EC',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#FFD4CA',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#7EE4EC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#114B5F',
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    color: '#456990',
  },
  noteContent: {
    fontSize: 14,
    color: '#114B5F',
    lineHeight: 20,
  },
  priorityIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#F45b69',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});