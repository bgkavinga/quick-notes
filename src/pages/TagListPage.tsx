// TagListPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa';
import useSearchManager, { Tag } from '@/hooks/useSearchManager';
import LoadingSpinner from '@/components/LoadingSpinner';
import Footer from '@/components/Footer';

// Define available colors for tags
const tagColors = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-purple-500'
];

const TagListPage: React.FC = () => {
    const navigate = useNavigate()
    const { saveTag, savedTags, isSearchManagerLoading } = useSearchManager()

    const [editTagName, setEditTagName] = useState<string | null>(null);
    const [editTagColor, setEditTagColor] = useState<string>(tagColors[0]);


    const handleEditTag = (tag: Tag) => {
        setEditTagName(tag.name);
    };

    const handleSaveEdit = async () => {
        if (!editTagName) return;
        await saveTag({ name: editTagName, color: editTagColor })
        setEditTagName(null);
        setEditTagColor(tagColors[0]);
    };

    return (
        <>
            <header className='fixed top-0 left-0 w-full bg-gray-800 text-white py-2 px-4 shadow-md flex items-center justify-between z-50'>
                <div className='flex items-center'>
                    <FaArrowLeft className='mr-2 text-xl cursor-pointer' onClick={() => navigate('/')} />
                    <h1 className='text-xl'>
                        Tags
                    </h1>
                </div>
            </header>

            {isSearchManagerLoading ? (
                <LoadingSpinner />
            ) : (
                <main className="mt-10 mb-8 p-4">
                    <ul className="space-y-2">
                        {savedTags?.map(tag => (
                            <li key={tag.name} className={`flex justify-between items-center p-2 rounded shadow ${tag.color}`}>
                                <span>{tag.name}</span>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleEditTag(tag)}>
                                        Edit Color
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {editTagName && (
                        <div className="fixed bottom-4 right-4 p-4 bg-white shadow-md rounded-md">
                            <h2 className="text-lg font-semibold mb-2">Edit Tag Color</h2>
                            <p className="mb-2">Tag: {editTagName}</p>
                            <label className="block text-sm font-medium text-gray-700">Select New Color:</label>
                            <div className="flex space-x-2 mt-2">
                                {tagColors.map(colorClass => (
                                    <div
                                        key={colorClass}
                                        className={`w-8 h-8 cursor-pointer rounded-full ${colorClass} ${editTagColor === colorClass ? 'border-2 border-black' : ''}`}
                                        onClick={() => setEditTagColor(colorClass)}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={handleSaveEdit}
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </main>
            )}
            <Footer/>
        </>

    );
};

export default TagListPage;
