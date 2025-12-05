import Voice from '@react-native-voice/voice';
import {SpeechRecognitionResult, SpeechRecognitionError} from '@/types';

export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private isListening = false;
  private onResult?: (result: SpeechRecognitionResult) => void;
  private onError?: (error: SpeechRecognitionError) => void;
  private onStart?: () => void;
  private onEnd?: () => void;

  private constructor() {
    this.initializeVoice();
  }

  public static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  private initializeVoice(): void {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
  }

  private onSpeechStart = (): void => {
    this.isListening = true;
    this.onStart?.();
  };

  private onSpeechEnd = (): void => {
    this.isListening = false;
    this.onEnd?.();
  };

  private onSpeechError = (error: any): void => {
    this.isListening = false;
    this.onError?.({
      message: error.error?.message || 'Speech recognition error',
      code: error.error?.code,
    });
  };

  private onSpeechResults = (event: any): void => {
    const results = event.value;
    if (results && results.length > 0) {
      this.onResult?.({
        text: results[0],
        isFinal: true,
        confidence: 0.9, // Default confidence
      });
    }
  };

  private onSpeechPartialResults = (event: any): void => {
    const results = event.value;
    if (results && results.length > 0) {
      this.onResult?.({
        text: results[0],
        isFinal: false,
        confidence: 0.7, // Lower confidence for partial results
      });
    }
  };

  public async startListening(options?: {
    language?: string;
    partialResults?: boolean;
    timeout?: number;
  }): Promise<void> {
    if (this.isListening) {
      await this.stopListening();
    }

    try {
      const voiceOptions = {
        partialResults: options?.partialResults ?? true,
        language: options?.language ?? 'en-US',
        timeout: options?.timeout ?? 5000,
      };

      await Voice.start(voiceOptions.language, voiceOptions);
    } catch (error) {
      throw new Error(`Failed to start speech recognition: ${error}`);
    }
  }

  public async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.warn('Error stopping speech recognition:', error);
    }
  }

  public async cancelListening(): Promise<void> {
    try {
      await Voice.cancel();
      this.isListening = false;
    } catch (error) {
      console.warn('Error canceling speech recognition:', error);
    }
  }

  public setOnResult(callback: (result: SpeechRecognitionResult) => void): void {
    this.onResult = callback;
  }

  public setOnError(callback: (error: SpeechRecognitionError) => void): void {
    this.onError = callback;
  }

  public setOnStart(callback: () => void): void {
    this.onStart = callback;
  }

  public setOnEnd(callback: () => void): void {
    this.onEnd = callback;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      return await Voice.isAvailable();
    } catch (error) {
      return false;
    }
  }

  public async destroy(): Promise<void> {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
    } catch (error) {
      console.warn('Error destroying speech recognition:', error);
    }
  }
}

// Export singleton instance
export const speechRecognition = SpeechRecognitionService.getInstance();