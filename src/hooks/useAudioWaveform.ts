import { useState, useEffect } from "react";
import { decodeWaveform, getCachedWaveform } from "../utils/audioWaveform";

interface WaveformState {
  bars: Uint32Array | null;
  loading: boolean;
  error: string | null;
}

export function useAudioWaveform(
  audioUrl: string,
  barCount = 80,
  precomputed?: number[] | null,
): WaveformState {
  const [state, setState] = useState<WaveformState>(() => {
    if (precomputed?.length) {
      return { bars: new Uint32Array(precomputed), loading: false, error: null };
    }
    const cached = getCachedWaveform(audioUrl, barCount);
    return { bars: cached, loading: !cached, error: null };
  });

  useEffect(() => {
    if (precomputed?.length) return;
    if (getCachedWaveform(audioUrl, barCount)) return;

    setState({ bars: null, loading: true, error: null });

    decodeWaveform(audioUrl, barCount)
      .then((bars) => setState({ bars, loading: false, error: null }))
      .catch((err) => setState({ bars: null, loading: false, error: String(err) }));
  }, [audioUrl, barCount, precomputed]);

  return state;
}
