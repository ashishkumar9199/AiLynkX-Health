import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, FileImage } from 'lucide-react';

interface PhotoUploadProps {
  value: string;
  onChange: (base64OrUrl: string) => void;
  label?: string;
  type?: 'avatar' | 'hospital' | 'store';
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  onChange,
  label = 'Upload Photo',
  type = 'avatar',
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get standard placeholders based on the role/type
  const getPlaceholder = () => {
    if (type === 'hospital') {
      return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80';
    }
    if (type === 'store') {
      return 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80';
  };

  const handleFileChange = (file: File) => {
    setError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, JPEG, PNG, WEBP, etc.)');
      return;
    }

    // Validate size (3MB limit for localStorage/Base64 safety)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      setError('Image is too large. Please select an image smaller than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to process image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(getPlaceholder());
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentImage = value || getPlaceholder();
  const isCustom = value && !value.startsWith('http://') && !value.startsWith('https://');

  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <span className="block text-xs font-bold text-slate-700">
          {label}
        </span>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerInputClick}
        className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-3 text-center min-h-[140px] bg-slate-50/50 hover:bg-slate-50 ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50/30' 
            : error 
              ? 'border-red-300 hover:border-red-400' 
              : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="hidden"
        />

        {currentImage ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            {/* Live Preview Circle/Square */}
            <div className="relative shrink-0">
              <img
                src={currentImage}
                alt="Preview"
                referrerPolicy="no-referrer"
                className={`object-cover border border-slate-200 shadow-xs ${
                  type === 'avatar' 
                    ? 'w-16 h-16 rounded-full' 
                    : 'w-24 h-16 rounded-xl'
                }`}
              />
              {isCustom && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-colors"
                  title="Remove uploaded image"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Instruction Details */}
            <div className="flex-1 text-left space-y-1">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                <FileImage className="w-3.5 h-3.5 text-indigo-600" />
                {isCustom ? 'Custom Photo Uploaded' : 'Default Placeholder Image'}
              </span>
              <p className="text-[10px] text-slate-500 leading-normal">
                {isCustom 
                  ? 'Your uploaded photo is ready and active.' 
                  : 'Click or drag a JPG, JPEG, or PNG file here to replace the default photo.'
                }
              </p>
              <span className="text-[10px] text-indigo-600 group-hover:underline font-bold inline-block pt-0.5">
                Change Photo
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 text-slate-500 flex items-center justify-center transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Drag & Drop or Click to Upload
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Supports JPG, JPEG, PNG, or WEBP (Max 3MB)
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-red-600 font-semibold text-[10px] mt-1 bg-red-50 p-2 rounded-lg border border-red-100">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
