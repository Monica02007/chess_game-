// Voice Agent: 100% Locked Female (Lady) Voice with On-Demand Prediction Speech

class VoiceAgent {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.autoCoach = false; // ONLY speak when requested or on key events!
    this.canvas = null;
    this.canvasCtx = null;
    this.wavePhase = 0;

    this.initSpeechRecognition();
  }

  getLadyVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Specific list of known English female voices
    const femaleKeywords = [
      'zira', 'samantha', 'aria', 'jenny', 'victoria', 'karen', 
      'fiona', 'moira', 'veena', 'google us english', 'female'
    ];

    for (const kw of femaleKeywords) {
      const match = voices.find(v => 
        v.lang.startsWith('en') && 
        v.name.toLowerCase().includes(kw) && 
        !v.name.toLowerCase().includes('david') && 
        !v.name.toLowerCase().includes('male') && 
        !v.name.toLowerCase().includes('george')
      );
      if (match) return match;
    }

    // Fallback English voice
    return voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male')) || voices[0];
  }

  speak(text, onEndCallback = null) {
    if (!this.synth || !text) return;
    this.synth.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    const ladyVoice = this.getLadyVoice();
    if (ladyVoice) {
      utterance.voice = ladyVoice;
    }
    // High pitch for guaranteed natural female voice tone
    utterance.pitch = 1.15;
    utterance.rate = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateUI();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateUI();
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.updateUI();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.updateUI();
    }
  }

  setVisualizerCanvas(canvasElement) {
    this.canvas = canvasElement;
    if (this.canvas) {
      this.canvasCtx = this.canvas.getContext('2d');
      this.startWaveformAnimation();
    }
  }

  startWaveformAnimation() {
    const draw = () => {
      if (!this.canvas || !this.canvasCtx) return;
      const ctx = this.canvasCtx;
      const width = this.canvas.width;
      const height = this.canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const centerY = height / 2;
      const amplitude = this.isSpeaking ? 20 : this.isListening ? 14 : 3;
      const frequency = this.isSpeaking ? 0.09 : this.isListening ? 0.06 : 0.02;

      this.wavePhase += (this.isSpeaking ? 0.16 : this.isListening ? 0.08 : 0.02);

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.lineWidth = i === 0 ? 3 : 1.5;
        const color = this.isSpeaking 
          ? `rgba(236, 72, 153, ${0.9 - i * 0.25})` // Pink Lady Glow
          : this.isListening 
            ? `rgba(239, 68, 68, ${0.9 - i * 0.25})`
            : `rgba(168, 85, 247, ${0.5 - i * 0.15})`;

        ctx.strokeStyle = color;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * frequency + this.wavePhase + i * 0.6) * (amplitude * (1 - Math.abs(x - width/2) / (width/2)));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    draw();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateUI();
        window.soundFX.playAgentChime();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Voice Command Heard:", transcript);
        this.handleVoiceCommand(transcript);
      };

      this.recognition.onerror = (e) => {
        console.warn("Speech Recognition Error:", e);
        this.isListening = false;
        this.updateUI();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateUI();
      };
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.stopSpeaking();
      try {
        this.recognition.start();
      } catch (e) {
        console.warn("Recognition start error:", e);
      }
    }
    this.updateUI();
  }

  handleVoiceCommand(transcript) {
    if (!window.app || !window.app.game) return;
    const game = window.app.game;
    const analysis = window.app.currentAnalysis;
    const answer = window.coachAgent ? window.coachAgent.answerVoiceQuery(transcript, game, analysis) : { speech: "Analyzing position." };

    this.speak(answer.speech);

    const voiceCardText = document.getElementById('coach-speech-text');
    if (voiceCardText) {
      voiceCardText.innerHTML = `<strong>You asked:</strong> "${transcript}"<br><br><strong>Aria (Lady Coach):</strong> ${answer.speech}`;
    }

    if (answer.action === 'highlight_best_move' && answer.data && window.chessboardView) {
      window.chessboardView.setBestMoveArrow(answer.data.from, answer.data.to);
    }
  }

  updateUI() {
    const micBtn = document.getElementById('btn-voice-mic');
    const statusText = document.getElementById('coach-status-text');

    if (micBtn) {
      if (this.isListening) {
        micBtn.classList.add('bg-red-600', 'animate-pulse', 'text-white');
        micBtn.classList.remove('bg-slate-800', 'text-slate-300');
        if (statusText) statusText.innerText = "Listening to your voice...";
      } else if (this.isSpeaking) {
        micBtn.classList.remove('bg-red-600', 'animate-pulse');
        micBtn.classList.add('bg-pink-600', 'text-white');
        if (statusText) statusText.innerText = "Grandmaster Aria speaking...";
      } else {
        micBtn.classList.remove('bg-red-600', 'bg-pink-600', 'animate-pulse', 'text-white');
        micBtn.classList.add('bg-slate-800', 'text-slate-300');
        if (statusText) statusText.innerText = "Grandmaster Aria • Lady Voice Ready";
      }
    }
  }
}

window.voiceAgent = new VoiceAgent();
