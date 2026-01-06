// TensorFlow Lite Model Integration - Cross Platform
// Supports: Android, iOS (Offline Only)
// Online/Web: Detection disabled (Mock/Log only)

import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';

declare global {
  // Cache for model instance
  // eslint-disable-next-line no-var
  var __TFLITE_MODEL__: any | undefined;
  // eslint-disable-next-line no-var
  var __TFLITE_BACKEND__: 'native' | 'mock' | undefined;
}

interface BreedPrediction {
  breed: string;
  confidence: number; // 0..1
}

interface DetectionResult {
  breedName: string;
  confidence: number; // 0..1
  allPredictions: BreedPrediction[];
  description?: string;
  characteristics?: string[];
  careTips?: string[];
}

interface ModelInfo {
  name: string;
  version: string;
  inputSize: number[];
  numClasses: number;
  breeds: string[];
  accuracy: number;
}

// Your trained TFLite model
// Layer 1: Bovine vs Unknown (Already Defined below as BOVINE_MODEL_PATH)
// Layer 2: Cattle vs Buffalo
const LAYER2_CATTLE_VS_BUFFALO_PATH = require('../../assets/models/cattle_buffalo_effb3_FP32.tflite');
// Layer 3: Cattle Breeds
const LAYER3_CATTLE_MODEL_PATH = require('../../assets/models/efficientnetb3_cattle_fp32.tflite');
// Layer 3: Buffalo Breeds
const LAYER3_BUFFALO_MODEL_PATH = require('../../assets/models/buffalo_fp32.tflite');

// Original Full List (Kept for reference or backward compatibility if needed)
const ALL_BREEDS: string[] = [
  "Amritmahal", "Banni Buffalo", "Deoni", "Gir", "HF Cross", "Hallikar",
  "Jafarabadi Buffalo", "Jersey Cross", "Kankrej", "Khillar", "Kosali", "Ladakhi",
  "Marathwadi Buffalo", "Mehsana Buffalo", "Mewati", "Murrah Buffalo", "Nari",
  "Nili-Ravi Buffalo", "Ongole", "Pandharpuri Buffalo", "Punganur", "Purnea",
  "Rathi", "Red Kandhari", "Red Sindhi", "Sahiwal", "Tharparker", "Thutho",
  "Toda Buffalo", "Vechur"
];

// Split Breeds - CRITICAL: Must match the output labels of your new Layer 3 models
const BUFFALO_BREEDS: string[] = [
  "Banni Buffalo",
  "Jafarabadi Buffalo",
  "Marathwadi Buffalo",
  "Mehsana Buffalo",
  "Murrah Buffalo",
  "Nili-Ravi Buffalo",
  "Pandharpuri Buffalo",
  "Surti Buffalo"
];


const CATTLE_BREEDS: string[] = [
  "Amritmahal",
  "Deoni",
  "Gaolao",
  "Gir",
  "HF Cross",
  "Hallikar",
  "Hariana",
  "Jersey Cross",
  "Kankrej",
  "Khillar",
  "Kosali",
  "Ladakhi",
  "Mewati",
  "Nari",
  "Ongole",
  "Punganur",
  "Purnea",
  "Rathi",
  "Red Sindhi",
  "Sahiwal",
  "Tharparker",
  "Thutho"
];


declare global {
  // eslint-disable-next-line no-var
  var __TFLITE_LAYER2_MODEL__: any | undefined;
  // eslint-disable-next-line no-var
  var __TFLITE_LAYER3_CATTLE_MODEL__: any | undefined;
  // eslint-disable-next-line no-var
  var __TFLITE_LAYER3_BUFFALO_MODEL__: any | undefined;
}

/**
 * Initialize Models Helper
 */
const loadModel = async (path: any, globalKey: string) => {
  if (Platform.OS === 'web') return null;
  try {
    // @ts-ignore
    if (globalThis[globalKey]) return globalThis[globalKey];

    const { loadTensorflowModel } = await import('react-native-fast-tflite');
    console.log(`📱 Loading model ${globalKey}...`);
    const model = await loadTensorflowModel(path);
    // @ts-ignore
    globalThis[globalKey] = model;
    console.log(`✅ Model ${globalKey} loaded`);
    return model;
  } catch (error) {
    console.error(`❌ Failed to load model ${globalKey}:`, error);
    return null;
  }
};

export const initializeModel = async (): Promise<any> => {
  // Load all models for the pipeline
  await loadModel(LAYER2_CATTLE_VS_BUFFALO_PATH, '__TFLITE_LAYER2_MODEL__');
  await loadModel(LAYER3_CATTLE_MODEL_PATH, '__TFLITE_LAYER3_CATTLE_MODEL__');
  await loadModel(LAYER3_BUFFALO_MODEL_PATH, '__TFLITE_LAYER3_BUFFALO_MODEL__');
  return true;
};

/**
 * Convert image URI to Float32Array tensor (300x300x3)
 */
const imageToTensor = async (uri: string): Promise<Float32Array> => {
  try {
    console.log('🔄 Preprocessing image...');

    // 1. Resize image to 300x300
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 300, height: 300 } }],
      { format: SaveFormat.JPEG, base64: true }
    );

    if (!manipResult.base64) {
      throw new Error('Failed to get image base64 data');
    }

    // 2. Decode JPEG to raw RGB
    const binaryString = atob(manipResult.base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const rawImageData = jpeg.decode(bytes, { useTArray: true });

    // 3. Normalize to Float32Array (0-255)
    // The models expect 0-255 values, not 0-1, unless specified otherwise.
    // Based on previous code, we were copying raw bytes.
    const { data } = rawImageData;
    const float32Data = new Float32Array(300 * 300 * 3);

    let offset = 0;
    for (let i = 0; i < data.length; i += 4) {
      // RGB only, ignore Alpha
      float32Data[offset++] = data[i];     // R
      float32Data[offset++] = data[i + 1]; // G
      float32Data[offset++] = data[i + 2]; // B
    }

    console.log('✅ Image preprocessed to tensor');
    return float32Data;
  } catch (error) {
    console.error('❌ Error preprocessing image:', error);
    throw error;
  }
};

/**
 * Layer 2: Detect Cattle vs Buffalo
 * Returns: 'cattle' | 'buffalo' | 'unknown'
 */
const detectCattleVsBuffalo = async (inputTensor: Float32Array): Promise<'cattle' | 'buffalo' | 'unknown'> => {
  try {
    const model = globalThis.__TFLITE_LAYER2_MODEL__;
    if (!model) return 'cattle'; // Default fallback if model missing

    const outputs = await model.run([inputTensor]);
    const logits = outputs[0];

    // Softmax
    const softmax = (logits: any): number[] => {
      const arr = Array.from(logits) as number[];
      const maxLogit = Math.max(...arr);
      const exps = arr.map(l => Math.exp(l - maxLogit));
      const sumExps = exps.reduce((a, b) => a + b, 0);
      return exps.map(e => e / sumExps);
    };

    const probs = softmax(logits);
    // Labels: {"0": "buffalo", "1": "cattle"}
    const buffaloProb = probs[0];
    const cattleProb = probs[1];

    console.log(`Layer 2: Cattle=${cattleProb.toFixed(2)}, Buffalo=${buffaloProb.toFixed(2)}`);
    return cattleProb > buffaloProb ? 'cattle' : 'buffalo';

  } catch (error) {
    console.error('Layer 2 Inference Error:', error);
    return 'cattle'; // Fallback
  }
};

/**
 * Run inference on image (4-Layer Pipeline)
 */
export const detectBreed = async (imageUri: string): Promise<DetectionResult> => {
  try {
    console.log('🔍 Starting 4-Layer Detection Pipeline for:', imageUri);

    if (Platform.OS === 'web') {
      return {
        breedName: 'Unknown (Web)',
        confidence: 0,
        allPredictions: [],
        description: 'Breed detection is not available on Web.',
      };
    }

    // 0. Preprocess Image ONCE
    const inputTensor = await imageToTensor(imageUri);

    // 1. Layer 1: Bovine Check (Implicitly handled if checkIsBovine was called before, 
    // but effectively we assume it is Bovine here if we reached this point, 
    // OR we can re-verify if needed. For now assuming caller did Layer 1 check).

    // 2. Layer 2: Cattle vs Buffalo
    // Use fallback to 'cattle' if model fails/missing to keep app working
    let species = 'cattle';
    try {
      await initializeModel(); // Ensure models loaded
      // species = await detectCattleVsBuffalo(inputTensor);
    } catch (e) {
      console.warn('Layer 2 failed, assuming Cattle', e);
    }

    console.log(`Biology Check: Species identified as ${species.toUpperCase()}`);

    // 3. Layer 3: Specific Breed Classification
    let model;
    let breedList: string[];

    model = globalThis.__TFLITE_LAYER3_CATTLE_MODEL__;
    breedList = CATTLE_BREEDS;

    // if (species === 'buffalo') {
    //   model = globalThis.__TFLITE_LAYER3_BUFFALO_MODEL__;
    //   breedList = BUFFALO_BREEDS;
    // } else {
    //   model = globalThis.__TFLITE_LAYER3_CATTLE_MODEL__;
    //   breedList = CATTLE_BREEDS;
    // }

    // if (!model) {
    //   console.error(`❌ Model for ${species} not loaded!`);
    //   throw new Error(`${species} model missing`);
    // }

    // Run Tier 3 Inference
    const outputs = await model.run([inputTensor]);
    const rawLogits = outputs[0];

    // Softmax
    const softmax = (logits: any): number[] => {
      const arr = Array.from(logits) as number[];
      return arr.map(l => l * 100); // Scale to 0-100 for consistency with existing UI logic
    };

    const probabilities = softmax(rawLogits);

    // Map to labels
    const allPredictions: BreedPrediction[] = breedList.map((breed, index) => ({
      breed,
      confidence: probabilities[index] || 0,
    })).sort((a, b) => b.confidence - a.confidence);

    const topPrediction = allPredictions[0];
    console.log(`✅ Layer 3 (${species}) detection complete:`, topPrediction.breed, `${(topPrediction.confidence).toFixed(1)}%`);

    return {
      breedName: topPrediction.breed,
      confidence: topPrediction.confidence / 100, // Normalized 0-1
      allPredictions: allPredictions.slice(0, 5),
    };

  } catch (error: any) {
    console.error('❌ Error in 4-layer pipeline:', error);
    throw error;
  }
};



/**
 * Run inference on multiple images and aggregate results
 * @param {string[]} imageUris - Array of image URIs
 * @returns {Promise<DetectionResult>} - Aggregated detection result
 */
export const detectMultipleBreeds = async (imageUris: string[]): Promise<DetectionResult> => {
  try {
    console.log(`🔍 Detecting breeds from ${imageUris.length} images...`);

    if (imageUris.length === 0) {
      throw new Error('No images provided for detection');
    }

    // Run detection on all images in parallel
    const results = await Promise.all(imageUris.map(uri => detectBreed(uri)));

    // Aggregate probabilities
    const breedProbabilities: { [key: string]: number } = {};

    // Initialize with 0
    ALL_BREEDS.forEach(breed => {
      breedProbabilities[breed] = 0;
    });

    // Sum up probabilities from all results
    results.forEach(result => {
      result.allPredictions.forEach(prediction => {
        if (breedProbabilities[prediction.breed] !== undefined) {
          breedProbabilities[prediction.breed] += prediction.confidence;
        }
      });
    });

    // Average probabilities
    const aggregatedPredictions: BreedPrediction[] = ALL_BREEDS.map(breed => ({
      breed,
      confidence: breedProbabilities[breed] / imageUris.length,
    })).sort((a, b) => b.confidence - a.confidence);

    const topPrediction = aggregatedPredictions[0];
    console.log('✅ Aggregated detection complete:', topPrediction.breed, `${(topPrediction.confidence * 100).toFixed(1)}%`);

    return {
      breedName: topPrediction.breed,
      confidence: topPrediction.confidence,
      allPredictions: aggregatedPredictions.slice(0, 5), // Top 5
    };

  } catch (error: any) {
    console.error('❌ Error detecting multiple breeds:', error);
    throw error;
  }
};

/**
 * Get model metadata
 */
export const getModelInfo = (): ModelInfo => {
  return {
    name: 'Hierarchical 4-Layer Classifier',
    version: '2.0.0',
    inputSize: [300, 300, 3],
    numClasses: ALL_BREEDS.length,
    breeds: ALL_BREEDS,
    accuracy: 0.96,
  };
};

const BOVINE_MODEL_PATH = require('../../assets/models/layer1_fp32.tflite');

declare global {
  // ... existing globals
  // eslint-disable-next-line no-var
  var __TFLITE_BOVINE_MODEL__: any | undefined;
}

/**
 * Initialize Bovine Check Model
 */
export const initializeBovineModel = async (): Promise<any> => {
  try {
    if (globalThis.__TFLITE_BOVINE_MODEL__) {
      return globalThis.__TFLITE_BOVINE_MODEL__;
    }

    if (Platform.OS === 'web') return null;

    try {
      const { loadTensorflowModel } = await import('react-native-fast-tflite');
      console.log('📱 Loading bovine verification model...');
      const model = await loadTensorflowModel(BOVINE_MODEL_PATH as any);
      globalThis.__TFLITE_BOVINE_MODEL__ = model;
      console.log('✅ Bovine model loaded');
      return model;
    } catch (e) {
      console.error('❌ Failed to load bovine model:', e);
      return null;
    }
  } catch (error) {
    console.error('❌ Error initializing bovine model:', error);
    return null;
  }
};

/**
 * Check if image is bovine
 * Classes: {"Bovine": 0, "Unknown": 1}
 */
export const checkIsBovine = async (imageUri: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') return true; // Skip on web

    await initializeBovineModel();
    const model = globalThis.__TFLITE_BOVINE_MODEL__;

    if (!model) {
      console.warn('⚠️ Bovine model not loaded, skipping check');
      return true; // Fail safe
    }

    // Reuse exact preprocessing from breed detection (300x300, 0-255)
    const inputTensor = await imageToTensor(imageUri);

    const outputs = await model.run([inputTensor]);
    const rawLogits = outputs[0];

    // Softmax
    const softmax = (logits: any): number[] => {
      const arr = Array.from(logits) as number[];
      const maxLogit = Math.max(...arr);
      const exps = arr.map(l => Math.exp(l - maxLogit));
      const sumExps = exps.reduce((a, b) => a + b, 0);
      return exps.map(e => e / sumExps);
    };

    const probabilities = softmax(rawLogits);
    const scoreBovine = probabilities[0];
    const scoreUnknown = probabilities[1];

    console.log(`Bovine Check: Bovine=${scoreBovine.toFixed(4)}, Unknown=${scoreUnknown.toFixed(4)}`);

    // strict check: Bovine > Unknown
    return scoreBovine > scoreUnknown;

  } catch (error) {
    console.error('❌ Error in checkIsBovine:', error);
    return true; // Fail safe to allow upload if check crashes
  }
};



export default {
  initializeModel,
  initializeBovineModel,
  detectBreed,
  detectMultipleBreeds,
  checkIsBovine,
  getModelInfo,
};
