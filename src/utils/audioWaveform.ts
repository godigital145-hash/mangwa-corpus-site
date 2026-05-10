const cache = new Map<string, Uint32Array>();

function cacheKey(audioUrl: string, barCount: number) {
  return `${audioUrl}::${barCount}`;
}

export async function decodeWaveform(audioUrl: string, barCount = 80): Promise<Uint32Array> {
  const key = cacheKey(audioUrl, barCount);
  if (cache.has(key)) return cache.get(key)!;

  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();

  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  await audioContext.close();

  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / barCount);

  const rmsValues = new Float32Array(barCount);
  for (let i = 0; i < barCount; i++) {
    let sum = 0;
    const offset = i * blockSize;
    for (let j = 0; j < blockSize; j++) {
      const sample = channelData[offset + j];
      sum += sample * sample;
    }
    rmsValues[i] = Math.sqrt(sum / blockSize);
  }

  const max = Math.max(...rmsValues);
  const bars = new Uint32Array(barCount);
  for (let i = 0; i < barCount; i++) {
    bars[i] = max > 0 ? Math.round((rmsValues[i] / max) * 100) : 0;
  }

  cache.set(key, bars);
  return bars;
}

export function getCachedWaveform(audioUrl: string, barCount: number): Uint32Array | null {
  return cache.get(cacheKey(audioUrl, barCount)) ?? null;
}
