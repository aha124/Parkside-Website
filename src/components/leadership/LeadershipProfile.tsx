'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

interface LeadershipProfileProps {
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  size?: 'large' | 'medium' | 'small';
}

export default function LeadershipProfile({
  name,
  title,
  bio,
  photoUrl,
  size = 'medium'
}: LeadershipProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClasses = {
    large: 'w-48 h-48',
    medium: 'w-40 h-40',
    small: 'w-32 h-32'
  };

  return (
    <>
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className={sizeClasses[size]}>
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Photo Coming Soon
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        </button>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600">{title}</p>
        {bio && <p className="mt-2 text-gray-700 text-sm md:hidden">{bio}</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
              <p className="text-lg text-indigo-600">{title}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-6">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                Photo Coming Soon
              </div>
            )}
          </div>

          {bio && (
            <div className="prose prose-lg max-w-none">
              <p>{bio}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
} 