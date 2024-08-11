import React from 'react';
import { FaFileExport, FaFileImport } from 'react-icons/fa'; // Import the icons

interface FooterProps {
  message?: string;
  onExportClick?: () => void;
  onImportClick?: (file: File) => void;
}

const Footer: React.FC<FooterProps> = ({ message, onExportClick, onImportClick }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImportClick) {
      onImportClick(file);
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Notification Section */}
        <div className="flex-grow flex items-center">
          {message && (
            <div className="text-gray-200 text-sm">
              {message}
            </div>
          )}
        </div>

        {/* Button Container */}
        <div className="flex-none flex items-center space-x-4">
          {/* Import Button */}
          <label className="flex items-center cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full flex items-center space-x-1">
            <input
              type="file"
              accept=".json" // Adjust the file type if needed
              className="hidden"
              onChange={handleFileChange}
            />
            <FaFileImport className="text-lg" />
            <span className="text-sm">Import Notes</span>
          </label>

          {/* Export Button */}
          <button
            onClick={onExportClick}
            className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-full flex items-center space-x-1"
          >
            <FaFileExport className="text-lg" />
            <span className="text-sm">Export Notes</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
