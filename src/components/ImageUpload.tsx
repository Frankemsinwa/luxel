'use client';

import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Get secure signature from Luxel backend
            const sigRes = await fetch('http://localhost:5000/api/uploads/signature');
            if (!sigRes.ok) throw new Error('Failed to get signature');
            const { signature, timestamp, cloud_name, api_key, folder } = await sigRes.json();

            // 2. Upload file directly to Cloudinary using the signature
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', api_key);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', folder);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');

            const data = await uploadRes.json();

            // 3. Update the UI with the secure URL
            onChange(data.secure_url);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-zinc-100 group">
                        <Image
                            fill
                            src={value}
                            alt="Upload preview"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove();
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <>
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            ref={inputRef}
                            onChange={handleUpload}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                inputRef.current?.click();
                            }}
                            disabled={isUploading}
                            className="w-40 h-40 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-3 text-zinc-400 hover:border-amber hover:text-amber transition-all bg-zinc-50/50 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isUploading ? (
                                <Loader2 size={24} className="animate-spin text-amber" />
                            ) : (
                                <ImageIcon size={24} className="group-hover:scale-110 transition-transform duration-300" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isUploading ? 'Orchestrating...' : 'Add Image'}
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
