import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description?: string;
  keywords?: string;
}

const DEFAULT_DESCRIPTION =
  "Litera is a trusted online bookstore in Indonesia offering a wide selection of educational books, novels, children's books, reference materials, and the latest releases at affordable prices. Enjoy easy book shopping with fast delivery, secure payment methods, and responsive customer support.";

const DEFAULT_KEYWORDS =
  "litera, bookstore, online bookstore, book store indonesia, online book shop, educational books, children's books, novels, reference books, school books, college books, business books, religious books, fiction books, non-fiction books, new books, affordable books, buy books online, books indonesia";

export default function PageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
}: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", description);

    let metaKeywords = document.querySelector(
      'meta[name="keywords"]'
    ) as HTMLMetaElement | null;

    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }

    metaKeywords.setAttribute("content", keywords);
  }, [title, description, keywords]);

  return null;
}