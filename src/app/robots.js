export default function robots() {
  const baseUrl = "https://roommate-finder-lac.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}