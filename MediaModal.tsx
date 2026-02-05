import { X } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaModalProps {
  media: MediaItem;
  onClose: () => void;
}

export function MediaModal({ media, onClose }: MediaModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <X className="w-8 h-8" />
      </button>
      
      <div 
        className="max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {media.type === 'photo' ? (
          <img
            src={media.url}
            alt={media.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            src={media.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        )}
        
        <div className="mt-4 text-center text-white">
          <h3 className="text-xl font-semibold">{media.title}</h3>
          {media.description && (
            <p className="text-gray-300 mt-1">{media.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
