'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Tag,
  Search,
  ArrowRight,
  FileText,
  Radio,
  Compass,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog-posts';

const ITEMS_PER_PAGE = 9;

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'wordCount' | 'readingTime'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesGridRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Storm Watch',
    'Climate Science',
    'Highway & Safety',
    'Travel & Ski',
    'Aurora & Astronomy',
    'Marine & Coastal',
  ];

  // Lead Cover Article (Flagship #1)
  const leadPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  // Top Editor's Choice Picks for Sidebar (Articles 2, 3, 4)
  const editorPicks = useMemo(() => {
    return BLOG_POSTS.filter((p) => p.slug !== leadPost.slug).slice(0, 3);
  }, [leadPost]);

  // Filtered & Sorted Articles
  const filteredAndSortedPosts = useMemo(() => {
    let result = BLOG_POSTS.filter((post) => {
      const matchesCat = activeCategory === 'All' || post.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });

    // Sorting
    if (sortBy === 'wordCount') {
      result = [...result].sort((a, b) => b.wordCount - a.wordCount);
    } else if (sortBy === 'readingTime') {
      result = [...result].sort((a, b) => b.readingTimeMin - a.readingTimeMin);
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPosts, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (articlesGridRef.current) {
      articlesGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Extract all unique tags for the tag cloud
  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    BLOG_POSTS.forEach((p) => {
      p.tags.forEach((t) => {
        tagMap.set(t, (tagMap.get(t) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Magazine Masthead / Ticker */}
      <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-400 font-mono font-bold tracking-wider uppercase text-[11px] border border-sky-500/30">
            Canadian Meteorological Journal
          </span>
          <span className="text-slate-400 font-mono">Vol. XIV • Autumn Edition</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Doppler &amp; Science Feed
          </span>
          <span>•</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAGAZINE COVER HERO SECTION (Bento Layout) */}
      {/* ========================================================================= */}
      {leadPost && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Lead Cover Story (8 Cols) */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-950 border border-slate-200/80 dark:border-sky-500/30 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl relative flex flex-col justify-between group">
            {/* Lead Image Banner */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leadPost.featuredImage}
                alt={leadPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Cover Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-600 dark:bg-sky-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-500/40">
                  ★ Cover Story
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/20 text-sky-300 text-xs font-semibold backdrop-blur-md">
                  {leadPost.category}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold backdrop-blur-md flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{leadPost.wordCount.toLocaleString()} words</span>
              </div>
            </div>

            {/* Lead Story Content */}
            <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    {leadPost.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    {leadPost.readingTimeMin} min in-depth read
                  </span>
                </div>

                <Link href={`/blog/${leadPost.slug}`} className="block">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors leading-tight">
                    {leadPost.title}
                  </h1>
                </Link>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {leadPost.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xl shadow-inner border border-slate-200 dark:border-white/10">
                    {leadPost.author.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{leadPost.author.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{leadPost.author.role}</div>
                  </div>
                </div>

                <Link
                  href={`/blog/${leadPost.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all group shrink-0"
                >
                  <span>Read Complete Investigation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Editor's Choice Column (4 Cols) */}
          <div className="lg:col-span-4 rounded-3xl bg-white/85 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 p-6 flex flex-col justify-between space-y-5 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Editor’s Choice</span>
              </div>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">Curated Picks</span>
            </div>

            <div className="space-y-4 flex-1">
              {editorPicks.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group block p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] hover:bg-sky-50/80 dark:hover:bg-white/[0.08] border border-slate-200/70 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold uppercase">
                      {item.category}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{item.readingTimeMin} min</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>

            {/* Quick Meteorological Fact Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/60 dark:to-indigo-950/60 border border-sky-200 dark:border-sky-500/20 text-xs space-y-1">
              <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
                <span>Atmospheric Fact of the Day</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                The lowest temperature ever recorded in North American history was -63.0°C in Snag, Yukon on February 3, 1947.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAGAZINE FILTER & CONTROL TOOLBAR */}
      {/* ========================================================================= */}
      <div
        ref={articlesGridRef}
        className="rounded-3xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-xl space-y-4"
      >
        {/* Top Row: Categories & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scientific articles, topics, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-80 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Results Count, Sort & View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">{filteredAndSortedPosts.length}</span>
            <span>articles found</span>
            {activeCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold">
                in {activeCategory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'wordCount' | 'readingTime')}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              >
                <option value="latest">Latest Published</option>
                <option value="wordCount">Word Count (Longest First)</option>
                <option value="readingTime">Reading Time</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-sky-600 dark:bg-sky-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-sky-600 dark:bg-sky-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List View"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN ARTICLES CONTENT AREA (Grid or List Layout) */}
      {/* ========================================================================= */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 p-12 text-center space-y-4 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles matched your criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or selecting &quot;All&quot; from the category filter above.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 dark:bg-sky-500 text-white font-bold text-xs hover:bg-sky-500 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* MAGAZINE 3-COLUMN EDITORIAL GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-3xl bg-white/85 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900/95 border border-slate-200/80 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-500/40 overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-xl flex flex-col justify-between transform hover:-translate-y-1"
            >
              {/* Card Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-200 dark:border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-white/10 text-[10px] font-bold text-sky-300 uppercase tracking-wider backdrop-blur-md">
                  {post.category}
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/85 border border-white/10 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                  {post.wordCount.toLocaleString()} words
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                      {post.readingTimeMin} min read
                    </span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs">
                      {post.author.avatar}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{post.author.name}</span>
                  </div>

                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* MAGAZINE EDITORIAL LIST VIEW */
        <div className="space-y-4">
          {paginatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl bg-white/85 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900/95 border border-slate-200/80 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-500/40 p-5 transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5 flex-1">
                {/* Thumbnail */}
                <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[9px] font-bold text-sky-300 uppercase">
                    {post.category}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{post.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                      {post.readingTimeMin} min read
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      {post.wordCount.toLocaleString()} words
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">By {post.author.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] text-slate-500 dark:text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end md:self-center">
                <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 font-bold text-xs group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAGAZINE MULTI-PAGE PAGINATION SYSTEM */}
      {/* ========================================================================= */}
      {totalPages > 1 && (
        <div className="rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-4 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-slate-200/50 dark:shadow-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing{' '}
            <span className="text-slate-900 dark:text-white font-bold">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            to{' '}
            <span className="text-slate-900 dark:text-white font-bold">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedPosts.length)}
            </span>{' '}
            of <span className="text-slate-900 dark:text-white font-bold">{filteredAndSortedPosts.length}</span> articles
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                currentPage === 1
                  ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-white/10 hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Numeric Page Buttons */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = currentPage === pageNum;

              // Show pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                        : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              // Ellipsis
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <span key={pageNum} className="px-1 text-slate-400 dark:text-slate-600 text-xs">
                    ...
                  </span>
                );
              }

              return null;
            })}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                currentPage === totalPages
                  ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-white/10 hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAGAZINE EDITORIAL FOOTER & TOPIC EXPLORER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
        {/* Topic Cloud */}
        <div className="rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Tag className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Atmospheric Topic Cloud</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {allTags.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-sky-100 dark:hover:bg-sky-500/20 border border-slate-200 dark:border-white/5 hover:border-sky-300 dark:hover:border-sky-500/30 text-xs text-slate-700 dark:text-slate-300 hover:text-sky-800 dark:hover:text-sky-300 transition-all flex items-center gap-1.5"
              >
                <span>#{tag}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Radar & Atmospheric Telemetry Quick Access */}
        <div className="rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 p-6 space-y-3 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Interactive Weather Systems</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore real-time Doppler radar mosaics, historical climate records, and thermodynamic calculators.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href="/radar"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/5 text-xs text-slate-800 dark:text-white group"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Live Canadian Radar Composite
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/almanac"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/5 text-xs text-slate-800 dark:text-white group"
            >
              <span>Canadian Climate Historical Almanac</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tools/calculator"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/5 text-xs text-slate-800 dark:text-white group"
            >
              <span>Wind Chill &amp; Humidex Calculator</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Editorial Standards & Submission */}
        <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50 dark:from-sky-950/40 dark:via-slate-900/80 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-500/20 p-6 space-y-3 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-sky-800 dark:text-sky-300">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Editorial &amp; Peer Review</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All articles are authored and peer-reviewed by certified Canadian atmospheric scientists and maritime meteorologists adhering to World Meteorological Organization (WMO) and ECCC MSC standards.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>ISSN 2817-4820 (Online)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">WMO Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

