import React from 'react';
import { Upload, Music } from 'lucide-react';
import { AudioPlayer } from './components/AudioPlayer';
import { AudioFile } from './types';

function App() {
  const [files, setFiles] = React.useState<AudioFile[]>(() => {
    const savedFiles = localStorage.getItem('audioFiles');
    if (savedFiles) {
      try {
        return JSON.parse(savedFiles);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('audioFiles', JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (uploadedFiles: FileList) => {
    const fileReader = new FileReader();
    const processedFiles: AudioFile[] = [];
    let filesProcessed = 0;

    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        processedFiles[filesProcessed - 1].url = fileReader.result;
        if (filesProcessed === uploadedFiles.length) {
          setFiles(prev => [...prev, ...processedFiles]);
        } else {
          readNextFile();
        }
      }
    };

    const readNextFile = () => {
      const file = uploadedFiles[filesProcessed];
      if (file && file.type === 'audio/mpeg') {
        processedFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: '', // Will be set in onload
          uploadedAt: new Date().toISOString(),
          size: file.size
        });
        filesProcessed++;
        fileReader.readAsDataURL(file);
      }
    };

    readNextFile();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <Music className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audio Upload</h1>
          <p className="text-gray-600">Upload your MP3 files and listen to them online</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center transition-colors
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop your MP3 files here, or</p>
          <label className="inline-block">
            <input
              type="file"
              accept="audio/mpeg"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
            <span className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors">
              Browse Files
            </span>
          </label>
        </div>

        <div className="space-y-4">
          {files.length === 0 ? (
            <p className="text-center text-gray-500">No audio files uploaded yet</p>
          ) : (
            files.map(file => (
              <AudioPlayer key={file.id} file={file} onDelete={() => handleDelete(file.id)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;