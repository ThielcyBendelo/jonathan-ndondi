class AudioService {
  constructor() {
    this.context = null;
    this.enabled = this.getStoredPreference();
    this.volume = 0.1; // Volume très bas par défaut
    this.sounds = {};

    // Initialiser le contexte audio de manière lazy
    this.initAudio();
  }

  // Récupérer la préférence stockée
  getStoredPreference() {
    try {
      const stored = localStorage.getItem('audio-enabled');
      return stored !== null ? JSON.parse(stored) : false; // Désactivé par défaut
    } catch {
      return false;
    }
  }

  // Sauvegarder la préférence
  savePreference(enabled) {
    try {
      localStorage.setItem('audio-enabled', JSON.stringify(enabled));
    } catch {
      // Ignore errors
    }
  }

  // Initialiser le contexte audio
  async initAudio() {
    if (!this.enabled) return;

    try {
      // Création du contexte audio moderne
      this.context = new (window.AudioContext || window.webkitAudioContext)();

      // Créer les sons synthétiques
      await this.createSounds();
    } catch (error) {
      console.warn('Audio non supporté:', error);
      this.enabled = false;
    }
  }

  // Créer des sons synthétiques (pas de fichiers externes)
  async createSounds() {
    if (!this.context) return;

    // Son de clic/tap - fréquence douce
    this.sounds.click = this.createTone(800, 0.05, 'sine');

    // Son de hover - très subtil
    this.sounds.hover = this.createTone(1200, 0.03, 'sine');

    // Son de succès - accord majeur
    this.sounds.success = this.createChord([523, 659, 784], 0.2); // Do-Mi-Sol

    // Son d'erreur - dissonant mais doux
    this.sounds.error = this.createChord([400, 450], 0.15);

    // Son de notification - neutre
    this.sounds.notification = this.createTone(900, 0.1, 'triangle');

    // Son de navigation - swoosh
    this.sounds.navigate = this.createSweep(800, 1200, 0.1);
  }

  // Créer un ton simple
  createTone(frequency, duration, waveType = 'sine') {
    return () => {
      if (!this.context || !this.enabled) return;

      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
      oscillator.type = waveType;

      // Envelope ADSR très douce
      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.3,
        this.context.currentTime + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.1,
        this.context.currentTime + duration * 0.3
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        this.context.currentTime + duration
      );

      oscillator.start();
      oscillator.stop(this.context.currentTime + duration);
    };
  }

  // Créer un accord
  createChord(frequencies, duration) {
    return () => {
      if (!this.context || !this.enabled) return;

      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createTone(freq, duration * 0.8, 'sine')();
        }, index * 20); // Léger décalage pour l'accord
      });
    };
  }

  // Créer un sweep (glissement de fréquence)
  createSweep(startFreq, endFreq, duration) {
    return () => {
      if (!this.context || !this.enabled) return;

      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      oscillator.frequency.setValueAtTime(startFreq, this.context.currentTime);
      oscillator.frequency.linearRampToValueAtTime(
        endFreq,
        this.context.currentTime + duration
      );
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.2,
        this.context.currentTime + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        this.context.currentTime + duration
      );

      oscillator.start();
      oscillator.stop(this.context.currentTime + duration);
    };
  }

  // API publique
  async enable() {
    this.enabled = true;
    this.savePreference(true);
    if (!this.context) {
      await this.initAudio();
    }
  }

  disable() {
    this.enabled = false;
    this.savePreference(false);
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }

  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Sons spécifiques
  playClick() {
    this.sounds.click?.();
  }

  playHover() {
    this.sounds.hover?.();
  }

  playSuccess() {
    this.sounds.success?.();
  }

  playError() {
    this.sounds.error?.();
  }

  playNotification() {
    this.sounds.notification?.();
  }

  playNavigate() {
    this.sounds.navigate?.();
  }

  // Jouer un son personnalisé
  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }
}

export default new AudioService();
