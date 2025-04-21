'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

type ChorusAffiliation = 'harmony' | 'melody' | 'both';

interface LeadershipProfileProps {
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  size?: 'large' | 'medium' | 'small';
  // chorusAffiliation // Removed as unused
}

export default function LeadershipProfile({
  name,
  title,
  bio,
  photoUrl,
  size = 'medium',
}: LeadershipProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const getAffiliationBadge = (affiliation: ChorusAffiliation) => {
  //   switch (affiliation) {
  //     case 'harmony': return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Harmony</span>;
  //     case 'melody': return <span className="px-2 py-0.5 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">Melody</span>;
  //     case 'both': return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Both</span>;
  //     default: return null;
  //   }
  // }; // Removed as unused

  const sizeClasses = {
    large: 'w-72 h-72',
    medium: 'w-56 h-56',
    small: 'w-40 h-40'
  };

  // Split bio into paragraphs
  const bioParagraphs = bio?.split('\n\n') || [];

  return (
    <>
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative mx-auto mb-4 rounded-lg overflow-hidden bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className={`${sizeClasses[size]} relative`}>
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                sizes={size === 'large' ? '288px' : size === 'medium' ? '224px' : '160px'}
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
        <p className="text-indigo-600 font-medium">{title}</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
              <p className="text-lg text-indigo-600 font-medium">{title}</p>
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

          <div className="aspect-[4/5] relative rounded-lg overflow-hidden mb-8">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                className="object-cover object-top"
                sizes="(min-width: 768px) 32rem, 100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                Photo Coming Soon
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
} 