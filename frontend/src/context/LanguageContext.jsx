import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    // Brand & App
    appName: 'MINE RESCUE AI',
    appSubtitle: 'COMMAND & CONTROL SYSTEM',
    homeTab: 'Home Overview',
    dashboardTab: 'Rescue Dashboard',
    archTab: 'System Architecture',
    historyTab: 'Telemetry History',
    apiStatus: 'API',
    online: 'ONLINE',
    offline: 'OFFLINE',
    demoSimulation: 'DEMO SIMULATION',
    realEsp32: 'REAL ESP32',
    liveApi: 'Live API',
    connectRover: 'Connect Rover',
    risk: 'RISK',
    
    // Telemetry Cards
    gasConcentration: 'GAS CONCENTRATION',
    temperature: 'TEMPERATURE',
    humidity: 'HUMIDITY',
    vibrationSeismic: 'VIBRATION / SEISMIC',
    batteryMonitor: 'BATTERY MONITOR',
    imuAttitude: 'IMU 3-AXIS ATTITUDE',
    minePosition: 'LOCAL MINE POSITION',
    gasLimit: 'Safe Limit: <25 ppm | Threshold: 40 ppm',
    tempLimit: 'Mine Baseline: 20-30°C | Spike Alert: >34°C',
    humidityLimit: 'Relative Air Moisture: Optimal 50-75%',
    vibrationLimit: 'Structural Settling Alert: >0.25g',
    safe: 'SAFE',
    warning: 'WARNING',
    critical: 'CRITICAL',
    high: 'HIGH',
    moderate: 'MODERATE',
    normal: 'NORMAL',

    // Rover Controls
    roverController: 'REMOTE ROVER COMMAND CONTROLLER',
    wasdEnabled: 'WASD / ARROWS ENABLED',
    simNotice: 'SIMULATION MODE: WASD keys update simulated tunnel location coordinates.',
    forward: 'FORWARD',
    left: 'LEFT',
    stop: 'STOP',
    right: 'RIGHT',
    reverse: 'REVERSE',
    driveSpeed: 'Drive Speed Slider',
    headlight: 'Headlight',
    buzzer: 'Acoustic Buzzer',
    emergencyStop: 'EMERGENCY HARD STOP',
    cmdAck: 'COMMAND ACKNOWLEDGED',
    cmdFail: 'COMMAND FAILED',

    // 2D Map
    mapTitle: '2D Underground Mine Map & Location System',
    localMesh: 'LOCAL MESH (METERS)',
    roverPos: 'Rover Position',
    gasHeatHazard: 'Gas/Heat Hazard',
    trappedWorker: 'Trapped Worker',
    hazardGasHeat: 'HAZARD: GAS & HEAT SPIKE',
    workerConfirmed: 'TRAPPED WORKER CONFIRMED (36.8°C)',

    // Camera & AI Panels
    cameraFeeds: 'MULTISENSORY VISION & THERMAL FEEDS',
    rgbOptical: 'RGB OPTICAL SHAFT CAMERA',
    thermalIr: 'THERMAL INFRARED HEAT VISION',
    aiDetectionTitle: 'REAL-TIME AI ANOMALY DETECTION',
    riskAssessmentTitle: 'MULTIMODAL AI RISK ENGINE',
    fusionTitle: 'MULTIMODAL SENSOR FUSION',
    environmentalAnomaly: 'Environmental Gas Anomaly',
    thermalSignature: 'Thermal Human Heat Signature',
    acousticDistress: 'Acoustic Screaming / Distress',
    seismicVibration: 'Seismic Tunnel Vibration',
    anomalyProbability: 'Anomaly Probability',
    statutoryDisclaimer: 'MSHA / Statutory Mining Safety Decision-Support Tool. Does not replace statutory rescue command authority.',

    // Event Management
    eventLogTitle: 'HAZARD & EMERGENCY EVENT LOG',
    filterAll: 'All Severity',
    filterCritical: 'Critical Only',
    filterHigh: 'High Only',
    acknowledge: 'Acknowledge',
    acknowledged: 'Acknowledged',
    timestamp: 'TIMESTAMP',
    eventType: 'EVENT TYPE',
    severity: 'SEVERITY',
    location: 'LOCATION',
    sensors: 'SENSORS',
    actions: 'ACTIONS',

    // Emergency Alert Banner
    criticalEmergency: 'CRITICAL EMERGENCY EVENT',
    ackEmergencyAlert: 'ACKNOWLEDGE EMERGENCY ALERT',

    // Language Selector
    language: 'Language'
  },
  hi: {
    // Brand & App
    appName: 'खदान बचाव एआई',
    appSubtitle: 'कमांड और नियंत्रण प्रणाली',
    homeTab: 'मुख्य विवरण',
    dashboardTab: 'बचाव डैशबोर्ड',
    archTab: 'सिस्टम संरचना',
    historyTab: 'टेलीमेट्री इतिहास',
    apiStatus: 'एपीआई',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    demoSimulation: 'सिमुलेशन मोड',
    realEsp32: 'वास्तविक ESP32',
    liveApi: 'लाइव एपीआई',
    connectRover: 'रोवर जोड़ें',
    risk: 'जोखिम',
    
    // Telemetry Cards
    gasConcentration: 'गैस सांद्रता (मीथेन/CO)',
    temperature: 'तापमान',
    humidity: 'आर्द्रता (नमी)',
    vibrationSeismic: 'भूकंपीय कंपन',
    batteryMonitor: 'बैटरी स्थिति',
    imuAttitude: 'IMU 3-अक्ष स्थिति',
    minePosition: 'खदान में स्थिति',
    gasLimit: 'सुरक्षित सीमा: <25 ppm | चेतावनी: 40 ppm',
    tempLimit: 'सामान्य तापमान: 20-30°C | चेतावनी: >34°C',
    humidityLimit: 'इष्टतम हवा की नमी: 50-75%',
    vibrationLimit: 'संरचनात्मक खतरे की चेतावनी: >0.25g',
    safe: 'सुरक्षित',
    warning: 'चेतावनी',
    critical: 'अति गंभीर',
    high: 'उच्च',
    moderate: 'मध्यम',
    normal: 'सामान्य',

    // Rover Controls
    roverController: 'रिमोट रोवर कमांड नियंत्रक',
    wasdEnabled: 'WASD / तीर कुंजियाँ सक्रिय',
    simNotice: 'सिमुलेशन मोड: WASD कुंजियाँ रोवर की स्थिति बदलती हैं।',
    forward: 'आगे बढ़ें',
    left: 'बाएं मुड़ें',
    stop: 'रोकें',
    right: 'दाएं मुड़ें',
    reverse: 'पीछे जाएं',
    driveSpeed: 'ड्राइव गति नियंत्रण',
    headlight: 'हेडलाइट',
    buzzer: 'अलार्म बज़र',
    emergencyStop: 'आपातकालीन तुरंत रोकें (E-STOP)',
    cmdAck: 'आदेश स्वीकार हुआ',
    cmdFail: 'आदेश विफल रहा',

    // 2D Map
    mapTitle: '2D भूमिगत खदान मानचित्र एवं रोवर स्थिति',
    localMesh: 'मीटर ग्रिड',
    roverPos: 'रोवर की स्थिति',
    gasHeatHazard: 'गैस/गर्मी का खतरा',
    trappedWorker: 'फंसे हुए श्रमिक',
    hazardGasHeat: 'खतरा: गैस और तापमान वृद्धि',
    workerConfirmed: 'श्रमिक की उपस्थिति पुष्ट (36.8°C)',

    // Camera & AI Panels
    cameraFeeds: 'ऑप्टिकल एवं थर्मल कैमरा फीड्स',
    rgbOptical: 'RGB ऑप्टिकल कैमरा',
    thermalIr: 'थर्मल इन्फ्रारेड हीट विज़न',
    aiDetectionTitle: 'रीयल-टाइम एआई विसंगति पहचान',
    riskAssessmentTitle: 'मल्टीमॉडल एआई जोखिम इंजन',
    fusionTitle: 'मल्टीमॉडल सेंसर एकीकरण',
    environmentalAnomaly: 'पर्यावरणीय गैस विसंगति',
    thermalSignature: 'मानव शरीर का ऊष्मा संकेत',
    acousticDistress: 'ध्वनि/चीख की पहचान',
    seismicVibration: 'खदान सुरंग का कंपन',
    anomalyProbability: 'विसंगति की संभावना',
    statutoryDisclaimer: 'वैधानिक खनन सुरक्षा निर्णय सहायता प्रणाली। यह आधिकारिक आपातकालीन प्रोटोकॉल का विकल्प नहीं है।',

    // Event Management
    eventLogTitle: 'खतरा एवं आपातकालीन घटना लॉग',
    filterAll: 'सभी स्तर',
    filterCritical: 'केवल अति गंभीर',
    filterHigh: 'केवल उच्च',
    acknowledge: 'स्वीकार करें',
    acknowledged: 'स्वीकृत',
    timestamp: 'समय',
    eventType: 'घटना प्रकार',
    severity: 'गंभीरता',
    location: 'स्थान',
    sensors: 'सेंसर स्रोत',
    actions: 'कार्रवाई',

    // Emergency Alert Banner
    criticalEmergency: 'अति गंभीर आपातकालीन घटना',
    ackEmergencyAlert: 'आपातकालीन चेतावनी स्वीकार करें',

    // Language Selector
    language: 'भाषा'
  },
  te: {
    // Brand & App
    appName: 'మైన్ రెస్క్యూ AI',
    appSubtitle: 'కమాండ్ & కంట్రోల్ సిస్టమ్',
    homeTab: 'హోమ్ అవలోకనం',
    dashboardTab: 'రెస్క్యూ డ్యాష్‌బోర్డ్',
    archTab: 'సిస్టమ్ ఆర్కిటెక్చర్',
    historyTab: 'టెలిమెట్రీ హిస్టరీ',
    apiStatus: 'API',
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',
    demoSimulation: 'డెమో సిమ్యులేషన్',
    realEsp32: 'నిజమైన ESP32',
    liveApi: 'లైవ్ API',
    connectRover: 'రోవర్‌ను కనెక్ట్ చేయండి',
    risk: 'ప్రమాదం',
    
    // Telemetry Cards
    gasConcentration: 'గ్యాస్ సాంద్రత',
    temperature: 'ఉష్ణోగ్రత',
    humidity: 'తేమ శాతం',
    vibrationSeismic: 'భూకంప ప్రకంపనలు',
    batteryMonitor: 'బ్యాటరీ స్థాయి',
    imuAttitude: 'IMU 3-యాక్సిస్ ఓరియంటేషన్',
    minePosition: 'గనిలో రోవర్ స్థానం',
    gasLimit: 'సురక్షిత పరిమితి: <25 ppm | హెచ్చరిక: 40 ppm',
    tempLimit: 'సాధారణ పరిధి: 20-30°C | హెచ్చరిక: >34°C',
    humidityLimit: 'ఆదర్శ తేమ: 50-75%',
    vibrationLimit: 'ప్రమాద హెచ్చరిక: >0.25g',
    safe: 'సురక్షితం',
    warning: 'హెచ్చరిక',
    critical: 'అత్యవసరం',
    high: 'ఎక్కువ ప్రమాదం',
    moderate: 'మధ్యస్థం',
    normal: 'సాధారణం',

    // Rover Controls
    roverController: 'రోవర్ రిమోట్ కంట్రోలర్',
    wasdEnabled: 'WASD / బాణాలు ఆన్‌లో ఉన్నాయి',
    simNotice: 'సిమ్యులేషన్ మోడ్: WASD కీలు రోవర్ స్థానాన్ని మారుస్తాయి.',
    forward: 'ముందుకు',
    left: 'ఎడమకు',
    stop: 'ఆపండి',
    right: 'కుడికి',
    reverse: 'వెనుకకు',
    driveSpeed: 'రోవర్ వేగం',
    headlight: 'హెడ్‌లైట్',
    buzzer: 'బజర్ అలారం',
    emergencyStop: 'తక్షణ ఎమర్జెన్సీ స్టాప్',
    cmdAck: 'కమాండ్ అందింది',
    cmdFail: 'కమాండ్ విఫలమైంది',

    // 2D Map
    mapTitle: '2D గని మ్యాప్ & రోవర్ నావిగేషన్',
    localMesh: 'మీటర్ల గ్రిడ్',
    roverPos: 'రోవర్ స్థానం',
    gasHeatHazard: 'గ్యాస్/వేడి ప్రమాదం',
    trappedWorker: 'చిక్కుకున్న కార్మికుడు',
    hazardGasHeat: 'ప్రమాదం: గ్యాస్ మరియు ఉష్ణోగ్రత పెరుగుదల',
    workerConfirmed: 'కార్మికుడు గుర్తించబడ్డాడు (36.8°C)',

    // Camera & AI Panels
    cameraFeeds: 'RGB & థర్మల్ కెమెరా లైవ్ ఫీడ్లు',
    rgbOptical: 'RGB కెమెరా ఫీడ్',
    thermalIr: 'థర్మల్ ఇన్‌ఫ్రారెడ్ హీట్ కెమెరా',
    aiDetectionTitle: 'రియల్-టైమ్ AI ప్రమాద గుర్తింపు',
    riskAssessmentTitle: 'మల్టీమోడల్ AI రిస్క్ ఇంజిన్',
    fusionTitle: 'మల్టీమోడల్ సెన్సార్ ఫ్యూజన్',
    environmentalAnomaly: 'వాతావరణ గ్యాస్ లోపం',
    thermalSignature: 'మానవ శరీర వేడి గుర్తింపు',
    acousticDistress: 'శబ్ద/కేకల గుర్తింపు',
    seismicVibration: 'టన్నెల్ ప్రకంపనలు',
    anomalyProbability: 'ప్రమాద సంభావ్యత',
    statutoryDisclaimer: 'మైనింగ్ భద్రతా నిర్ణయ సహాయక సాధనం. ఇది అధికారిక ఆదేశాలను భర్తీ చేయదు.',

    // Event Management
    eventLogTitle: 'ప్రమాదాల మరియు ఈవెంట్స్ లాగ్',
    filterAll: 'అన్ని స్థాయిలు',
    filterCritical: 'అత్యవసరమైనవి మాత్రమే',
    filterHigh: 'ఎక్కువ ప్రమాదకరమైనవి',
    acknowledge: 'ధృవీకరించండి',
    acknowledged: 'ధృవీకరించబడింది',
    timestamp: 'సమయం',
    eventType: 'ఈవెంట్ రకం',
    severity: 'తీవ్రత',
    location: 'స్థానం',
    sensors: 'సెన్సార్లు',
    actions: 'చర్యలు',

    // Emergency Alert Banner
    criticalEmergency: 'అత్యవసర అత్యవసర సంఘటన',
    ackEmergencyAlert: 'ఎమర్జెన్సీ అలర్ట్ అంగీకరించండి',

    // Language Selector
    language: 'భాష'
  },
  es: {
    // Brand & App
    appName: 'IA RESCATE MINERO',
    appSubtitle: 'SISTEMA DE MANDO Y CONTROL',
    homeTab: 'Resumen General',
    dashboardTab: 'Panel de Rescate',
    archTab: 'Arquitectura del Sistema',
    historyTab: 'Historial de Telemetría',
    apiStatus: 'API',
    online: 'EN LÍNEA',
    offline: 'DESCONECTADO',
    demoSimulation: 'MODO SIMULACIÓN',
    realEsp32: 'ESP32 REAL',
    liveApi: 'API en Vivo',
    connectRover: 'Conectar Rover',
    risk: 'RIESGO',
    
    // Telemetry Cards
    gasConcentration: 'CONCENTRACIÓN DE GAS',
    temperature: 'TEMPERATURA',
    humidity: 'HUMEDAD',
    vibrationSeismic: 'VIBRACIÓN / SÍSMICA',
    batteryMonitor: 'ESTADO DE BATERÍA',
    imuAttitude: 'ORIENTACIÓN IMU 3 EJES',
    minePosition: 'POSICIÓN EN MINA',
    gasLimit: 'Límite Seguro: <25 ppm | Umbral: 40 ppm',
    tempLimit: 'Base Mina: 20-30°C | Alerta: >34°C',
    humidityLimit: 'Humedad Óptima: 50-75%',
    vibrationLimit: 'Alerta Estructural: >0.25g',
    safe: 'SEGURO',
    warning: 'ADVERTENCIA',
    critical: 'CRÍTICO',
    high: 'ALTO',
    moderate: 'MODERADO',
    normal: 'NORMAL',

    // Rover Controls
    roverController: 'CONTROL REMOTO DEL ROVER',
    wasdEnabled: 'WASD / FLECHAS ACTIVAS',
    simNotice: 'MODO SIMULACIÓN: Las teclas WASD mueven la posición en el túnel.',
    forward: 'ADELANTE',
    left: 'IZQUIERDA',
    stop: 'PARAR',
    right: 'DERECHA',
    reverse: 'REVERSA',
    driveSpeed: 'Control de Velocidad',
    headlight: 'Faros',
    buzzer: 'Alarma Acústica',
    emergencyStop: 'PARADA DE EMERGENCIA TOTAL',
    cmdAck: 'COMANDO CONFIRMADO',
    cmdFail: 'FALLO EN EL COMANDO',

    // 2D Map
    mapTitle: 'Mapa 2D de la Mina Subterránea',
    localMesh: 'MALLA LOCAL (METROS)',
    roverPos: 'Posición del Rover',
    gasHeatHazard: 'Peligro Gas/Calor',
    trappedWorker: 'Trabajador Atrapado',
    hazardGasHeat: 'PELIGRO: PICO DE GAS Y CALOR',
    workerConfirmed: 'TRABAJADOR CONFIRMADO (36.8°C)',

    // Camera & AI Panels
    cameraFeeds: 'CÁMARAS ÓPTICA Y TÉRMICA EN VIVO',
    rgbOptical: 'CÁMARA ÓPTICA RGB',
    thermalIr: 'VISIÓN TÉRMICA INFRARROJA',
    aiDetectionTitle: 'DETECCIÓN DE ANOMALÍAS POR IA',
    riskAssessmentTitle: 'MOTOR DE RIESGO MULTIMODAL IA',
    fusionTitle: 'FUSIÓN DE SENSORES MULTIMODAL',
    environmentalAnomaly: 'Anomalía de Gas Ambiental',
    thermalSignature: 'Firma Térmica Humana',
    acousticDistress: 'Señal Acústica de Auxilio',
    seismicVibration: 'Vibración del Túnel',
    anomalyProbability: 'Probabilidad de Anomalía',
    statutoryDisclaimer: 'Herramienta de soporte para rescates mineros. No reemplaza los protocolos oficiales.',

    // Event Management
    eventLogTitle: 'REGISTRO DE EVENTOS Y PELIGROS',
    filterAll: 'Toda Severidad',
    filterCritical: 'Solo Críticos',
    filterHigh: 'Solo Altos',
    acknowledge: 'Reconocer',
    acknowledged: 'Reconocido',
    timestamp: 'HORA',
    eventType: 'TIPO DE EVENTO',
    severity: 'SEVERIDAD',
    location: 'UBICACIÓN',
    sensors: 'SENSORES',
    actions: 'ACCIONES',

    // Emergency Alert Banner
    criticalEmergency: 'EVENTO DE EMERGENCIA CRÍTICO',
    ackEmergencyAlert: 'RECONOCER ALERTA DE EMERGENCIA',

    // Language Selector
    language: 'Idioma'
  },
  fr: {
    // Brand & App
    appName: 'IA SECOURS MINIER',
    appSubtitle: 'SYSTÈME DE COMMANDE ET CONTRÔLE',
    homeTab: 'Vue Générale',
    dashboardTab: 'Tableau de Secours',
    archTab: 'Architecture Système',
    historyTab: 'Historique Télémétrie',
    apiStatus: 'API',
    online: 'EN LIGNE',
    offline: 'HORS LIGNE',
    demoSimulation: 'MODE SIMULATION',
    realEsp32: 'ESP32 RÉEL',
    liveApi: 'API en Direct',
    connectRover: 'Connecter Rover',
    risk: 'RISQUE',
    
    // Telemetry Cards
    gasConcentration: 'CONCENTRATION DE GAZ',
    temperature: 'TEMPÉRATURE',
    humidity: 'HUMIDITÉ',
    vibrationSeismic: 'VIBRATION / SISMIQUE',
    batteryMonitor: 'NIVEAU DE BATTERIE',
    imuAttitude: 'ATTITUDE IMU 3 AXES',
    minePosition: 'POSITION DANS LA MINE',
    gasLimit: 'Limite Sûre: <25 ppm | Seuil: 40 ppm',
    tempLimit: 'Base Mine: 20-30°C | Alerte: >34°C',
    humidityLimit: 'Humidité Optimale: 50-75%',
    vibrationLimit: 'Alerte Structure: >0.25g',
    safe: 'SÛR',
    warning: 'ATTENTION',
    critical: 'CRITIQUE',
    high: 'ÉLEVÉ',
    moderate: 'MODÉRÉ',
    normal: 'NORMAL',

    // Rover Controls
    roverController: 'TÉLÉCOMMANDE DU ROVER',
    wasdEnabled: 'WASD / FLÈCHES ACTIVES',
    simNotice: 'MODE SIMULATION: Les touches WASD déplacent le rover dans le tunnel.',
    forward: 'AVANCER',
    left: 'GAUCHE',
    stop: 'ARRÊT',
    right: 'DROITE',
    reverse: 'RECULER',
    driveSpeed: 'Régulateur de Vitesse',
    headlight: 'Projecteurs',
    buzzer: 'Avertisseur Sonore',
    emergencyStop: 'ARRÊT D\'URGENCE TOTAL',
    cmdAck: 'COMMANDE VALIDÉE',
    cmdFail: 'ÉCHEC DE LA COMMANDE',

    // 2D Map
    mapTitle: 'Carte 2D de la Mine Souterraine',
    localMesh: 'GRILLE LOCALE (MÈTRES)',
    roverPos: 'Position du Rover',
    gasHeatHazard: 'Danger Gaz/Chaleur',
    trappedWorker: 'Mineur Piégé',
    hazardGasHeat: 'DANGER: PIC DE GAZ & CHALEUR',
    workerConfirmed: 'MINEUR PIÉGÉ CONFIRMÉ (36.8°C)',

    // Camera & AI Panels
    cameraFeeds: 'FLUX CAMÉRA OPTIQUE & THERMIQUE',
    rgbOptical: 'CAMÉRA OPTIQUE RGB',
    thermalIr: 'VISION THERMIQUE INFRAROUGE',
    aiDetectionTitle: 'DÉTECTION D\'ANOMALIES PAR IA',
    riskAssessmentTitle: 'MOTEUR DE RISQUE MULTIMODAL IA',
    fusionTitle: 'FUSION MULTIMODALE DE CAPTEURS',
    environmentalAnomaly: 'Anomalie de Gaz Environnemental',
    thermalSignature: 'Signature Thermique Humaine',
    acousticDistress: 'Signal Acoustique de Détresse',
    seismicVibration: 'Vibration du Tunnel',
    anomalyProbability: 'Probabilité d\'Anomalie',
    statutoryDisclaimer: 'Outil d\'aide à la décision pour sauvetage minier.',

    // Event Management
    eventLogTitle: 'JOURNAL DES INCIDENTS ET DANGERS',
    filterAll: 'Toutes Gravités',
    filterCritical: 'Critique Uniquement',
    filterHigh: 'Élevé Uniquement',
    acknowledge: 'Acquitter',
    acknowledged: 'Acquitté',
    timestamp: 'HORODATAGE',
    eventType: 'TYPE D\'ÉVÉNEMENT',
    severity: 'GRAVITÉ',
    location: 'LOCALISATION',
    sensors: 'CAPTEURS',
    actions: 'ACTIONS',

    // Emergency Alert Banner
    criticalEmergency: 'ÉVÉNEMENT D\'URGENCE CRITIQUE',
    ackEmergencyAlert: 'ACQUITTER L\'ALERTE D\'URGENCE',

    // Language Selector
    language: 'Langue'
  },
  de: {
    // Brand & App
    appName: 'BERGBAU RETTUNG KI',
    appSubtitle: 'BEFEHLS- UND KONTROLLSYSTEM',
    homeTab: 'Übersicht',
    dashboardTab: 'Rettungs-Dashboard',
    archTab: 'Systemarchitektur',
    historyTab: 'Telemetrie-Historie',
    apiStatus: 'API',
    online: 'ONLINE',
    offline: 'OFFLINE',
    demoSimulation: 'SIMULATIONSMODUS',
    realEsp32: 'ECHTES ESP32',
    liveApi: 'Live API',
    connectRover: 'Rover Verbinden',
    risk: 'RISIKO',
    
    // Telemetry Cards
    gasConcentration: 'GASKONZENTRATION',
    temperature: 'TEMPERATUR',
    humidity: 'LUFTFEUCHTIGKEIT',
    vibrationSeismic: 'VIBRATION / SEISMIK',
    batteryMonitor: 'BATTERIESTATUS',
    imuAttitude: 'IMU 3-ACHSEN-LAGE',
    minePosition: 'STANDORT IM STOLLEN',
    gasLimit: 'Sicherer Bereich: <25 ppm | Alarm: 40 ppm',
    tempLimit: 'Stollen-Basis: 20-30°C | Alarm: >34°C',
    humidityLimit: 'Optimale Feuchte: 50-75%',
    vibrationLimit: 'Struktur-Warnung: >0.25g',
    safe: 'SICHER',
    warning: 'WARNUNG',
    critical: 'KRITISCH',
    high: 'HOCH',
    moderate: 'MODERAT',
    normal: 'NORMAL',

    // Rover Controls
    roverController: 'ROVER FERNBEDIENUNG',
    wasdEnabled: 'WASD / PFEILTASTEN AKTIV',
    simNotice: 'SIMULATION: WASD Tasten steuern die Rover-Position.',
    forward: 'VORWÄRTS',
    left: 'LINKS',
    stop: 'HALT',
    right: 'RECHTS',
    reverse: 'RÜCKWÄRTS',
    driveSpeed: 'Geschwindigkeitsregler',
    headlight: 'Scheinwerfer',
    buzzer: 'Akustischer Summer',
    emergencyStop: 'NOT-HALT SOFORT (E-STOP)',
    cmdAck: 'BEFEHL BESTÄTIGT',
    cmdFail: 'BEFEHL FEHLGESCHLAGEN',

    // 2D Map
    mapTitle: '2D Grubenkarte & Ortungssystem',
    localMesh: 'METER-GITTER',
    roverPos: 'Rover Position',
    gasHeatHazard: 'Gas-/Hitzewarnung',
    trappedWorker: 'Eingeschlossener Bergarbeiter',
    hazardGasHeat: 'GEFAHR: GAS- UND HITZEANSTIEG',
    workerConfirmed: 'BERGARBEITER GEFUNDEN (36.8°C)',

    // Camera & AI Panels
    cameraFeeds: 'OPTISCHE & THERMISCHE KAMERA-FEEDS',
    rgbOptical: 'RGB KAMERA',
    thermalIr: 'INFRAROT WÄRMEKAMERA',
    aiDetectionTitle: 'ECHTZEIT KI-ANOMALIEERKENNUNG',
    riskAssessmentTitle: 'MULTIMODALE KI-RISIKO-ENGINE',
    fusionTitle: 'MULTIMODALE SENSORFUSION',
    environmentalAnomaly: 'Umweltgas-Anomalie',
    thermalSignature: 'Menschliche Wärmesignatur',
    acousticDistress: 'Akustisches Notsignal',
    seismicVibration: 'Stollenvibration',
    anomalyProbability: 'Anomaliewahrscheinlichkeit',
    statutoryDisclaimer: 'Entscheidungsunterstützung für den Grubenrettungsdienst.',

    // Event Management
    eventLogTitle: 'GEFAHREN- UND EREIGNISPROTOKOLL',
    filterAll: 'Alle Stufen',
    filterCritical: 'Nur Kritisch',
    filterHigh: 'Nur Hoch',
    acknowledge: 'Bestätigen',
    acknowledged: 'Bestätigt',
    timestamp: 'ZEITSTEMPEL',
    eventType: 'EREIGNISART',
    severity: 'SCHWEREGRAD',
    location: 'STANDORT',
    sensors: 'SENSOREN',
    actions: 'AKTIONEN',

    // Emergency Alert Banner
    criticalEmergency: 'KRITISCHES NOTFALLEREIGNIS',
    ackEmergencyAlert: 'NOTFALLALARM BESTÄTIGEN',

    // Language Selector
    language: 'Sprache'
  },
  zh: {
    // Brand & App
    appName: '地下矿井AI救援系统',
    appSubtitle: '应急指挥与控制中心',
    homeTab: '系统总览',
    dashboardTab: '救援指挥面板',
    archTab: '系统架构',
    historyTab: '遥测历史记录',
    apiStatus: 'API',
    online: '在线',
    offline: '离线',
    demoSimulation: '模拟演示模式',
    realEsp32: '真实ESP32硬件',
    liveApi: '实时API',
    connectRover: '连接救援机器人',
    risk: '风险等级',
    
    // Telemetry Cards
    gasConcentration: '瓦斯/一氧化碳浓度',
    temperature: '巷道环境温度',
    humidity: '相对湿度',
    vibrationSeismic: '地震与结构震动',
    batteryMonitor: '电池电量监测',
    imuAttitude: 'IMU三轴姿态角度',
    minePosition: '巷道坐标位置',
    gasLimit: '安全范围: <25 ppm | 告警阈值: 40 ppm',
    tempLimit: '井下基准: 20-30°C | 危险温度: >34°C',
    humidityLimit: '适宜湿度范围: 50-75%',
    vibrationLimit: '坍塌预警阈值: >0.25g',
    safe: '安全',
    warning: '预警',
    critical: '极度危险',
    high: '高度危险',
    moderate: '中度风险',
    normal: '正常',

    // Rover Controls
    roverController: '机器人远程遥控终端',
    wasdEnabled: 'WASD / 方向键已启用',
    simNotice: '模拟模式：使用WASD键可实时更新机器人位置坐标。',
    forward: '前进',
    left: '左转',
    stop: '急停',
    right: '右转',
    reverse: '后退',
    driveSpeed: '行进速度控制',
    headlight: '照明探照灯',
    buzzer: '应急蜂鸣警报',
    emergencyStop: '全局紧急硬制动 (E-STOP)',
    cmdAck: '指令执行成功',
    cmdFail: '指令传输失败',

    // 2D Map
    mapTitle: '2D井下巷道地图与定位系统',
    localMesh: '米制网格',
    roverPos: '机器人位置',
    gasHeatHazard: '毒气/高温危险区',
    trappedWorker: '被困矿工位置',
    hazardGasHeat: '危险区域: 瓦斯与高温异常',
    workerConfirmed: '已确认被困矿工生命体征 (36.8°C)',

    // Camera & AI Panels
    cameraFeeds: '多光谱光学与红外热成像',
    rgbOptical: 'RGB可见光探照摄像头',
    thermalIr: '红外热成像生命体征监测',
    aiDetectionTitle: 'AI实时异常事件检测',
    riskAssessmentTitle: '多模态AI综合风险评估引擎',
    fusionTitle: '多模态多传感器智能融合',
    environmentalAnomaly: '井下环境气体异常',
    thermalSignature: '人体红外热特征识别',
    acousticDistress: '声音求救与呼喊检测',
    seismicVibration: '巷道岩层震动异常',
    anomalyProbability: '异常发生概率',
    statutoryDisclaimer: '矿山安全应急辅助决策系统。本系统数据供指挥员参考，不替代法定救护规程。',

    // Event Management
    eventLogTitle: '突发危险事件与告警日志',
    filterAll: '全部级别',
    filterCritical: '仅显示极度危险',
    filterHigh: '仅显示高危事件',
    acknowledge: '确认并消除',
    acknowledged: '已确认',
    timestamp: '时间戳',
    eventType: '事件类型',
    severity: '风险等级',
    location: '发生位置',
    sensors: '触发传感器',
    actions: '处理操作',

    // Emergency Alert Banner
    criticalEmergency: '严重紧急事件警报',
    ackEmergencyAlert: '立即确认紧急警报',

    // Language Selector
    language: '语言选择'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('mine_rescue_lang') || 'en';
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('mine_rescue_lang', newLang);
    }
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
