import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Search, Filter, BookOpen, SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Programming',
  'Database',
  'Data Science'
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All');
  const [sortBy, setSortBy] = useState('recent');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel && selectedLevel !== 'All') params.level = selectedLevel;

      const res = await API.get('/courses', { params });
      if (res.data.success) {
        let fetched = res.data.courses || [];
        // Apply local sorting
        if (sortBy === 'title') {
          fetched.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'level') {
          fetched.sort((a, b) => a.level.localeCompare(b.level));
        }
        setCourses(fetched);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSortBy('recent');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1.5 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Course Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Explore Accredited Programs</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Advance your technical mastery with structured modular curriculums, interactive assessments, and official certifications.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
        
        {/* Top Search Line */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, instructor, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); fetchCourses(); }}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 transition hover:-translate-y-0.5"
          >
            Search Courses
          </button>
        </form>

        {/* Filters and Sorting Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-brand-600" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level & Sort controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Level Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-semibold text-xs">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-semibold text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="recent">Newest Programs</option>
                <option value="title">Course Title (A-Z)</option>
                <option value="level">Difficulty Level</option>
              </select>
            </div>

            {/* Reset Button */}
            {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-1 text-brand-600 hover:text-brand-800 font-bold transition pl-2"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Course Grid */}
      {loading ? (
        <LoadingSpinner text="Loading courses catalog..." />
      ) : courses.length > 0 ? (
        <div>
          <div className="text-xs text-slate-500 mb-4 font-medium">
            Showing <span className="font-semibold text-slate-800">{courses.length}</span> course{courses.length !== 1 && 's'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No courses found"
          message="We couldn't find any courses matching your filter criteria. Try adjusting your search query or filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      )}

    </div>
  );
};

export default Courses;
