import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, TextInput, View, LogBox } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { useEffect, useState } from 'react';

// para não da erro de log no front
LogBox.ignoreLogs(['new NativeEventEmitter']);

export default function App() {
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);

  function onSpeechResults({ value }: SpeechResultsEvent) {
    console.log(value);
    const text = value ?? [];
    setSearch(text.join().replace(',', ' '));
  }

  async function handleListening() {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        setSearch('');
        await Voice.start('pt-BR');
        setIsListening(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder={isListening ? 'Gravando...' : 'Pesquisar...'}
          onChangeText={setSearch}
          editable={!isListening}
          value={search}
        />

        <Pressable style={styles.button} onPress={handleListening}>
          <Feather
            name={isListening ? 'pause' : 'mic'}
            color="#FFF"
            size={24}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 52,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 54,
    padding: 16,
    fontSize: 16,
    borderRadius: 12,
    backgroundColor: '#D9E6EB',
  },
  button: {
    height: 54,
    width: 54,
    borderRadius: 12,
    backgroundColor: '#6F4AE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
