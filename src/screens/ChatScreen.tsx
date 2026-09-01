import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';

export const ChatScreen: React.FC = () => {
  const { screenParams, getBookingMessages, sendMessage, goBack, user, role } = useApp();
  const [inputText, setInputText] = useState('');

  const bookingId = screenParams?.bookingId || 'FIX-1002';
  const providerName = screenParams?.providerName || 'Service Professional';

  const chatMessages = getBookingMessages(bookingId);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(bookingId, inputText);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{providerName}</Text>
          <Text style={styles.headerSub}>Booking ID: {bookingId}</Text>
        </View>
      </View>

      <FlatList
        data={chatMessages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isMyMessage = item.senderRole === role;
          return (
            <View style={[styles.messageBubbleContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
              <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble]}>
                <Text style={[styles.senderName, isMyMessage ? styles.myText : styles.otherText]}>
                  {item.senderName} ({item.senderRole})
                </Text>
                <Text style={[styles.messageText, isMyMessage ? styles.myText : styles.otherText]}>
                  {item.text}
                </Text>
                <Text style={[styles.messageTime, isMyMessage ? styles.myTimeText : styles.otherTimeText]}>
                  {item.createdAt}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn: { marginRight: 16 },
  backText: { fontSize: 15, fontWeight: '600', color: '#2563EB' },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  headerSub: { fontSize: 12, color: '#64748B' },
  messageList: { padding: 16 },
  messageBubbleContainer: { marginBottom: 12, width: '100%', flexDirection: 'row' },
  myMessageContainer: { justifyContent: 'flex-end' },
  otherMessageContainer: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  myMessageBubble: { backgroundColor: '#2563EB', borderBottomRightRadius: 2 },
  otherMessageBubble: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 2 },
  senderName: { fontSize: 10, fontWeight: '700', marginBottom: 2 },
  messageText: { fontSize: 14, lineHeight: 20 },
  messageTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  myText: { color: '#FFFFFF' },
  otherText: { color: '#0F172A' },
  myTimeText: { color: '#E0E7FF' },
  otherTimeText: { color: '#94A3B8' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  textInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#0F172A', maxHeight: 100 },
  sendButton: { marginLeft: 10, backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }
});
