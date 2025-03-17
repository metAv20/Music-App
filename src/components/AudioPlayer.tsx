import React from 'react';
import { Play, Pause, Trash2 } from 'lucide-react';
import { AudioFile } from '../types';

interface AudioPlayerProps {
  file: AudioFile;
  onDelete: () => void;
}

export function AudioPlayer({ file, onDelete }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-indigo-600" />
        ) : (
          <Play className="w-6 h-6 text-indigo-600" />
        )}
      </button>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{file.name}</p>
        <p className="text-sm text-gray-500">
          {(file.size / (1024 * 1024)).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={onDelete}
        className="p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete file"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <audio ref={audioRef} src={file.url} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}