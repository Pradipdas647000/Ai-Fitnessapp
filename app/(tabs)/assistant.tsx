import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { theme } from '@/constants/theme';
import { Send, Camera, Mic, ChevronDown } from 'lucide-react-native';
import AIMessageBubble from '@/components/AIMessageBubble';
import UserMessageBubble from '@/components/UserMessageBubble';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGeminiResponse, getGeminiResponseWithBase64 } from '@/utils/gemini';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null); // State to store image URI
  const scrollViewRef = useRef<ScrollView>(null);

  // Define the type for conversation messages
  type ConversationMessage = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    imageUri?: string | null;
  };

  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: '1',
      text: "Hi there! I'm your AI fitness assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(Date.now() - 120000)
    }
  ]);

  const handleSendMessage = async () => {
    if (message.trim() === '' && !imageUri) return;

    // Create user message with image if available
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      text: message || (imageUri ? 'Image uploaded' : ''),
      isUser: true,
      timestamp: new Date(),
      imageUri: imageUri // Include the image if one was captured
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      let aiResponse;
      
      // If we have an image, we need to get the base64 data
      if (imageUri) {
        try {
          // Try to get base64 data from the image using FileSystem
          const FileSystem = await import('expo-file-system');
          
          // Check if the file exists
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          
          if (fileInfo.exists) {
            // Read the image file as base64
            const base64Data = await FileSystem.readAsStringAsync(imageUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            
            console.log('Got base64 data for image, length:', base64Data.length);
            aiResponse = await getGeminiResponseWithBase64(message || "Analyze this image and provide feedback.", base64Data);
          } else {
            console.log('File does not exist, using file URI');
            aiResponse = await getGeminiResponse(message || "Analyze this image and provide feedback.", imageUri);
          }
        } catch (error) {
          console.error('Error getting base64 data:', error);
          // Fall back to using the URI
          aiResponse = await getGeminiResponse(message || "Analyze this image and provide feedback.", imageUri);
        }
      } else {
        // Just text, no image
        aiResponse = await getGeminiResponse(message);
      }
      
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);
      
      // Clear the image URI after sending
      setImageUri(null);
    } catch (e) {
      console.error('Error contacting Gemini AI:', e);
      setConversation(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, there was an error contacting Gemini AI.',
          isUser: false,
          timestamp: new Date()
        } as ConversationMessage
      ]);
    }
    setIsLoading(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

 const handleCameraPress = async () => {
  console.log('Camera button pressed');
  
  // Request camera permissions
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    console.error('Camera permission not granted');
    alert('Sorry, we need camera permissions to make this work!');
    return;
  }
  
  try {
    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      base64: true, // Include base64 data
    });
    
    console.log('Image picker result:', result);
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log('Image captured successfully');
      const asset = result.assets[0];
      const uri = asset.uri;
      
      console.log('Image details:', {
        uri: uri,
        width: asset.width,
        height: asset.height,
      });
      
      if (uri) {
        setImageUri(uri); // Store the image URI
        
        // Add the image message to the conversation
        const imageMessage: ConversationMessage = {
          id: Date.now().toString(),
          text: 'Image uploaded',
          isUser: true,
          timestamp: new Date(),
          imageUri: uri
        };
        setConversation(prev => [...prev, imageMessage]);
        
        // Show loading indicator
        setIsLoading(true);
        
        try {
          // Send the image to Gemini with a default prompt
          const prompt = "Analyze this image and provide feedback.";
          console.log('Sending image to Gemini API with URI:', uri);
          
          // Use the base64 data directly if available
          const base64Data = asset.base64;
          let aiResponse;
          
          if (base64Data) {
            console.log('Using base64 data, length:', base64Data.length);
            aiResponse = await getGeminiResponseWithBase64(prompt, base64Data);
          } else {
            console.log('Using file URI instead of base64');
            aiResponse = await getGeminiResponse(prompt, uri);
          }
          
          // Add AI response to conversation
          const aiMessage: ConversationMessage = {
            id: (Date.now() + 1).toString(),
            text: aiResponse,
            isUser: false,
            timestamp: new Date()
          };
          setConversation(prev => [...prev, aiMessage]);
        } catch (e) {
          console.error('Error sending image to Gemini:', e);
          setConversation(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              text: 'Sorry, there was an error analyzing the image.',
              isUser: false,
              timestamp: new Date()
            } as ConversationMessage
          ]);
        }
        
        setIsLoading(false);
        
        // Scroll to the bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        console.error('Image URI is undefined or null');
      }
    } else {
      console.log('User cancelled image picker or no image selected');
    }
  } catch (error) {
    console.error('Error using image picker:', error);
    alert('There was an error with the camera. Please try again.');
  }
};


  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Assistant</Text>
          <TouchableOpacity style={styles.topicSelector}>
            <Text style={styles.topicText}>General Fitness</Text>
            <ChevronDown size={16} color={theme.colors.neutral[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef} 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {conversation.map((msg) => (
  msg.isUser ? (
    <UserMessageBubble
      key={msg.id}
      message={msg.text}
      timestamp={msg.timestamp}
      imageUri={msg.imageUri} // Ensure this is correctly passed
    />
  ) : (
    <AIMessageBubble
      key={msg.id}
      message={msg.text}
      timestamp={msg.timestamp}
    />
  )
))}

          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>AI is typing...</Text>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          {/* Camera button with indicator when image is selected */}
          <TouchableOpacity 
            style={[
              styles.cameraButton,
              imageUri ? styles.cameraButtonActive : null
            ]} 
            onPress={handleCameraPress}
          >
            <Camera size={22} color={imageUri ? theme.colors.primary[600] : theme.colors.neutral[600]} />
          </TouchableOpacity>
          
          {/* Show selected image preview */}
          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.input}
              placeholder={imageUri ? "Ask about this image..." : "Ask me anything..."}
              placeholderTextColor={theme.colors.neutral[400]}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            
            <TouchableOpacity style={styles.micButton}>
              <Mic size={20} color={theme.colors.neutral[600]} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              message.trim() === '' && !imageUri && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={message.trim() === '' && !imageUri}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  topicSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.full,
  },
  topicText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
    marginRight: theme.spacing.xs,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: theme.spacing.md,
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  loadingText: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[500],
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  cameraButtonActive: {
    backgroundColor: theme.colors.primary[100],
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    width: '100%',
    height: 100,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    maxHeight: 100,
  },
  micButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.neutral[400],
  },
});
