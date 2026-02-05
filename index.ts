export interface Student {
  id: string;
  studentId: string;
  password: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  createdAt: number;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  title: string;
  description?: string;
  uploadedAt: number;
  thumbnailUrl?: string;
  studentId: string; // Assigned to specific student
  fileName?: string;
}
