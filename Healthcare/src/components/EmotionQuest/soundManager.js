// Sound Manager for Emotion Quest
class SoundManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    
    // Initialize sounds (using data URIs for simple beep sounds)
    this.initSounds();
  }

  initSounds() {
    // Create simple sound effects using Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Load music tracks (you can replace these with actual audio files)
    this.musicTracks = {
      menu: this.createTone(440, 0.3, 'sine'),
      gameplay: this.createTone(523, 0.3, 'sine'),
      victory: this.createTone(659, 0.5, 'sine'),
    };
  }

  // Create simple tones for sound effects
  createTone(frequency, duration, type = 'sine') {
    return { frequency, duration, type };
  }

  playTone(frequency, duration = 0.1, type = 'sine', volume = this.sfxVolume) {
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sound effects
  playClick() {
    this.playTone(800, 0.05, 'square', 0.3);
  }

  playCorrect() {
    // Happy ascending notes
    this.playTone(523, 0.1, 'sine', 0.4); // C
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.4), 100); // E
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.5), 200); // G
  }

  playIncorrect() {
    // Gentle descending notes
    this.playTone(400, 0.15, 'sine', 0.3);
    setTimeout(() => this.playTone(300, 0.2, 'sine', 0.3), 150);
  }

  playXPGain() {
    // Quick rising pitch
    this.playTone(600, 0.05, 'sine', 0.4);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 0.4), 50);
  }

  playLevelUp() {
    // Victory fanfare
    this.playTone(523, 0.1, 'sine', 0.5); // C
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.5), 100); // E
    setTimeout(() => this.playTone(784, 0.1, 'sine', 0.5), 200); // G
    setTimeout(() => this.playTone(1047, 0.3, 'sine', 0.6), 300); // High C
  }

  playBadgeUnlock() {
    // Magical sparkle sound
    this.playTone(1000, 0.05, 'sine', 0.4);
    setTimeout(() => this.playTone(1200, 0.05, 'sine', 0.4), 50);
    setTimeout(() => this.playTone(1400, 0.1, 'sine', 0.5), 100);
    setTimeout(() => this.playTone(1600, 0.15, 'sine', 0.5), 200);
  }

  playSceneTransition() {
    // Soft whoosh
    this.playTone(400, 0.1, 'sine', 0.3);
    setTimeout(() => this.playTone(600, 0.1, 'sine', 0.2), 80);
  }

  playChapterStart() {
    // Epic start
    this.playTone(523, 0.15, 'square', 0.4);
    setTimeout(() => this.playTone(659, 0.15, 'square', 0.4), 150);
    setTimeout(() => this.playTone(784, 0.2, 'square', 0.5), 300);
  }

  playChapterComplete() {
    // Triumphant melody
    this.playTone(523, 0.1, 'sine', 0.5);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.5), 100);
    setTimeout(() => this.playTone(784, 0.1, 'sine', 0.5), 200);
    setTimeout(() => this.playTone(1047, 0.15, 'sine', 0.6), 300);
    setTimeout(() => this.playTone(1319, 0.2, 'sine', 0.6), 450);
  }

  playTyping() {
    // Subtle typing click
    this.playTone(1000, 0.02, 'square', 0.1);
  }

  playHover() {
    // Soft hover sound
    this.playTone(700, 0.03, 'sine', 0.2);
  }

  // Background music with oscillating tones
  playBackgroundMusic(track = 'menu') {
    if (this.isMuted || !this.audioContext) return;
    
    this.stopBackgroundMusic();
    
    // Create ambient background music
    const frequencies = {
      menu: [261.63, 329.63, 392.00, 523.25], // C E G C
      gameplay: [293.66, 349.23, 440.00, 587.33], // D F A D
      victory: [523.25, 659.25, 783.99, 1046.50], // C E G C (higher)
      circus: [783.99, 987.77, 783.99, 659.25, 783.99, 987.77, 1174.66, 987.77], // G-B-G-E-G-B-D-B (playful circus)
      lifequest: [392.00, 493.88, 587.33, 493.88, 392.00, 587.33], // G-B-D-B-G-D (motivational)
    };

    const notes = frequencies[track] || frequencies.menu;
    let noteIndex = 0;

    // Faster tempo for circus music
    const tempo = track === 'circus' ? 500 : 2000;
    const duration = track === 'circus' ? 0.4 : 2;

    const playNote = () => {
      if (this.isMuted) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = notes[noteIndex];
      oscillator.type = track === 'circus' ? 'square' : 'sine';
      
      // Fade in and out
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.3, this.audioContext.currentTime + (track === 'circus' ? 0.1 : 0.5));
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);

      noteIndex = (noteIndex + 1) % notes.length;

      // Schedule next note
      this.musicTimeout = setTimeout(playNote, tempo);
    };

    playNote();
  }

  stopBackgroundMusic() {
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    }
    return this.isMuted;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
