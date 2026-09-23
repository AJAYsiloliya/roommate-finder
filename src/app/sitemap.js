export default function sitemap() {
  const baseUrl = "https://roommate-finder-lac.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/find-roommate`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/community-guidelines`,
      lastModified: new Date(),
    },
  ];
}