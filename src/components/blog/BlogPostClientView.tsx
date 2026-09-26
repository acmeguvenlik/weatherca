'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Share2,
  Tag,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Heart,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Sparkles,
  Compass,
  ExternalLink,
  AlertTriangle,
  Info,
  Lightbulb,
  FileText,
  CheckCircle2,
  Radio,
  Car,
  User,
  Send,
  Copy,
  Globe,
  Share,
  Flame,
  Snowflake,
} from 'lucide-react';
import { BlogPost } from '@/data/blog-posts';
import { AdBanner } from '@/components/ads/AdBanner';

interface CommentItem {
  id: string;
  name: string;
  location: string;
  role: string;
  date: string;
  text: string;
  likes: number;
  hasLiked?: boolean;
}

interface BlogPostClientViewProps {
  post: BlogPost;
  prevPost: BlogPost;
  nextPost: BlogPost;
  recommendedPosts: BlogPost[];
}

export const BlogPostClientView: React.FC<BlogPostClientViewProps> = ({
  post,
  prevPost,
  nextPost,
  recommendedPosts,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const defaultComments: CommentItem[] = [
    {
      id: 'c-1',
      name: 'Michael Vance',
      location: 'Calgary, AB',
      role: 'Fleet Logistics Supervisor',
      date: '2 days ago',
      text: 'The explanation of the -40°C wind chill boundary layer stripped by 50 km/h winds is spot on. We mandate emergency diesel fuel conditioners across all our trucks in Alberta whenever the ECCC polar vortex bulletin triggers.',
      likes: 14,
    },
    {
      id: 'c-2',
      name: 'Geneviève Tremblay',
      location: 'Québec City, QC',
      role: 'Civil Infrastructure Engineer',
      date: 'Yesterday',
      text: 'Fascinating breakdown of the 1998 Ice Storm inversion sandwich compared to modern stratospheric warming lobes. The data tables on municipal frost depth are invaluable for city planning.',
      likes: 9,
    },
    {
      id: 'c-3',
      name: 'Derek Kowalski',
      location: 'Barrie, ON',
      role: 'Winter Highway Safety Advocate',
      date: '8 hours ago',
      text: 'Having driven Highway 400 during single-band Georgian Bay lake squalls, the 13°C delta-T criterion explains why sunny skies turn into zero visibility in 200 meters. Excellent scientific journalism.',
      likes: 7,
    },
  ];

  // Likes and Reactions State
  const [likes, setLikes] = useState<number>(() => {
    if (typeof window === 'undefined') return 42;
    try {
      const savedLikes = localStorage.getItem(`weatherca_likes_${post.slug}`);
      if (savedLikes) {
        const parsed = JSON.parse(savedLikes);
        if (typeof parsed.count === 'number') return parsed.count;
      }
    } catch {
      // ignore
    }
    return 42;
  });

  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const savedLikes = localStorage.getItem(`weatherca_likes_${post.slug}`);
      if (savedLikes) {
        const parsed = JSON.parse(savedLikes);
        if (typeof parsed.hasLiked === 'boolean') return parsed.hasLiked;
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [claps, setClaps] = useState<number>(18);
  const [hasClapped, setHasClapped] = useState<boolean>(false);

  const [comments, setComments] = useState<CommentItem[]>(() => {
    if (typeof window === 'undefined') return defaultComments;
    try {
      const savedComments = localStorage.getItem(`weatherca_comments_${post.slug}`);
      if (savedComments) return JSON.parse(savedComments);
    } catch {
      // ignore
    }
    return defaultComments;
  });

  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const savedBookmarked = localStorage.getItem(`weatherca_bookmark_${post.slug}`);
      if (savedBookmarked) return JSON.parse(savedBookmarked);
    } catch {
      // ignore
    }
    return false;
  });

  const [commentName, setCommentName] = useState('');
  const [commentLocation, setCommentLocation] = useState('');
  const [commentRole, setCommentRole] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // Check active section for TOC
      post.sections.forEach((_, idx) => {
        const el = document.getElementById(`sec-${idx}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveSection(`sec-${idx}`);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.sections]);

  // Toggle Like
  const handleToggleLike = () => {
    const nextHasLiked = !hasLiked;
    const nextLikes = nextHasLiked ? likes + 1 : Math.max(0, likes - 1);
    setHasLiked(nextHasLiked);
    setLikes(nextLikes);
    try {
      localStorage.setItem(
        `weatherca_likes_${post.slug}`,
        JSON.stringify({ count: nextLikes, hasLiked: nextHasLiked })
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Claps / Helpful
  const handleToggleClap = () => {
    const nextClapped = !hasClapped;
    const nextClaps = nextClapped ? claps + 1 : Math.max(0, claps - 1);
    setHasClapped(nextClapped);
    setClaps(nextClaps);
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    const nextVal = !isBookmarked;
    setIsBookmarked(nextVal);
    try {
      localStorage.setItem(`weatherca_bookmark_${post.slug}`, JSON.stringify(nextVal));
    } catch (e) {
      console.error(e);
    }
  };

  // Share handler
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    // Fallback copy
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newEntry: CommentItem = {
      id: `c-${Date.now()}`,
      name: commentName.trim(),
      location: commentLocation.trim() || 'Canada',
      role: commentRole.trim() || 'Reader & Weather Observer',
      date: 'Just now',
      text: commentText.trim(),
      likes: 1,
    };

    const updated = [newEntry, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(`weatherca_comments_${post.slug}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  // Handle Like on a comment
  const handleLikeComment = (id: string) => {
    const updated = comments.map((c) => {
      if (c.id === id) {
        const nextHasLiked = !c.hasLiked;
        return {
          ...c,
          hasLiked: nextHasLiked,
          likes: nextHasLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
        };
      }
      return c;
    });
    setComments(updated);
    try {
      localStorage.setItem(`weatherca_comments_${post.slug}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full">
      {/* 1. Sticky Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-900/50 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 transition-all duration-150 ease-out shadow-sm shadow-sky-400/50"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Copy Toast Alert */}
      {isCopied && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>Article link copied to clipboard!</span>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>All Canadian Weather Stories &amp; Science</span>
          </Link>

          {/* Quick Share / Like Floating Controls for Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={handleToggleLike}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                hasLiked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-white/5 text-slate-300 border-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="px-3 py-1 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-bold uppercase tracking-wider transition-colors"
            >
              {post.category}
            </Link>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readingTimeMin} min read
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.publishedAt}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {post.wordCount.toLocaleString()} words
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            {post.excerpt}
          </p>

          {/* Author Card */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-md border border-white/10">
                {post.author.avatar}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={isBookmarked ? 'Saved to bookmarks' : 'Save article'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                <span className="hidden sm:inline-block">
                  {isBookmarked ? 'Bookmarked' : 'Save'}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-bold text-sky-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Hero Image on Local Server */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 mb-12">
          <div className="relative aspect-[16/9] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="p-3 bg-slate-950/80 border-t border-white/10 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Local Asset: {post.featuredImage}</span>
            <span className="text-sky-400 font-bold">WeatherCA Meteorological Studio</span>
          </div>
        </div>

        {/* Main Content Layout: Article Body (Left) + Sticky Interactive Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Column */}
          <main className="lg:col-span-8 space-y-10">
            {/* Audio Narration Player (Web Speech API) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900/50 border border-sky-500/20 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Listen to Meteorological Monograph</span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/30 text-[10px] text-sky-300 font-mono">
                      AI Audio
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Voice narration synthesized from high-resolution scientific text
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (typeof window === 'undefined') return;
                    if ('speechSynthesis' in window) {
                      if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.cancel();
                      } else {
                        const allText = `${post.title}. ${post.excerpt}. ${post.sections
                          .map((s) => `${s.heading || ''}. ${s.paragraphs.join(' ')}`)
                          .join(' ')}`;
                        const utterance = new SpeechSynthesisUtterance(allText);
                        utterance.rate = 1.05;
                        utterance.pitch = 1.0;
                        window.speechSynthesis.speak(utterance);
                      }
                    } else {
                      alert('Web Speech API is not supported in your browser.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Play / Pause Audio</span>
                </button>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.print();
                    }
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs transition-colors"
                  title="Print / Save as PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Floating Quick Reaction Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">Was this analysis helpful?</span>
                <button
                  onClick={handleToggleLike}
                  className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
                    hasLiked
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md shadow-rose-500/20'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{likes} Likes</span>
                </button>

                <button
                  onClick={handleToggleClap}
                  className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
                    hasClapped
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{claps} Insightful</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="#comments-section"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>{comments.length} Comments</span>
                </a>
              </div>
            </div>

            {/* Article Content Sections */}
            <article className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-10 backdrop-blur-2xl shadow-xl space-y-10 text-sm sm:text-base text-slate-300 leading-relaxed print:bg-white print:text-black print:border-none">
              {post.sections.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  <section id={`sec-${sIdx}`} className="space-y-5 scroll-mt-24">
                  {section.heading && (
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight border-b border-white/10 pb-3 pt-2 flex items-center gap-2.5">
                      <span className="w-2 h-6 rounded-full bg-sky-400 inline-block" />
                      <span>{section.heading}</span>
                    </h2>
                  )}

                  {section.subheading && (
                    <h3 className="text-lg font-bold text-sky-300">{section.subheading}</h3>
                  )}

                  {/* Paragraphs */}
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* In-Body Local Diagram or Image */}
                  {section.image && (
                    <div className="my-6 rounded-2xl overflow-hidden border border-white/15 bg-slate-950 p-2 sm:p-4 space-y-2 shadow-2xl">
                      <div className="relative w-full rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={section.image.src}
                          alt={section.image.alt}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                      <div className="text-xs text-slate-400 italic px-2">
                        {section.image.caption}
                      </div>
                    </div>
                  )}

                  {/* Optional paragraphs_cont */}
                  {section.paragraphs_cont &&
                    section.paragraphs_cont.map((pc, pcIdx) => (
                      <p key={`pc-${pcIdx}`} className="leading-relaxed">
                        {pc}
                      </p>
                    ))}

                  {/* Callout Box */}
                  {section.callout && (
                    <div
                      className={`p-5 rounded-2xl border space-y-1.5 ${
                        section.callout.type === 'warning'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          : section.callout.type === 'tip'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : 'bg-sky-500/10 border-sky-500/30 text-sky-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-white">
                        {section.callout.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        ) : section.callout.type === 'tip' ? (
                          <Lightbulb className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Info className="w-4 h-4 text-sky-400" />
                        )}
                        <span>{section.callout.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                        {section.callout.text}
                      </p>
                    </div>
                  )}

                  {/* Data Table */}
                  {section.table && (
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 my-6">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="py-3 px-4 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.03]">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-3 px-4 ${
                                    cIdx === 0 ? 'font-sans font-bold text-white' : ''
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
                {/* Mid-Article In-Content Ad Placement */}
                {sIdx === 1 && (
                  <div className="my-6 print:hidden">
                    <AdBanner slotKey="blog-midroll" />
                  </div>
                )}
              </React.Fragment>
              ))}

              {/* Internal Link References */}
              {post.internalLinks.length > 0 && (
                <div className="pt-8 border-t border-white/10 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>Related WeatherCA Telemetry &amp; City Hubs</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {post.internalLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.url}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-sky-500/10 border border-white/10 hover:border-sky-500/30 transition-all space-y-1 group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 flex items-center justify-between">
                          <span>{link.label}</span>
                          <span className="text-sky-400 font-mono text-[10px]">Explore →</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{link.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* External Authoritative References */}
              {post.externalLinks.length > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Authoritative Meteorological Sources &amp; Research</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {post.externalLinks.map((ext, idx) => (
                      <a
                        key={idx}
                        href={ext.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-white/5 hover:bg-teal-500/10 border border-white/10 hover:border-teal-500/30 transition-all space-y-1 group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-teal-300 flex items-center justify-between">
                          <span>{ext.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{ext.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              <div className="pt-8 border-t border-white/10 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-400" />
                  <span>Explore Related Topics &amp; Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?search=${encodeURIComponent(tag)}`}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* 2. Previous & Next Article Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {prevPost && (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="p-5 rounded-3xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-sky-500/40 transition-all space-y-2 group flex flex-col justify-between"
                >
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 group-hover:text-sky-300 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Article</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                    {prevPost.title}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {prevPost.category} • {prevPost.readingTimeMin} min read
                  </div>
                </Link>
              )}

              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="p-5 rounded-3xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-sky-500/40 transition-all space-y-2 group flex flex-col justify-between text-right"
                >
                  <div className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1.5 group-hover:text-sky-300 transition-colors">
                    <span>Next Article</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                    {nextPost.title}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {nextPost.category} • {nextPost.readingTimeMin} min read
                  </div>
                </Link>
              )}
            </div>

            {/* 3. Interactive Commenting System (Yorum Yapma) */}
            <div
              id="comments-section"
              className="rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <MessageSquare className="w-5 h-5 text-sky-400" />
                    <span>Community Discussion &amp; Field Reports</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Share your on-the-ground observations, highway conditions, or questions with Canadian meteorologists.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {comments.length} Comments
                </span>
              </div>

              {commentSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you! Your meteorological field comment has been published.</span>
                </div>
              )}

              {/* Comment Form */}
              <form
                onSubmit={handleCommentSubmit}
                className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4"
              >
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Post a Meteorological Comment
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Edmonton, AB)"
                    value={commentLocation}
                    onChange={(e) => setCommentLocation(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Highway Driver, Resident)"
                    value={commentRole}
                    onChange={(e) => setCommentRole(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Share your experience, questions, or weather insights on this topic..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Be respectful and follow Canadian meteorological safety standards.
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-4 divide-y divide-white/5">
                {comments.map((comment) => (
                  <div key={comment.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-bold text-xs text-sky-300">
                          {comment.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{comment.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({comment.location})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">{comment.role}</div>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">{comment.date}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-10">
                      {comment.text}
                    </p>

                    <div className="pl-10 flex items-center gap-4 text-[11px] text-slate-400">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 hover:text-white transition-colors ${
                          comment.hasLiked ? 'text-rose-400 font-bold' : ''
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likes} Likes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* 4. Yan Menü (Sticky Sidebar) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Table of Contents Box */}
            {post.sections.length > 1 && (
              <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl space-y-3">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Table of Contents</span>
                </div>
                <div className="space-y-1 text-xs">
                  {post.sections.map((sec, idx) =>
                    sec.heading ? (
                      <a
                        key={idx}
                        href={`#sec-${idx}`}
                        className={`block p-2 rounded-xl transition-all line-clamp-1 ${
                          activeSection === `sec-${idx}`
                            ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="font-mono text-[10px] mr-1.5 opacity-70">
                          {idx + 1}.
                        </span>
                        {sec.heading}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Author Profile Card */}
            <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/10">
                  {post.author.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{post.author.name}</div>
                  <div className="text-xs text-sky-400">{post.author.role}</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Specialized in Canadian synoptic meteorology, extreme winter storm tracking, and Environment Canada numerical prediction models.
              </p>
            </div>

            {/* Social Share Box */}
            <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-2xl space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Share this Analysis
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Post on X</span>
                </a>
              </div>
            </div>

            {/* Live Radar & Highway Shortcut Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/50 to-indigo-950/40 border border-sky-500/25 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
                <span>Canadian Meteorological Network</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track live storm cells and road surface temperatures in real time across Canada.
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <Link
                  href="/radar"
                  className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs text-center transition-colors shadow-lg shadow-sky-500/20"
                >
                  Open Live Doppler Radar
                </Link>
                <Link
                  href="/highways"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs text-center transition-colors"
                >
                  Check Highway Mountain Passes
                </Link>
              </div>
            </div>

            {/* Sticky Sidebar Ad Banner */}
            <div className="print:hidden">
              <AdBanner slotKey="sidebar-tower" />
            </div>
          </aside>
        </div>

        {/* 5. Öneriler / İlgili Makaleler Grid */}
        <div className="space-y-6 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                Curated Recommendations
              </div>
              <h3 className="text-2xl font-black text-white">Recommended Weather Science Stories</h3>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>View All 50+ Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedPosts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                className="group rounded-3xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-sky-500/40 overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="relative h-40 w-full overflow-hidden border-b border-white/10 bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/80 border border-white/10 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                    {rel.category}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/10 text-[9px] font-mono text-emerald-400">
                    {rel.wordCount.toLocaleString()} words
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <h4 className="text-sm sm:text-base font-black text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{rel.excerpt}</p>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rel.readingTimeMin} min read</span>
                    <span className="text-sky-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Read Story →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
