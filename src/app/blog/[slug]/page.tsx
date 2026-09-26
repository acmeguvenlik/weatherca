import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BLOG_POSTS, FLAGSHIP_POSTS, getBlogPostBySlug } from '@/data/blog-posts';
import { BlogPostClientView } from '@/components/blog/BlogPostClientView';

export const dynamicParams = true;

export async function generateStaticParams() {
  return FLAGSHIP_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | WeatherCA Meteorological Insights`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Calculate Previous and Next Articles
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost =
    currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : BLOG_POSTS[BLOG_POSTS.length - 1];
  const nextPost =
    currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : BLOG_POSTS[0];

  // Calculate Recommendations based on category or shared tags
  const recommendedPosts = BLOG_POSTS.filter(
    (p) =>
      p.slug !== slug &&
      (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
  ).slice(0, 3);

  // If not enough by category/tag, fill with recent stories
  if (recommendedPosts.length < 3) {
    const additional = BLOG_POSTS.filter(
      (p) => p.slug !== slug && !recommendedPosts.some((r) => r.slug === p.slug)
    ).slice(0, 3 - recommendedPosts.length);
    recommendedPosts.push(...additional);
  }

  // Schema.org BlogPosting JSON-LD
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `https://weatherca.net${post.featuredImage}`,
    wordCount: post.wordCount,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'WeatherCA',
      url: 'https://weatherca.net',
      logo: {
        '@type': 'ImageObject',
        url: 'https://weatherca.net/favicon.ico',
      },
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogPostClientView
        post={post}
        prevPost={prevPost}
        nextPost={nextPost}
        recommendedPosts={recommendedPosts}
      />
    </>
  );
}
