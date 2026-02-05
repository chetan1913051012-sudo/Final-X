import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { MediaItem } from '../types';
import { MediaModal } from '../components/MediaModal';
import {
  LogOut,
  User,
  Image,
  Video,
  Play,
  Calendar,
  Loader2,
  FolderOpen,
  Filter,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

type FilterType = 'all' | 'photo' | 'video';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (!student) {
      navigate('/student/login');
      return;
    }

    if (!isFirebaseConfigured()) {
      setFirebaseReady(false);
      setLoading(false);
      return;
    }

    setFirebaseReady(true);

    // Real-time listener for student's media
    const mediaQuery = query(
      collection(db, 'media'),
      where('studentId', '==', student.studentId),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      mediaQuery,
      (snapshot) => {
        const mediaData: MediaItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MediaItem[];
        setMedia(mediaData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching media:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [student, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredMedia = media.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const photoCount = media.filter((m) => m.type === 'photo').length;
  const videoCount = media.filter((m) => m.type === 'video').length;

  if (!student) return null;

  // Show Firebase setup warning if not configured
  if (!firebaseReady) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold">{student.name}</h1>
                  <p className="text-xs text-white/80">
                    {student.studentId} | Class {student.class}-{student.section}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-10 h-10" />
                <div>
                  <h2 className="text-2xl font-bold">Firebase Not Configured</h2>
                  <p className="opacity-90">Contact your admin to complete the setup</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                The system needs to be connected to Firebase to show your photos and videos.
                Please ask your administrator to complete the Firebase setup.
              </p>
              
              <a 
                href="https://firebase.google.com/docs/web/setup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
              >
                Learn more about Firebase <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold">{student.name}</h1>
                <p className="text-xs text-white/80">
                  {student.studentId} | Class {student.class}-{student.section}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-8 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{media.length}</div>
              <div className="text-sm text-white/80">Total Media</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{photoCount}</div>
              <div className="text-sm text-white/80">Photos</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{videoCount}</div>
              <div className="text-sm text-white/80">Videos</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{student.rollNumber}</div>
              <div className="text-sm text-white/80">Roll No.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Media</h2>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('photo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'photo'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                <Image className="w-4 h-4" />
                Photos
              </button>
              <button
                onClick={() => setFilter('video')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'video'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                <Video className="w-4 h-4" />
                Videos
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="mt-4 text-gray-600">Loading your media...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMedia.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FolderOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No media found</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'No photos or videos have been uploaded for you yet.'
                : `No ${filter}s have been uploaded for you yet.`}
            </p>
          </div>
        )}

        {/* Media Grid */}
        {!loading && filteredMedia.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative aspect-video bg-gray-100">
                  {item.type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'photo'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.type === 'photo' ? 'Photo' : 'Video'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center text-gray-400 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.uploadedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedMedia && (
        <MediaModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </div>
  );
}
