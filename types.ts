import React from 'react';

export interface NewsArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
}

export interface Program {
  id: number;
  name: string;
  description: string;
}

export interface Extracurricular {
  id: number;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Facility {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
}

// Admin Panel Types
export interface User {
  id: number;
  name: string;
  role: 'admin' | 'guru_bk' | 'ketua_kelas';
  class?: string; // e.g., 'IX A', only for 'ketua_kelas'
}

export interface Student {
  id: number;
  nisn: string;
  name: string;
  class: string;
  gender: 'Laki-laki' | 'Perempuan';
  entryYear: number;
}

export interface Teacher {
  id: number;
  nip?: string;
  name: string;
  position: string;
  subject: string;
  phone: string;
  photo_url?: string;
}

export interface ExternalService {
  id: number;
  name: string;
  url: string;
  icon_url: string;
}

export interface PageContent {
  [key: string]: string;
}

export interface Schedule {
  id: number;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  time_start: string; // e.g., '07:00'
  time_end: string;   // e.g., '08:30'
  subject: string;
  class_name: string;
  teacher_name: string;
}

export interface Grade {
    id: number;
    student_id: number;
    subject: string;
    score: number;
    semester: number;
    year: number;
}

export interface Attendance {
    id: number;
    student_id: number;
    date: string; // YYYY-MM-DD
    status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
    // --- new properties for attendance workflow ---
    student_name?: string;
    class_name?: string;
    confirmation_status?: 'Submitted' | 'Confirmed';
}
