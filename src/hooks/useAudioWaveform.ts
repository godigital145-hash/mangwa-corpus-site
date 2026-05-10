import { useState, useEffect } from "react";
import { decodeWaveform, getCachedWaveform } from "../utils/audioWaveform";

interface WaveformState {
  bars: Uint32Array | null;
  loading: boolean;
  error: string | null;
}

export function useAudioWaveform(audioUrl: string, barCount = 80): WaveformState {
  const [state, setState] = useState<WaveformState>(() => ({
    bars: getCachedWaveform(audioUrl, barCount),
    loading: !getCachedWaveform(audioUrl, barCount),
    error: null,
  }));

  useEffect(() => {
    if (getCachedWaveform(audioUrl, barCount)) return;

    setState({ bars: null, loading: true, error: null });

    decodeWaveform(audioUrl, barCount)
      .then((bars) => setState({ bars, loading: false, error: null }))
      .catch((err) => setState({ bars: null, loading: false, error: String(err) }));
  }, [audioUrl, barCount]);

  return state;
}
