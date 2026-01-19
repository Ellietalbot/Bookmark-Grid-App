import React, { useState } from 'react';
import { Plus, X, Pencil, Upload } from 'lucide-react';

export default function Symbaloo() {
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: 'Google', url: 'https://google.com', color: 'bg-blue-500' },
    { id: 2, title: 'YouTube', url: 'https://youtube.com', color: 'bg-red-500' },
    { id: 3, title: 'GitHub', url: 'https://github.com', color: 'bg-gray-800' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', color: 'bg-blue-500' });
  const [backgroundImage, setBackgroundImage] = useState(null);

  const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-gray-800', 'bg-emerald-500'
  ];

  const gridSize = 24; // 4 rows x 6 columns

  const handleAddClick = (index) => {
    setEditId(null);
    setFormData({ title: '', url: '', color: 'bg-blue-500' });
    setShowModal(true);
  };

  const handleEditClick = (bookmark) => {
    setEditId(bookmark.id);
    setFormData({ title: bookmark.title, url: bookmark.url, color: bookmark.color });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.url) return;

    let cleanUrl = formData.url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    if (editId) {
      setBookmarks(bookmarks.map(b => 
        b.id === editId ? { ...b, ...formData, url: cleanUrl } : b
      ));
    } else {
      const newBookmark = {
        id: Date.now(),
        title: formData.title,
        url: cleanUrl,
        color: formData.color
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tiles = [];
  for (let i = 0; i < gridSize; i++) {
    const bookmark = bookmarks[i];
    tiles.push(
      <div key={i} className="relative group">
        {bookmark ? (
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${bookmark.color} w-full h-32 rounded-lg flex flex-col items-center justify-center text-white hover:opacity-90 transition-all relative overflow-hidden shadow-lg hover:scale-105`}
            title={bookmark.title}
          >
            <img 
              src={getFaviconUrl(bookmark.url)} 
              alt={bookmark.title}
              className="w-16 h-16"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <span className="text-xs font-medium text-center px-2 mt-2 hidden">{bookmark.title.charAt(0).toUpperCase()}</span>
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditClick(bookmark);
                  }}
                  className="bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 shadow-lg"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(bookmark.id);
                  }}
                  className="bg-white text-red-600 rounded-full p-2 hover:bg-gray-100 shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </a>
        ) : (
          <button
            onClick={() => handleAddClick(i)}
            className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-white hover:bg-opacity-20 transition-all flex items-center justify-center opacity-30 hover:opacity-100"
          >
            <Plus size={32} className="text-gray-400" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute top-4 right-4">
        <label className="cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 transition-all">
          <Upload size={18} />
          <span className="text-sm font-medium">Upload Background</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">My Bookmarks</h1>
        
        <div className="grid grid-cols-6 gap-4">
          {tiles}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit' : 'Add'} Bookmark</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="My Bookmark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tile Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`${color} w-10 h-10 rounded ${formData.color === color ? 'ring-4 ring-gray-400' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 rounded py-2 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}