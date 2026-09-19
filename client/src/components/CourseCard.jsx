import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, User, Award, ArrowRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white shadow-sm">
            {course.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${getLevelBadgeColor(course.level)}`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span>{course.instructor_name}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.short_description || course.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.lesson_count || 8} Lessons</span>
            </span>
            <span className="flex items-center space-x-1 text-accent-600 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </span>
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CourseCard;
