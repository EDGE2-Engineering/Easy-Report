
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

// Keeping initial blogs as fallback/default structure
const INITIAL_BLOGS = [
  {
    id: 1,
    title: "The Benefits of Bilona Ghee in Your Daily Diet",
    excerpt: "Discover why traditional Bilona method ghee is superior to ordinary ghee and how it can improve your health.",
    content: "The traditional Bilona method of making ghee involves churning curd to get butter and then boiling it. This process preserves the essential nutrients and provides several health benefits, including improved digestion and boosted immunity.",
    author: "EDGE2 MTR Team",
    category: "Organic Ghee",
    image: "https://ueirorganic.com/cdn/shop/files/a2desicowghee.jpg?v=1697902974",
    published_at: "2023-10-20T10:00:00Z",
    created_at: "2023-10-20T10:00:00Z"
  },
  {
    id: 2,
    title: "Raw Honey vs. Processed Honey: What You Need to Know",
    excerpt: "Learn the differences between raw, unprocessed honey and the commercial varieties found in most stores.",
    content: "Raw honey is collected straight from the extractor; it is totally unheated, unpasteurized, and unprocessed. This ensures all the natural enzymes and antioxidants remain intact, providing maximum health benefits.",
    author: "Organic Expert",
    category: "Natural Honey",
    image: "https://cpimg.tistatic.com/10619973/b/4/Wild-Forest-Honey..jpg",
    published_at: "2023-10-25T11:30:00Z",
    created_at: "2023-10-25T11:30:00Z"
  }
];

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Error fetching blogs:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const mappedBlogs = data.map(blog => ({
          ...blog,
          // Map snake_case to app standard camelCase or simplify
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          author: blog.author,
          category: blog.category,
          image: blog.cover_image, // Map cover_image to image
          date: blog.published_at
            ? new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : new Date(blog.created_at).toLocaleDateString()
        }));
        setBlogs(mappedBlogs);
      } else {
        // Fallback to initial blogs if DB is empty
        const mappedInitialBlogs = INITIAL_BLOGS.map(blog => ({
          ...blog,
          date: new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }));
        setBlogs(mappedInitialBlogs);
      }
    } catch (error) {
      console.error("Blog fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const addBlog = async (blog) => {
    try {
      const { error } = await supabase.from('blogs').insert({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        category: blog.category,
        cover_image: blog.image,
        published: true,
        slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published_at: new Date().toISOString()
      });

      if (error) throw error;
      fetchBlogs(); // Refresh to get real ID and data
    } catch (e) {
      console.error("Add blog error:", e);
      alert("Failed to add blog. Check console.");
    }
  };

  const updateBlog = async (updatedBlog) => {
    try {
      const { error } = await supabase.from('blogs').update({
        title: updatedBlog.title,
        excerpt: updatedBlog.excerpt,
        content: updatedBlog.content,
        author: updatedBlog.author,
        category: updatedBlog.category,
        cover_image: updatedBlog.image, // Map back to DB column
        updated_at: new Date().toISOString()
      }).eq('id', updatedBlog.id);

      if (error) throw error;

      // Update local state to reflect changes immediately
      setBlogs(prev => prev.map(b => b.id === updatedBlog.id ? { ...b, ...updatedBlog } : b));

      // Also fetch to be sure
      fetchBlogs();
    } catch (e) {
      console.error("Update blog error:", e);
      alert("Failed to update blog. Check console.");
    }
  };

  const deleteBlog = async (id) => {
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      console.error("Delete blog error:", e);
    }
  };

  const getBlog = (id) => {
    return blogs.find(b => b.id.toString() === id.toString());
  };

  return {
    blogs,
    loading,
    addBlog,
    updateBlog,
    deleteBlog,
    getBlog,
    refreshBlogs: fetchBlogs
  };
};
