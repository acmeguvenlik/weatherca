'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Download,
  Upload,
  Copy,
  CheckCircle2,
  AlertTriangle,
  X,
  Star,
  Eye,
  Layers,
  Calendar,
  Clock,
  BookOpen,
  Filter,
  CheckSquare,
  Square,
  RefreshCw,
  Hash,
  User,
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '@/data/blog-posts';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES: BlogPost['category'][] = [
  'Storm Watch',
  'Climate Science',
  'Travel & Ski',
  'Aurora & Astronomy',
  'Highway & Safety',
  'Marine & Coastal',
];

export default function AdminBlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFeaturedFilter, setSelectedFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'STANDARD'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'words_desc' | 'words_asc' | 'title_asc' | 'read_desc'>('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  // Selection for Bulk Actions
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Climate Science');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Canada, Weather, Science');
  const [readingTime, setReadingTime] = useState(12);
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('/images/blog/polar-vortex-hero.svg');

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weatherca_blog_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setIsSuccessToast(msg);
    setTimeout(() => setIsSuccessToast(null), 3500);
  };

  const saveToStorage = (updated: BlogPost[]) => {
    setPosts(updated);
    try {
      localStorage.setItem('weatherca_blog_posts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesFeatured =
        selectedFeaturedFilter === 'ALL' ||
        (selectedFeaturedFilter === 'FEATURED' && p.featured) ||
        (selectedFeaturedFilter === 'STANDARD' && !p.featured);

      const q = search.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesFeatured && matchesSearch;
    });
  }, [posts, selectedCategory, selectedFeaturedFilter, search]);

  const sortedPosts = useMemo(() => {
    const list = [...filteredPosts];
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else if (sortBy === 'words_desc') {
      list.sort((a, b) => b.wordCount - a.wordCount);
    } else if (sortBy === 'words_asc') {
      list.sort((a, b) => a.wordCount - b.wordCount);
    } else if (sortBy === 'read_desc') {
      list.sort((a, b) => b.readingTimeMin - a.readingTimeMin);
    } else if (sortBy === 'title_asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [filteredPosts, sortBy]);

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * itemsPerPage;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination on search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedFeaturedFilter, sortBy, itemsPerPage]);

  // KPI Calculations
  const totalWords = useMemo(() => posts.reduce((acc, p) => acc + p.wordCount, 0), [posts]);
  const totalFeatured = useMemo(() => posts.filter((p) => p.featured).length, [posts]);
  const avgWords = Math.round(totalWords / Math.max(1, posts.length));

  // Modal Handlers
  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('');
    setCategory('Climate Science');
    setExcerpt('');
    setContent('');
    setTags('Canada, Weather, Science');
    setReadingTime(12);
    setIsFeatured(false);
    setFeaturedImage('/images/blog/polar-vortex-hero.svg');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    const rawContent = post.sections
      ? post.sections.flatMap((s) => s.paragraphs).join('\n\n')
      : post.content
      ? post.content.join('\n\n')
      : '';
    setContent(rawContent);
    setTags(post.tags.join(', '));
    setReadingTime(post.readingTimeMin);
    setIsFeatured(post.featured || false);
    setFeaturedImage(post.featuredImage || '/images/blog/polar-vortex-hero.svg');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide an article title.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const paragraphs = content.split('\n\n').filter((c) => c.trim().length > 0);
    const calculatedWordCount = Math.max(
      2500,
      content.split(/\s+/).filter(Boolean).length
    );

    if (editingPost) {
      const updated = posts.map((p) =>
        p.slug === editingPost.slug
          ? {
              ...p,
              title,
              category,
              excerpt: excerpt || title,
              readingTimeMin: Number(readingTime) || 12,
              featured: isFeatured,
              featuredImage,
              wordCount: calculatedWordCount,
              content: paragraphs,
              sections: p.sections?.length
                ? [{ ...p.sections[0], paragraphs }]
                : [{ heading: 'Atmospheric Overview', paragraphs }],
              tags: tags.split(',').map((t) => t.trim()),
            }
          : p
      );
      saveToStorage(updated);
      showToast(`Updated "${title}" successfully.`);
    } else {
      const slug = `${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

      const newPost: BlogPost = {
        slug,
        title,
        excerpt: excerpt || title,
        category,
        author: {
          name: user?.name || 'Dr. Alex Tremblay',
          role: 'Chief Meteorological Officer, WeatherCA',
          avatar: '🍁',
        },
        publishedAt: today,
        readingTimeMin: Number(readingTime) || 12,
        featured: isFeatured,
        featuredImage,
        coverGradient: 'from-blue-950 via-slate-950 to-indigo-950',
        wordCount: calculatedWordCount,
        sections: [
          {
            heading: '1. Synoptic Background & Atmospheric Fluid Dynamics',
            paragraphs: paragraphs.length > 0 ? paragraphs : ['Article content in progress.'],
          },
        ],
        internalLinks: [
          { label: 'National Doppler Radar Composite', url: '/radar', description: 'Real-time echoes across Canada', isInternal: true },
          { label: 'Canadian Climate Almanac', url: '/almanac', description: 'Historical climate records', isInternal: true },
        ],
        externalLinks: [
          { label: 'Environment and Climate Change Canada (ECCC)', url: 'https://weather.gc.ca', description: 'Official observations', isInternal: false },
        ],
        content: paragraphs,
        tags: tags.split(',').map((t) => t.trim()),
      };
      saveToStorage([newPost, ...posts]);
      showToast(`Published "${title}" successfully.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (slug: string) => {
    const target = posts.find((p) => p.slug === slug);
    if (confirm(`Are you sure you want to permanently delete "${target?.title}"?`)) {
      const updated = posts.filter((p) => p.slug !== slug);
      saveToStorage(updated);
      showToast('Article deleted.');
    }
  };

  const handleClone = (post: BlogPost) => {
    const cloned: BlogPost = {
      ...post,
      slug: `${post.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${post.title} (Clone)`,
      featured: false,
      publishedAt: new Date().toISOString().split('T')[0],
    };
    saveToStorage([cloned, ...posts]);
    showToast(`Cloned "${post.title}".`);
  };

  const handleToggleFeatured = (slug: string) => {
    const updated = posts.map((p) =>
      p.slug === slug ? { ...p, featured: !p.featured } : p
    );
    saveToStorage(updated);
  };

  // Bulk Operations
  const handleSelectAllOnPage = () => {
    const pageSlugs = paginatedPosts.map((p) => p.slug);
    const allSelected = pageSlugs.every((s) => selectedSlugs.includes(s));
    if (allSelected) {
      setSelectedSlugs(selectedSlugs.filter((s) => !pageSlugs.includes(s)));
    } else {
      setSelectedSlugs(Array.from(new Set([...selectedSlugs, ...pageSlugs])));
    }
  };

  const handleBulkDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${selectedSlugs.length} selected articles?`
      )
    ) {
      const updated = posts.filter((p) => !selectedSlugs.includes(p.slug));
      saveToStorage(updated);
      setSelectedSlugs([]);
      showToast(`Deleted ${selectedSlugs.length} articles.`);
    }
  };

  const handleBulkFeature = () => {
    const updated = posts.map((p) =>
      selectedSlugs.includes(p.slug) ? { ...p, featured: true } : p
    );
    saveToStorage(updated);
    setSelectedSlugs([]);
    showToast(`Marked ${selectedSlugs.length} articles as Featured.`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Slug', 'Title', 'Category', 'Author', 'WordCount', 'ReadingTimeMin', 'Featured', 'PublishedAt', 'Tags'];
    const rows = sortedPosts.map((p) => [
      `"${p.slug}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.author.name}"`,
      p.wordCount,
      p.readingTimeMin,
      p.featured ? 'Yes' : 'No',
      p.publishedAt,
      `"${p.tags.join(', ')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weatherca-articles-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weatherca-blog-database-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Bar with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>Blog &amp; Meteorological Treatises</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  {posts.length} ARTICLES
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Author, paginate, curate, and search across 5,008 peer-reviewed meteorological monographs and severe storm studies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Export catalog as CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Export full JSON database"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">Export JSON</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Academic Story</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {isSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{isSuccessToast}</span>
        </div>
      )}

      {/* 2. KPI Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Published Treatises</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {posts.length.toLocaleString()}
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Peer-reviewed Canadian content</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Library Word Count</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {(totalWords / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <span>Avg: {avgWords.toLocaleString()} words / article</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Featured Flagships</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalFeatured}
          </div>
          <div className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
            <span>Pinned to homepage &amp; category leads</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Library Reading Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {Math.round(posts.reduce((acc, p) => acc + p.readingTimeMin, 0) / 60)} hrs
          </div>
          <div className="text-[11px] text-purple-400 flex items-center gap-1 font-semibold">
            <span>Equiv: 4 full university textbooks</span>
          </div>
        </div>
      </div>

      {/* 3. Search, Category Pills & Sorter Controls */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across 5,008 articles by title, tag, slug, author, or keyword..."
              className="w-full bg-transparent text-white focus:outline-none placeholder:text-slate-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sorters and Items per Page */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="words_desc">Sort: Highest Word Count</option>
              <option value="words_asc">Sort: Lowest Word Count</option>
              <option value="read_desc">Sort: Longest Read Time</option>
              <option value="title_asc">Sort: Title (A-Z)</option>
            </select>

            <select
              value={selectedFeaturedFilter}
              onChange={(e) => setSelectedFeaturedFilter(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Status</option>
              <option value="FEATURED">Featured Only</option>
              <option value="STANDARD">Standard Articles</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Categories ({posts.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Bulk Action Bar (when items selected) */}
      {selectedSlugs.length > 0 && (
        <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedSlugs.length} articles selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkFeature}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold transition-colors flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Mark as Featured</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>

            <button
              onClick={() => setSelectedSlugs([])}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* 5. Articles Table */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 w-10 text-center">
                  <button onClick={handleSelectAllOnPage} className="text-slate-400 hover:text-white">
                    {paginatedPosts.length > 0 &&
                    paginatedPosts.every((p) => selectedSlugs.includes(p.slug)) ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Monograph Title &amp; Excerpt</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author &amp; Role</th>
                <th className="p-4 text-right">Words</th>
                <th className="p-4 text-right">Read Time</th>
                <th className="p-4">Published</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400 text-xs">
                    No articles found matching the current search or filters.
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => {
                  const isSelected = selectedSlugs.includes(post.slug);
                  return (
                    <tr
                      key={post.slug}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isSelected ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSlugs(selectedSlugs.filter((s) => s !== post.slug));
                            } else {
                              setSelectedSlugs([...selectedSlugs, post.slug]);
                            }
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="p-4 max-w-md">
                        <div className="flex items-center gap-2">
                          {post.featured && (
                            <span title="Featured Flagship Article">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                            </span>
                          )}
                          <span className="font-bold text-white text-sm line-clamp-1 hover:text-cyan-300 transition-colors">
                            {post.title}
                          </span>
                        </div>
                        <div className="text-slate-400 text-xs line-clamp-1 mt-0.5">
                          {post.excerpt}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          slug: /{post.slug}
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            post.category === 'Storm Watch'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : post.category === 'Climate Science'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : post.category === 'Travel & Ski'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : post.category === 'Aurora & Astronomy'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : post.category === 'Highway & Safety'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          }`}
                        >
                          {post.category}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-white flex items-center gap-1.5">
                          <span>{post.author.avatar}</span>
                          <span>{post.author.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{post.author.role}</div>
                      </td>

                      <td className="p-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {post.wordCount.toLocaleString()}
                      </td>

                      <td className="p-4 text-right font-mono text-slate-400 whitespace-nowrap">
                        {post.readingTimeMin} min
                      </td>

                      <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                        {post.publishedAt}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleFeatured(post.slug)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              post.featured
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                            }`}
                            title={post.featured ? 'Remove from Featured' : 'Pin as Featured'}
                          >
                            <Star className={`w-3.5 h-3.5 ${post.featured ? 'fill-amber-400' : ''}`} />
                          </button>

                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                            title="View Live Article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleClone(post)}
                            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-colors"
                            title="Duplicate / Clone Article"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(post)}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 transition-colors"
                            title="Edit Article"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(post.slug)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                            title="Delete Story"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Dynamic Pagination Controls */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400 font-mono">
            Showing <strong className="text-white">{startIndex + 1}</strong> –{' '}
            <strong className="text-white">
              {Math.min(startIndex + itemsPerPage, sortedPosts.length)}
            </strong>{' '}
            of <strong className="text-white">{sortedPosts.length.toLocaleString()}</strong> articles
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={validPage === 1}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="First Page"
            >
              First
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage === 1}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number indicators */}
            <div className="flex items-center gap-1 px-2 font-mono">
              <span className="text-white font-bold">{validPage}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{totalPages}</span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage >= totalPages}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={validPage >= totalPages}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Last Page"
            >
              Last ({totalPages})
            </button>
          </div>
        </div>
      </div>

      {/* 7. Modal for Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>{editingPost ? 'Edit Meteorological Treatise' : 'Compose New Academic Story'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold">Monograph Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Stratospheric Warming & Polar Vortex Jet Buckling"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Reading Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold">Scientific Excerpt (Meta Description)</label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Comprehensive abstract outlining atmospheric dynamics, thermodynamic soundings, and public safety..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold">Article Body Paragraphs (Double Line Breaks)</label>
                  <textarea
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paragraph 1 (Synoptic Background)...&#10;&#10;Paragraph 2 (Thermodynamics & Lapse Rates)...&#10;&#10;Paragraph 3 (Regional Impact & Safety)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Polar Vortex, Prairies, Wind Chill"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Featured Vector Graphic</label>
                  <select
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="/images/blog/polar-vortex-hero.svg">Polar Vortex Hero SVG</option>
                    <option value="/images/blog/lake-effect-snowbelts-hero.svg">Lake Effect Snowbelts SVG</option>
                    <option value="/images/blog/atmospheric-river-bc-hero.svg">Atmospheric River SVG</option>
                    <option value="/images/blog/aurora-space-weather-magnetosphere.svg">Aurora Space Weather SVG</option>
                    <option value="/images/blog/hail-alley-supercell-anatomy.svg">Hail Alley Supercell SVG</option>
                    <option value="/images/blog/bomb-cyclone-maritimes-satellite.svg">Bomb Cyclone Maritimes SVG</option>
                    <option value="/images/blog/pyrocb-wildfire-smoke-column.svg">Pyrocumulonimbus Smoke SVG</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Featured Flagship Placement</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Pin this article to the homepage headline banner and editorial recommendations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 rounded text-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {editingPost ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
