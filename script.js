// Tailwind Config
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'primary-purple': '#7C3AED',  
                'easy-green': '#6EE7B7',     
                'success-green': '#10B981',  
                'hard-orange': '#F97316',    
                'error-red': '#DC2626',      
                'medium-yellow': '#FBBF24',  
            }
        }
    }
}

// --- GLOBAL GAME STATE ---
let currentWords = [];
let currentQuestion = {};
let scoreCorrect = 0;
let scoreTotal = 0; // Keeps track of total ATTEMPTS in standard mode
let selectedDifficulty = 'very_common'; // Default
// NEW: Arcade Mode State
let isArcadeMode = false;
let arcadeScore = 0;
let timerInterval = null;
let timeLeft = 10;
let streak = 0;
let highScore = 0;
// NEW: Restart Cooldown State
let restartCount = 0;
let isRestartCooldown = false;
let restartCooldownTimer = null;
let restartCooldownSecondsLeft = 0; // Fixed missing variable

// NEW: BUG FIX STATE (Prevents double clicking)
let isProcessingAnswer = false; 

// NEW: SETTINGS STATE
let currentLanguage = 'en'; // 'en', 'es', 'pt'
let isSoundOn = true;
let isAudioStarted = false; // Track if Tone.js context is running

// --- NEW: localStorage Keys ---
const HIGH_SCORE_KEY = 'priskribu_high_score';
const SOUND_KEY = 'priskribu_sound';
const LANG_KEY = 'priskribu_language';
const DAILY_DATE_KEY = 'priskribu_daily_date'; 
const PRISKCOINS_KEY = 'priskribu_priskcoins'; 
const HISTORY_KEY = 'priskribu_word_history'; 

// --- UI Element Selectors ---
const scoreCorrectEl = document.getElementById('score-correct');
const scoreTotalEl = document.getElementById('score-total');
const scoreTotalWrapperEl = document.getElementById('score-total-wrapper'); 
const definitionTextEl = document.getElementById('definition-text');
const choicesContainerEl = document.getElementById('choices-container');

// Section Elements
const menuSectionEl = document.getElementById('menu-section');
const difficultySelectEl = document.getElementById('difficulty-select');
const helpSectionEl = document.getElementById('help-section');
const settingsSectionEl = document.getElementById('settings-section');

const quizAreaEl = document.getElementById('quiz-area');
const gameOverSectionEl = document.getElementById('game-over-section'); 
const dailyChallengeSectionEl = document.getElementById('daily-challenge-section'); 
const dailyCompleteSectionEl = document.getElementById('daily-complete-section'); 
const reviewSectionEl = document.getElementById('review-section'); 

const headerScoresEl = document.getElementById('header-scores');
const timerDisplayEl = document.getElementById('timer-display');
const finalScoreEl = document.getElementById('final-score'); 

// NEW: Countdown Overlay (Might be null if index.html is not updated)
const countdownOverlayEl = document.getElementById('countdown-overlay');
const countdownNumberEl = document.getElementById('countdown-number');

// NEW: Arcade High Score Elements
const arcadeHighScoreEl = document.getElementById('arcade-high-score');
const newHighScoreMsgEl = document.getElementById('new-high-score-msg');
const bestScoreDisplayEl = document.getElementById('best-score-display');
const arcadeBestScoreEl = document.getElementById('arcade-best-score');

// NEW: Arcade Coins Earned
const arcadePriskcoinsEarnedEl = document.getElementById('arcade-priskcoins-earned');

// NEW: Priskcoins Elements
let totalPriskcoins = 0;
const priskcoinsScoreEl = document.getElementById('priskcoins-score');
const priskcoinsDisplayEl = document.getElementById('priskcoins-display');

// NEW: Daily Challenge Elements
const dailyDefinitionTextEl = document.getElementById('daily-definition-text');
const dailyInputEl = document.getElementById('daily-input');
const dailyFeedbackMessageEl = document.getElementById('daily-feedback-message');
const dailyGiveUpBtnEl = document.getElementById('daily-give-up-btn');
const dailySubmitBtnEl = document.getElementById('daily-submit-btn');

// NEW: Daily Complete Elements
const dailyCompleteTitleEl = document.getElementById('daily-complete-title');
const dailyCompleteSubtitleEl = document.getElementById('daily-complete-subtitle');
const dailyCompleteWordEl = document.getElementById('daily-complete-word');
const dailyCompleteDefinitionEl = document.getElementById('daily-complete-definition');
const dailyCountdownEl = document.getElementById('daily-countdown');
const dailyPriskcoinsEarnedEl = document.getElementById('daily-priskcoins-earned');

// NEW: Review Elements
const reviewListEl = document.getElementById('review-list');
const reviewStatsEl = document.getElementById('review-stats');

let dailyWord = null; 
let wordHistory = {}; 

// NEW: Timer Bar Element
const timerBarEl = document.getElementById('timer-bar');
const timerContainerEl = document.getElementById('timer-container');

const feedbackMessageEl = document.getElementById('feedback-message');

// Top control buttons container and individuals
const topControlsButtonsEl = document.getElementById('top-controls-buttons');
const restartGameBtnEl = document.getElementById('restart-game-btn');
const changeDifficultyBtnEl = document.getElementById('change-difficulty-btn');
const tryAgainBtnEl = document.getElementById('try-again-btn'); 

// NEW
const allSections = [
    menuSectionEl, 
    difficultySelectEl, 
    helpSectionEl, 
    settingsSectionEl,
    quizAreaEl,
    gameOverSectionEl, 
    dailyChallengeSectionEl, 
    dailyCompleteSectionEl, 
    reviewSectionEl 
];

// --- TRANSLATIONS ---
const translations = {
    en: {
        subtitle: "Vocabulary Challenge",
        restartGame: "Restart Game",
        restartGameWait: "Wait ({s}s)",
        newGame: "New Game",
        changeDifficulty: "Change Difficulty",
        quizCorrect: "Points: ",
        quizStreak: "Streak: ",
        quizTotal: "Total: ",
        welcome: "Welcome to Priskribu!",
        welcomeMsg: "Test and expand your English vocabulary knowledge.",
        modeStandard: "Study Mode",
        modeArcade: "Word Rush (10s Limit!)",
        modeLeaderboard: "Global Leaderboard (Soon)🔒",
        modeSettings: "Settings",
        modeHelp: "How to Play",
        modeReview: "🔁 Review Session",
        difficultyTitle: "Choose Word Level",
        diffEasy: "Easy",
        diffMedium: "Medium",
        diffHard: "Hard",
        diffVeryHard: "Very Hard",
        backToMenu: "← Back to Menu",
        helpTitle: "How to Play",
        helpDesc: "The goal of Priskribu is to correctly match the definition to the correct vocabulary word. If you get it wrong, the correct word will be highlighted!",
        helpStandardTitle: "Study Mode:",
        helpStandardDesc: "Play at your own pace! Your score tracks correct vs total attempts. Choose your desired word difficulty to filter the words you encounter.",
        helpArcadeTitle: "Word Rush:",
        helpArcadeDesc: "This is a high-speed challenge! You have 10 seconds to answer each question. If the timer hits zero OR you select the wrong answer, the game ends immediately. Your goal is to get the highest streak possible!",
        settingsTitle: "Settings",
        settingsSound: "Sound",
        settingsSoundOn: "On",
        settingsSoundOff: "Off",
        settingsLang: "Language",
        timerTimeUp: "Time's Up!",
        timerCorrectWord: "The correct word was:",
        arcadeGameOverTitle: "WORD RUSH: CHALLENGE OVER!",
        arcadeGameOverMsg: [
            "Nice streak! That was a solid run.",
            "You were unstoppable! That was a tough one.",
            "So close! You got this next time.",
            "Incredible effort! That was a great attempt."
        ],
        arcadeFinalScore: "Final Score",
        arcadeGameOverPrompt: [
            "Don't stop now! Give it one more shot."
        ],
        arcadeTryAgain: "Try Again",
        arcadeNewHigh: "New High Score!", 
        arcadeBestScore: "Best Score: ", 
        feedbackCorrect: "Correct! Well done!",
        feedbackWrong: "Wrong! The correct word was:",
        feedbackGameOver: "Game over",
        bonusRound: "BONUS ROUND!", 
        feedbackBonus: "+20 (Bonus Round!)", 
        feedbackFast: "+10 (Fast Answer!)", 
        feedbackNice: "+5 (Nice!)", 
        totalPriskcoins: "Priskcoins: ",
        priskcoinsSuffix: "Priskcoins",
        arcadePriskcoinsEarned: "You earned: ",
        dailyPriskcoinsEarned: "+100 Priskcoins!", 
        modeDaily: "Word of the Day",
        dailyTitle: "Word of the Day",
        dailyGiveUp: "Give Up",
        dailySubmit: "Submit",
        dailyCompleteTitle: "Challenge Complete!",
        dailyCompleteSub: "You've completed the challenge for today.",
        dailyCompleteSubFailed: "Better luck next time!",
        dailyTheWordWas: "The word was:",
        dailyNextWord: "Next word in:",
        dailyFeedbackWrong: "Not quite, try again!",
        dailyFeedbackSuccess: "You got it! Amazing!",
        reviewTitle: "Review Session",
        reviewFilterAll: "All",
        reviewFilterPractice: "To Practice",
        reviewFilterMastered: "Mastered",
        reviewNoWords: "No words in history yet. Play a game to track your progress!",
        reviewStats: "Correct: {c} | Wrong: {i}"
    },
    es: {
        subtitle: "Desafío de Vocabulario",
        restartGame: "Reiniciar Juego",
        restartGameWait: "Espera ({s}s)",
        newGame: "Nuevo Juego",
        changeDifficulty: "Cambiar Dificultad",
        quizCorrect: "Puntos: ",
        quizStreak: "Racha: ",
        quizTotal: "Total: ",
        welcome: "¡Bienvenido a Priskribu!",
        welcomeMsg: "Pon a prueba y amplía tu vocabulario en inglés.",
        modeStandard: "Modo Estudio",
        modeArcade: "Word Rush (¡Límite 10s!)",
        modeLeaderboard: "Tabla Global (Pronto)🔒",
        modeSettings: "Ajustes",
        modeHelp: "Cómo Jugar",
        modeReview: "🔁 Sesión de Repaso",
        difficultyTitle: "Elige el Nivel",
        diffEasy: "Fácil",
        diffMedium: "Medio",
        diffHard: "Difícil",
        diffVeryHard: "Muy Difícil",
        backToMenu: "← Volver al Menú",
        helpTitle: "Cómo Jugar",
        helpDesc: "El objetivo de Priskribu es asociar correctamente la definición con la palabra de vocabulario correcta. Si te equivocas, ¡se destacará la palabra correcta!",
        helpStandardTitle: "Modo Estudio:",
        helpStandardDesc: "¡Juega a tu propio ritmo! Tu puntuación registra los aciertos frente a los intentos totales. Elige la dificultad de palabra que desees para filtrar las palabras que encuentres.",
        helpArcadeTitle: "Word Rush:",
        helpArcadeDesc: "¡Este es un desafío de alta velocidad! Tienes 10 segundos para responder cada pregunta. Si el temporizador llega a cero O seleccionas la respuesta incorrecta, el juego termina inmediatamente. ¡Tu objetivo es conseguir la puntuación más alta posible en una sola racha!",
        settingsTitle: "Ajustes",
        settingsSound: "Sonido",
        settingsSoundOn: "Activado",
        settingsSoundOff: "Desactivado",
        settingsLang: "Idioma",
        timerTimeUp: "¡Se acabó el tiempo!",
        timerCorrectWord: "La palabra correcta era:",
        arcadeGameOverTitle: "WORD RUSH: ¡DESAFÍO TERMINADO!",
        arcadeGameOverMsg: [
            "¡Buena racha! Fue una serie sólida.",
            "¡Estabas imparable! Esa fue difícil.",
            "¡Casi lo logras! La próxima la tienes.",
            "¡Esfuerzo increíble! Fue un buen intento."
        ],
        arcadeFinalScore: "Puntuación Final",
        arcadeGameOverPrompt: [
            "¡No pares ahora! Inténtalo una vez más."
        ],
        arcadeTryAgain: "Intentar de Nuevo",
        arcadeNewHigh: "¡Nuevo Récord!", 
        arcadeBestScore: "Mejor Puntuación: ", 
        feedbackCorrect: "¡Correcto! ¡Muy bien!",
        feedbackWrong: "¡Incorrecto! La palabra era:",
        feedbackGameOver: "Juego terminado",
        bonusRound: "¡RONDA DE BONO!", 
        feedbackBonus: "+20 (¡Ronda de Bono!)", 
        feedbackFast: "+10 (¡Respuesta Rápida!)", 
        feedbackNice: "+5 (¡Bien!)", 
        totalPriskcoins: "Priskcoins: ",
        priskcoinsSuffix: "Priskcoins",
        arcadePriskcoinsEarned: "Ganaste: ",
        dailyPriskcoinsEarned: "¡+100 Priskcoins!", 
        modeDaily: "Palabra del Día",
        dailyTitle: "Palabra del Día",
        dailyGiveUp: "Rendirse",
        dailySubmit: "Enviar",
        dailyCompleteTitle: "¡Desafío Completo!",
        dailyCompleteSub: "Has completado el desafío de hoy.",
        dailyCompleteSubFailed: "¡Mejor suerte la próxima vez!",
        dailyTheWordWas: "La palabra era:",
        dailyNextWord: "Próxima palabra en:",
        dailyFeedbackWrong: "¡Esa no es, intenta de nuevo!",
        dailyFeedbackSuccess: "¡Lo lograste! ¡Increíble!",
        reviewTitle: "Sesión de Repaso",
        reviewFilterAll: "Todas",
        reviewFilterPractice: "Para Practicar",
        reviewFilterMastered: "Dominadas",
        reviewNoWords: "Aún no hay palabras en tu historial. ¡Juega una partida para seguir tu progreso!",
        reviewStats: "Correctas: {c} | Incorrectas: {i}"
    },
    pt: {
        subtitle: "Desafio de Vocabulário",
        restartGame: "Recomeçar Jogo",
        restartGameWait: "Aguarde ({s}s)",
        newGame: "Novo Jogo",
        changeDifficulty: "Mudar Dificuldade",
        quizCorrect: "Pontos: ",
        quizStreak: "Série: ",
        quizTotal: "Total: ",
        welcome: "Bem-vindo ao Priskribu!",
        welcomeMsg: "Teste e expanda o seu vocabulário de inglês.",
        modeStandard: "Modo Estudo",
        modeArcade: "Word Rush (Limite 10s!)",
        modeLeaderboard: "Classificação Global (Breve)🔒",
        modeSettings: "Definições",
        modeHelp: "Como Jogar",
        modeReview: "🔁 Sessão de Revisão",
        difficultyTitle: "Escolha o Nível",
        diffEasy: "Fácil",
        diffMedium: "Médio",
        diffHard: "Difícil",
        diffVeryHard: "Muito Difícil",
        backToMenu: "← Voltar ao Menu",
        helpTitle: "Como Jogar",
        helpDesc: "O objetivo do Priskribu é associar corretamente a definição à palavra correta. Se errares, a palavra correta será destacada!",
        helpStandardTitle: "Modo Estudo:",
        helpStandardDesc: "Joga ao teu próprio ritmo! A tua pontuação regista os acertos face ao total de tentativas. Escolhe a dificuldade desejada para filtrar as palavras.",
        helpArcadeTitle: "Word Rush:",
        helpArcadeDesc: "Este é um desafio de alta velocidade! Tens 10 segundos para responder. Se o tempo acabar OU escolheres a resposta errada, o jogo termina. O teu objetivo é a maior série possível!",
        settingsTitle: "Definições",
        settingsSound: "Som",
        settingsSoundOn: "Ligado",
        settingsSoundOff: "Desligado",
        settingsLang: "Idioma",
        timerTimeUp: "Tempo esgotado!",
        timerCorrectWord: "A palavra correta era:",
        arcadeGameOverTitle: "WORD RUSH: DESAFIO TERMINADO!",
        arcadeGameOverMsg: [
            "Boa série! Foi uma sequência sólida.",
            "Estavas imparável! Essa foi difícil.",
            "Tão perto! Na próxima consegues.",
            "Esforço incrível! Foi uma ótima tentativa."
        ],
        arcadeFinalScore: "Pontuação Final",
        arcadeGameOverPrompt: [
            "Não pares agora! Tenta mais uma vez."
        ],
        arcadeTryAgain: "Tentar Novamente",
        arcadeNewHigh: "Novo Recorde!", 
        arcadeBestScore: "Melhor Pontuação: ", 
        feedbackCorrect: "Correto! Muito bem!",
        feedbackWrong: "Errado! A palavra correta era:",
        feedbackGameOver: "Fim do jogo",
        bonusRound: "RONDA DE BÓNUS!", 
        feedbackBonus: "+20 (Ronda de Bónus!)", 
        feedbackFast: "+10 (Rápido!)", 
        feedbackNice: "+5 (Boa!)", 
        totalPriskcoins: "Priskcoins: ",
        priskcoinsSuffix: "Priskcoins",
        arcadePriskcoinsEarned: "Ganhaste: ",
        dailyPriskcoinsEarned: "+100 Priskcoins!", 
        modeDaily: "Palavra do Dia",
        dailyTitle: "Palabra do Dia",
        dailyGiveUp: "Desistir",
        dailySubmit: "Enviar",
        dailyCompleteTitle: "Desafio Completo!",
        dailyCompleteSub: "Completaste o desafio de hoje.",
        dailyCompleteSubFailed: "Mais sorte para a próxima!",
        dailyTheWordWas: "A palavra era:",
        dailyNextWord: "Próxima palavra em:",
        dailyFeedbackWrong: "Não é essa, tenta de novo!",
        dailyFeedbackSuccess: "Conseguiste! Incrível!",
        reviewTitle: "Sessão de Revisão",
        reviewFilterAll: "Todas",
        reviewFilterPractice: "Para Praticar",
        reviewFilterMastered: "Dominadas",
        reviewNoWords: "Ainda sem palavras no histórico. Joga para acompanhar o teu progresso!",
        reviewStats: "Corretas: {c} | Incorretas: {i}"
    }
};

// --- HELPER: Get Translation ---
function t(key) {
    const lang = translations[currentLanguage];
    if (Array.isArray(lang[key])) {
        return lang[key][Math.floor(Math.random() * lang[key].length)];
    }
    return lang[key] || key;
}

function updateLanguage() {
    const lang = translations[currentLanguage];
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        if (lang[key]) {
            if (typeof lang[key] === 'string') {
                el.textContent = lang[key];
            }
        }
    });
    
    priskcoinsScoreEl.textContent = totalPriskcoins;
    priskcoinsDisplayEl.querySelector('span[data-translate]').textContent = lang.totalPriskcoins || "Priskcoins: ";
    
    if (highScore > 0 && arcadeHighScoreEl) {
        arcadeHighScoreEl.textContent = `${translations[currentLanguage].arcadeHighScore || 'Best: '}${highScore}`;
    }

    if (isRestartCooldown) {
        const btnText = lang.restartGameWait.replace('{s}', restartCooldownSecondsLeft);
        if(restartGameBtnEl) restartGameBtnEl.textContent = btnText;
        if(tryAgainBtnEl) tryAgainBtnEl.textContent = btnText;
    }
}

function setLanguage(langCode) {
    currentLanguage = langCode;
    localStorage.setItem(LANG_KEY, langCode);
    updateLanguage();
    updateSettingsUI();
}

// --- SOUND EFFECTS (Using Tone.js) ---
const synth = new Tone.Synth().toDestination();
const polySynth = new Tone.PolySynth().toDestination(); 

async function ensureAudioStarted() {
    if (!isAudioStarted) {
        await Tone.start();
        isAudioStarted = true;
    }
}

async function playClickSound() {
    await ensureAudioStarted();
    if (isSoundOn) {
        synth.triggerAttackRelease("C5", "32n", undefined, 0.1); 
    }
}

function playCorrectSound() {
    if (isSoundOn) {
        polySynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "16n");
    }
}

function playWrongSound() {
    if (isSoundOn) {
        synth.triggerAttackRelease("G2", "8n"); 
    }
}

function playGameOverSound() {
    if (isSoundOn) {
        const now = Tone.now();
        polySynth.triggerAttackRelease("C4", "8n", now);
        polySynth.triggerAttackRelease("G3", "8n", now + 0.1);
        polySynth.triggerAttackRelease("E3", "8n", now + 0.2);
        polySynth.triggerAttackRelease("C3", "4n", now + 0.3);
    }
}

function playBonusSound() {
    if(isSoundOn) {
        polySynth.triggerAttackRelease(["D5", "F#5", "A5", "D6"], "16n");
    }
}

// --- INITIALIZATION ---
window.onload = () => {
    // Load saved high score
    const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (savedScore) {
        highScore = parseInt(savedScore);
        arcadeBestScoreEl.textContent = highScore;
    }
    
    // Load Sound Preference
    const savedSound = localStorage.getItem(SOUND_KEY);
    if (savedSound !== null) {
        isSoundOn = (savedSound === 'true');
    }
    
    // Load Language Preference
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang) {
        currentLanguage = savedLang;
    }

    // Load Priskcoins
    const savedCoins = localStorage.getItem(PRISKCOINS_KEY);
    if (savedCoins) {
        totalPriskcoins = parseInt(savedCoins);
        priskcoinsScoreEl.textContent = totalPriskcoins;
    }

    // Load Word History
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
        wordHistory = JSON.parse(savedHistory);
    }
    
    // Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    const animationTime = 2000; 
    
    setTimeout(() => {
         if (splashScreen) {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500); 
        }
        
        updateLanguage();
        updateSettingsUI();
        goToMenu(); 
    }, animationTime);
};

// --- VIEW NAVIGATION ---
function showSection(sectionToShow) {
    allSections.forEach(section => {
        section.classList.add('hidden');
    });
    sectionToShow.classList.remove('hidden');
    
    // Handle Top Controls Visibility
    if (sectionToShow === quizAreaEl) {
        topControlsButtonsEl.classList.remove('hidden');
        if (isArcadeMode) {
            restartGameBtnEl.classList.remove('hidden');
            changeDifficultyBtnEl.classList.add('hidden');
            headerScoresEl.classList.remove('hidden'); 
        } else {
            restartGameBtnEl.classList.remove('hidden'); 
            changeDifficultyBtnEl.classList.remove('hidden');
            headerScoresEl.classList.remove('hidden');
        }
    } else {
        topControlsButtonsEl.classList.add('hidden');
    }
    
    // Specific Header Logic for Arcade
    if (isArcadeMode && sectionToShow === quizAreaEl) {
        document.getElementById('score-streak-wrapper').classList.remove('hidden');
        scoreTotalWrapperEl.classList.add('hidden');
    } else if (!isArcadeMode && sectionToShow === quizAreaEl) {
        document.getElementById('score-streak-wrapper').classList.add('hidden');
        scoreTotalWrapperEl.classList.remove('hidden');
    } else {
        // Defaults for non-quiz screens
        document.getElementById('score-streak-wrapper').classList.add('hidden');
        scoreTotalWrapperEl.classList.add('hidden'); 
    }
    
    priskcoinsDisplayEl.classList.remove('hidden');
}

function goToMenu() {
    playClickSound();
    stopTimer(); 
    isArcadeMode = false;
    
    const tryAgainBtnEl = document.getElementById('try-again-btn');
    if (tryAgainBtnEl) {
        tryAgainBtnEl.classList.remove('pulse-invite-animation');
    }
    
    showSection(menuSectionEl);
    updateLanguage();

    if (highScore > 0) {
        if (arcadeHighScoreEl) {
            arcadeHighScoreEl.classList.remove('hidden');
        }
    } else {
        if (arcadeHighScoreEl) {
            arcadeHighScoreEl.classList.add('hidden');
        }
    }
}

function goToDifficulty() {
    playClickSound();
    showSection(difficultySelectEl);
}

function goToHelp() {
    playClickSound();
    showSection(helpSectionEl);
}

function goToSettings() {
    playClickSound();
    showSection(settingsSectionEl);
    updateSettingsUI();
}

// --- SETTINGS LOGIC ---
function setSound(state) {
    isSoundOn = state;
    localStorage.setItem(SOUND_KEY, state);
    updateSettingsUI();
    if (state) playClickSound();
}

function updateSettingsUI() {
    const onBtn = document.getElementById('sound-on-btn');
    const offBtn = document.getElementById('sound-off-btn');
    
    if (isSoundOn) {
        onBtn.classList.add('selected');
        offBtn.classList.remove('selected');
    } else {
        onBtn.classList.remove('selected');
        offBtn.classList.add('selected');
    }
    
    // Language Buttons
    ['en', 'es', 'pt'].forEach(lang => {
        const btn = document.getElementById(`lang-${lang}-btn`);
        if (currentLanguage === lang) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// --- GAME LOGIC (STANDARD MODE) ---
function startGame(difficulty) {
    playClickSound();
    selectedDifficulty = difficulty;
    isArcadeMode = false; 
    
    scoreCorrect = 0;
    scoreTotal = 0;
    updateScoreUI();
    
    showSection(quizAreaEl);
    nextQuestion();
}

// --- GAME LOGIC (ARCADE MODE) ---
function startArcadeMode() {
    // Only play sound if we are actually starting, not just resetting state
    if(!isArcadeMode) playClickSound();

    isArcadeMode = true;
    scoreCorrect = 0;
    streak = 0; 
    selectedDifficulty = 'very_common'; 
    
    updateScoreUI();
    
    // Show Timer UI
    timerDisplayEl.classList.remove('hidden');
    timerContainerEl.classList.remove('hidden');
    
    // Show Quiz Area but... wait!
    showSection(quizAreaEl);

    // NEW: Start Countdown before actual game loop
    startArcadeCountdown();
}

function startArcadeCountdown() {
    // SAFETY CHECK: If HTML element is missing, skip countdown to avoid crash
    if(!countdownOverlayEl || !countdownNumberEl) {
        console.warn("Countdown elements missing in index.html. Starting game immediately.");
        nextQuestion();
        return;
    }

    countdownOverlayEl.classList.remove('hidden');
    
    let count = 3;
    
    // Helper to re-trigger animation properly
    const animateCount = (num) => {
        countdownNumberEl.textContent = num;
        countdownNumberEl.classList.remove('countdown-animate');
        void countdownNumberEl.offsetWidth; // Trigger reflow
        countdownNumberEl.classList.add('countdown-animate');
    }

    // Initialize first number
    animateCount(count);

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            animateCount(count);
            playClickSound(); 
        } else if (count === 0) {
            animateCount("GO!");
            playCorrectSound(); 
        } else {
            clearInterval(countdownInterval);
            countdownOverlayEl.classList.add('hidden');
            nextQuestion(); // START THE GAME!
        }
    }, 1000);
}

function nextQuestion() {
    isProcessingAnswer = false; 

    // Clear previous feedback
    feedbackMessageEl.classList.add('hidden');
    feedbackMessageEl.className = 'mt-6 p-3 text-center text-xl font-bold rounded-xl hidden'; 
    
    // Reset card animation
    const card = document.querySelector('.game-card'); 
    if(card) {
       card.classList.remove('shake-animation', 'jelly-animation');
       card.classList.remove('card-bounce-animation');
       void card.offsetWidth; 
       card.classList.add('card-bounce-animation');
    }

    // Filter words
    let filteredWords = vocabulary.filter(w => w.common === selectedDifficulty);
    if (filteredWords.length < 4) {
        filteredWords = vocabulary; 
    }

    // Pick correct answer
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    currentQuestion = filteredWords[randomIndex];

    // Pick 3 distractors
    const distractors = [];
    while (distractors.length < 3) {
        const dIndex = Math.floor(Math.random() * filteredWords.length);
        const dWord = filteredWords[dIndex];
        if (dWord.word !== currentQuestion.word && !distractors.includes(dWord)) {
            distractors.push(dWord);
        }
    }

    // Shuffle choices
    currentWords = [currentQuestion, ...distractors].sort(() => Math.random() - 0.5);

    // Update UI
    definitionTextEl.textContent = `"${currentQuestion.definition}"`;
    if (currentQuestion.definition.length > 100) {
        definitionTextEl.classList.replace('text-2xl', 'text-xl');
    } else {
        definitionTextEl.classList.replace('text-xl', 'text-2xl');
    }

    const buttons = choicesContainerEl.querySelectorAll('button');
    buttons.forEach((btn, index) => {
        btn.textContent = currentWords[index].word;
        btn.onclick = () => checkAnswer(currentWords[index]);
        
        btn.className = 'btn-3d btn-purple'; 
        btn.disabled = false;
    });

    // ARCADE MODE TIMER
    if (isArcadeMode) {
        startTimer();
    } else {
        timerDisplayEl.classList.add('hidden');
        timerContainerEl.classList.add('hidden');
        stopTimer();
    }
}

// --- TIMER LOGIC ---
function startTimer() {
    stopTimer(); 
    timeLeft = 10; 
    updateTimerUI();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        
        if (timeLeft <= 0) {
            stopTimer();
            handleTimeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerUI() {
    timerDisplayEl.textContent = timeLeft;
    
    const percentage = (timeLeft / 10) * 100;
    timerBarEl.style.width = `${percentage}%`;
    
    if (timeLeft <= 3) {
        timerBarEl.className = 'h-full bg-error-red transition-all duration-1000 ease-linear'; 
        timerDisplayEl.classList.add('text-error-red');
        timerDisplayEl.classList.remove('text-primary-purple');
    } else {
        timerBarEl.className = 'h-full bg-hard-orange transition-all duration-1000 ease-linear'; 
        timerDisplayEl.classList.remove('text-error-red');
        timerDisplayEl.classList.add('text-primary-purple');
    }
}

function handleTimeUp() {
    const lang = translations[currentLanguage];
    feedbackMessageEl.textContent = `${lang.timerTimeUp} ${lang.timerCorrectWord} ${currentQuestion.word.toUpperCase()}`;
    feedbackMessageEl.className = 'mt-6 p-3 text-center text-xl font-bold rounded-xl feedback-error bg-error-red/10 text-error-red';
    feedbackMessageEl.classList.remove('hidden');
    
    highlightCorrectAnswer();
    playWrongSound();
    
    setTimeout(() => {
        gameOverArcade();
    }, 2000);
}

// --- CHECK ANSWER ---
function checkAnswer(selectedWord) {
    if (isProcessingAnswer) return;
    isProcessingAnswer = true;

    if (isArcadeMode) stopTimer(); 

    const isCorrect = selectedWord.word === currentQuestion.word;
    const lang = translations[currentLanguage];
    
    updateWordHistory(selectedWord.word, selectedWord.definition, isCorrect);

    if (isCorrect) {
        // --- CORRECT ---
        scoreCorrect++;
        if (isArcadeMode) {
             streak++;
             let points = 10;
             let timeBonus = timeLeft; 
             points += timeBonus;
             
             let bonusMsg = "";
             
             if (streak % 5 === 0) {
                 points += 20;
                 playBonusSound();
                 bonusMsg = lang.feedbackBonus;
                 triggerConfetti(); 
             } else if (timeLeft > 7) {
                 points += 10; 
                 bonusMsg = lang.feedbackFast;
                 playCorrectSound();
             } else {
                 playCorrectSound();
                 bonusMsg = lang.feedbackCorrect; 
             }
             
             arcadeScore += points;
             addPriskcoins(1);

             feedbackMessageEl.textContent = `${bonusMsg} (+${points})`; 
             feedbackMessageEl.className = 'mt-6 p-3 text-center text-xl font-bold rounded-xl feedback-success bg-success-green/10 text-success-green';
        } else {
            scoreTotal++; 
            playCorrectSound();
            feedbackMessageEl.textContent = lang.feedbackCorrect;
            feedbackMessageEl.className = 'mt-6 p-3 text-center text-xl font-bold rounded-xl feedback-success bg-success-green/10 text-success-green';
        }

        feedbackMessageEl.classList.remove('hidden');
        updateScoreUI();
        highlightCorrectAnswer();

        setTimeout(() => {
            nextQuestion();
        }, 1200); 

    } else {
        // --- WRONG ---
        playWrongSound();
        
        highlightCorrectAnswer();
        
        const buttons = choicesContainerEl.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent === selectedWord.word) {
                btn.classList.add('shake-animation'); 
            }
        });

        if (isArcadeMode) {
             // GAME OVER
             feedbackMessageEl.textContent = `${lang.feedbackWrong} ${currentQuestion.word.toUpperCase()}`;
             feedbackMessageEl.className = 'mt-6 p-3 text-center text-xl font-bold rounded-xl feedback-error bg-error-red/10 text-error-red';
             feedbackMessageEl.classList.remove('hidden');
             
             setTimeout(() => {
                 gameOverArcade();
             }, 2000);
        } else {
            // Standard Mode
            scoreTotal++; 
            feedbackMessageEl.textContent = `${lang.feedbackWrong} ${currentQuestion.word.toUpperCase()}`;
            feedbackMessageEl.className = 'mt-6 p-3 text-center text-xl font-bold rounded-xl feedback-error bg-error-red/10 text-error-red';
            feedbackMessageEl.classList.remove('hidden');
            
            updateScoreUI();
            
            setTimeout(() => {
                nextQuestion();
            }, 2500); 
        }
    }
}

function highlightCorrectAnswer() {
    const buttons = choicesContainerEl.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.textContent === currentQuestion.word) {
            btn.classList.remove('btn-purple');
            btn.classList.add('btn-green');
            btn.classList.add('jelly-animation'); 
        } else {
             btn.disabled = true; 
             btn.classList.add('opacity-50'); 
        }
    });
}

function updateScoreUI() {
    if (isArcadeMode) {
        scoreCorrectEl.textContent = arcadeScore;
        document.getElementById('score-streak').textContent = streak;
    } else {
        scoreCorrectEl.textContent = scoreCorrect;
        scoreTotalEl.textContent = scoreTotal;
    }
}

function gameOverArcade() {
    playGameOverSound();
    showSection(gameOverSectionEl);
    
    const lang = translations[currentLanguage];
    
    finalScoreEl.textContent = arcadeScore;
    arcadeBestScoreEl.textContent = highScore;

    // Check High Score
    if (arcadeScore > highScore) {
        highScore = arcadeScore;
        localStorage.setItem(HIGH_SCORE_KEY, highScore);
        newHighScoreMsgEl.classList.remove('hidden');
        triggerConfetti(); 
    } else {
        newHighScoreMsgEl.classList.add('hidden');
    }
    
    arcadeBestScoreEl.textContent = highScore;
    
    const msgs = lang.arcadeGameOverMsg;
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    document.getElementById('game-over-msg').textContent = randomMsg;

    arcadePriskcoinsEarnedEl.textContent = `${lang.arcadePriskcoinsEarned} +${streak} ${lang.priskcoinsSuffix}`;
    arcadePriskcoinsEarnedEl.classList.remove('hidden');

    // Remove pulse from try again initially, we handle it in logic
    if(tryAgainBtnEl) tryAgainBtnEl.classList.remove('pulse-invite-animation');
}

// --- RESTART GAME LOGIC WITH COOLDOWN ---
function restartGame() {
    if (isRestartCooldown) {
        return; 
    }
    
    // Increment usage
    restartCount++;
    
    // Check limit (3 uses)
    if (restartCount >= 3) {
        activateRestartCooldown();
        return; 
    }
    
    // Normal Restart
    if (isArcadeMode) {
        startArcadeMode(); 
    } else {
        startGame(selectedDifficulty);
    }
}

function activateRestartCooldown() {
    isRestartCooldown = true;
    restartCooldownSecondsLeft = 20;
    restartCount = 0; 
    
    updateRestartButtonsState();

    restartCooldownTimer = setInterval(() => {
        restartCooldownSecondsLeft--;
        updateRestartButtonsState();

        if (restartCooldownSecondsLeft <= 0) {
            clearInterval(restartCooldownTimer);
            isRestartCooldown = false;
            updateRestartButtonsState();
        }
    }, 1000);
}

function updateRestartButtonsState() {
    const lang = translations[currentLanguage];
    const btns = [restartGameBtnEl, tryAgainBtnEl];
    
    btns.forEach(btn => {
        if (!btn) return;

        if (isRestartCooldown) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.textContent = lang.restartGameWait.replace('{s}', restartCooldownSecondsLeft);
            btn.classList.remove('pulse-invite-animation');
        } else {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            
            if (btn.id === 'try-again-btn') {
                btn.textContent = lang.arcadeTryAgain;
                btn.classList.add('pulse-invite-animation'); 
            } else {
                btn.textContent = lang.restartGame;
            }
        }
    });
}

// --- PRISKCOINS SYSTEM ---
function addPriskcoins(amount) {
    totalPriskcoins += amount;
    priskcoinsScoreEl.textContent = totalPriskcoins;
    localStorage.setItem(PRISKCOINS_KEY, totalPriskcoins);
    
    priskcoinsDisplayEl.classList.add('scale-110', 'bg-yellow-200');
    setTimeout(() => {
        priskcoinsDisplayEl.classList.remove('scale-110', 'bg-yellow-200');
    }, 300);
}

// --- DAILY CHALLENGE SYSTEM ---
function getDailyWord() {
    let allHardWords = vocabulary.filter(w => w.common === 'not_so_common' || w.common === 'definitely_not_common');
    if (allHardWords.length === 0) {
        allHardWords = vocabulary; 
    }
    
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const wordIndex = (dayOfYear - 1) % allHardWords.length;
    dailyWord = allHardWords[wordIndex];
}

function handleSubmitDailyGuess() {
    const guess = dailyInputEl.value.trim().toLowerCase();
    const answer = dailyWord.word.toLowerCase();
    const lang = translations[currentLanguage];

    if (!guess) return; 

    updateWordHistory(dailyWord.word, dailyWord.definition, guess === answer);

    if (guess === answer) {
        // --- CORRECT ---
        playCorrectSound();
        dailyFeedbackMessageEl.textContent = lang.dailyFeedbackSuccess;
        dailyFeedbackMessageEl.className = 'mt-4 p-3 text-center text-lg font-bold rounded-xl feedback-success bg-success-green/10 text-success-green';
        dailyFeedbackMessageEl.classList.remove('hidden');
        
        dailyInputEl.disabled = true;
        dailySubmitBtnEl.disabled = true;
        dailyGiveUpBtnEl.disabled = true;
        
        localStorage.setItem(DAILY_DATE_KEY, new Date().toDateString());
        addPriskcoins(100); 

        setTimeout(() => showDailyComplete(true, true), 1500);
        
    } else {
        // --- WRONG ---
        playWrongSound();
        dailyFeedbackMessageEl.textContent = lang.dailyFeedbackWrong;
        dailyFeedbackMessageEl.className = 'mt-4 p-3 text-center text-lg font-bold rounded-xl feedback-error bg-error-red/10 text-error-red';
        dailyFeedbackMessageEl.classList.remove('hidden');
        dailyInputEl.classList.add('shake-animation');
        setTimeout(() => dailyInputEl.classList.remove('shake-animation'), 500);
    }
}

function handleGiveUpDaily() {
    playGameOverSound();
    localStorage.setItem(DAILY_DATE_KEY, new Date().toDateString()); 
    showDailyComplete(true, false);
}

function startDailyChallenge() {
    playClickSound();
    
    const lastPlayedDate = localStorage.getItem(DAILY_DATE_KEY);
    const todayStr = new Date().toDateString();
    
    getDailyWord(); 
    
    if (lastPlayedDate === todayStr) {
        showDailyComplete(false, false); 
    } else {
        dailyInputEl.value = '';
        dailyInputEl.disabled = false;
        dailySubmitBtnEl.disabled = false;
        dailyGiveUpBtnEl.disabled = false;
        dailyFeedbackMessageEl.classList.add('hidden');
        
        dailyDefinitionTextEl.textContent = `"${dailyWord.definition}"`;
        
        showSection(dailyChallengeSectionEl);
    }
}

function showDailyComplete(justFinished, won) {
    showSection(dailyCompleteSectionEl);
    
    const lang = translations[currentLanguage];
    
    if (justFinished) {
        triggerConfetti();
        if (won) {
            dailyCompleteTitleEl.textContent = lang.dailyFeedbackSuccess; 
            dailyCompleteSubtitleEl.textContent = lang.dailyPriskcoinsEarned; 
            dailyCompleteTitleEl.classList.remove('text-error-red');
            dailyCompleteTitleEl.classList.add('text-success-green');
            dailyPriskcoinsEarnedEl.classList.remove('hidden');
        } else {
            dailyCompleteTitleEl.textContent = lang.dailyCompleteSubFailed; 
            dailyCompleteSubtitleEl.textContent = ""; 
            dailyCompleteTitleEl.classList.remove('text-success-green');
            dailyCompleteTitleEl.classList.add('text-error-red');
            dailyPriskcoinsEarnedEl.classList.add('hidden');
        }
    } else {
        dailyCompleteTitleEl.textContent = lang.dailyCompleteTitle; 
        dailyCompleteSubtitleEl.textContent = lang.dailyCompleteSub; 
        dailyCompleteTitleEl.classList.remove('text-error-red');
        dailyCompleteTitleEl.classList.add('text-success-green');
        dailyPriskcoinsEarnedEl.classList.add('hidden'); 
    }
    
    if (!dailyWord) getDailyWord();
    dailyCompleteWordEl.textContent = dailyWord.word;
    dailyCompleteDefinitionEl.textContent = dailyWord.definition;
    
    startDailyCountdown();
}

function startDailyCountdown() {
    updateDailyCountdown(); 
    setInterval(updateDailyCountdown, 1000);
}

function updateDailyCountdown() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    dailyCountdownEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// --- WORD HISTORY & REVIEW SESSION ---
function updateWordHistory(word, definition, correct) {
    if (!wordHistory[word]) {
        wordHistory[word] = {
            word: word,
            definition: definition,
            attempts: 0,
            correct: 0,
            mastered: false,
            lastSeen: Date.now()
        };
    }
    
    const entry = wordHistory[word];
    entry.attempts++;
    if (correct) entry.correct++;
    entry.lastSeen = Date.now();
    
    if (entry.attempts >= 3 && (entry.correct / entry.attempts) > 0.8) {
        entry.mastered = true;
    } else {
        entry.mastered = false;
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(wordHistory));
}

function startReviewSession() {
    playClickSound();
    showSection(reviewSectionEl);
    renderReviewList('all');
}

function filterReview(filterType) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`filter-${filterType}`).classList.add('selected');
    
    renderReviewList(filterType);
}

function renderReviewList(filterType) {
    reviewListEl.innerHTML = '';
    const words = Object.values(wordHistory);
    const lang = translations[currentLanguage];
    
    const totalCorrect = words.reduce((sum, w) => sum + w.correct, 0);
    const totalWrong = words.reduce((sum, w) => sum + (w.attempts - w.correct), 0);
    reviewStatsEl.textContent = lang.reviewStats.replace('{c}', totalCorrect).replace('{i}', totalWrong);

    if (words.length === 0) {
        reviewListEl.innerHTML = `<p class="text-center text-gray-400 mt-10">${lang.reviewNoWords}</p>`;
        return;
    }

    let filtered = [];
    if (filterType === 'all') {
        filtered = words;
    } else if (filterType === 'mastered') {
        filtered = words.filter(w => w.mastered);
    } else if (filterType === 'practice') {
        filtered = words.filter(w => !w.mastered);
    }
    
    filtered.sort((a, b) => b.lastSeen - a.lastSeen);
    
    if (filtered.length === 0) {
        reviewListEl.innerHTML = `<p class="text-center text-gray-400 mt-10">No words found in this category.</p>`;
        return;
    }

    filtered.forEach(w => {
        const item = document.createElement('div');
        item.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center';
        
        const badgeColor = w.mastered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
        const badgeText = w.mastered ? 'Mastered' : 'Learning';
        
        item.innerHTML = `
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-lg text-gray-800 capitalize">${w.word}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full font-bold ${badgeColor}">${badgeText}</span>
                </div>
                <p class="text-sm text-gray-500 italic leading-tight line-clamp-2">"${w.definition}"</p>
            </div>
            <div class="text-right min-w-[60px]">
                <div class="text-xs text-gray-400 uppercase font-bold">Score</div>
                <div class="font-mono font-bold text-gray-700">${w.correct}/${w.attempts}</div>
            </div>
        `;
        reviewListEl.appendChild(item);
    });
}

// --- Confetti ---
const confettiContainer = document.getElementById('confetti-container');
const confettiColors = ['#7C3AED', '#6EE7B7', '#10B981', '#F97316', '#FBBF24'];

function triggerConfetti() {
    for (let i = 0; i < 50; i++) { 
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's'; 
        confetti.style.opacity = Math.random();
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}