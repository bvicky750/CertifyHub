import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, User, Award, ArrowRight, Star } from 'lucide-react';

const CourseCard = ({ course }) => {
  const getLevelBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_30px_-10px_rgba(2,132,199,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Thumbnail with overlay & badges */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-sm border border-white/10 tracking-wide">
            {course.category}
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${getLevelBadge(course.level)}`}>
            {course.level}
          </span>
        </div>

        {/* Rating chip bottom-right inside image */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-white/10">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>4.9</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Instructor & Duration Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                {(course.instructor_name || 'I').charAt(0)}
              </div>
              <span className="font-medium text-slate-700 truncate max-w-[120px]">{course.instructor_name}</span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{course.duration}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.short_description || course.description}
          </p>
        </div>

        {/* Card Bottom / Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center space-x-1.5 text-slate-500">
              <BookOpen className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-[11px] font-semibold">{course.lesson_count || 8} Modules</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </span>
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-1 transition-all"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CourseCard;
