import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: "Igor Konovalov's Blog",
    description:
      'Projects and experiments with JavaScript, generative art, and algorithmic visualization',
    site: context.site!.toString(),
    items: sortedPosts.map((post) => {
      const { date, tags } = post.data;
      const category = tags?.[0] || 'personal';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const slug = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description || '',
        link: `/${category}/${year}/${month}/${day}/${slug}/`,
      };
    }),
  });
}
