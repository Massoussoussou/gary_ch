import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import actualites from "../data/actualites.json";

const categoryColors = {
  Article: "bg-black/80 text-white",
  Podcast: "bg-[#FF4A3E] text-white",
  Video: "bg-[#1a1a2e] text-white",
  Presse: "bg-[#2563eb] text-white",
};

export default function ActualiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Trouver l'article par ID
  const article = actualites.find((a) => a.id === parseInt(id));

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Article non trouvé</h1>
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 text-[#FF4A3E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  // Parse markdown-style content
  const renderContent = (content) => {
    if (!content) return null;

    const lines = content.split("\n");
    const elements = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Heading 2
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key++} className="text-3xl md:text-4xl font-serif mt-12 mb-6 first:mt-0">
            {line.replace("## ", "")}
          </h2>
        );
      }
      // Bold text
      else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={key++} className="text-lg font-semibold mt-6 mb-3">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      // List item
      else if (line.startsWith("- ")) {
        // Collect consecutive list items
        const listItems = [line.replace("- ", "")];
        while (i + 1 < lines.length && lines[i + 1].startsWith("- ")) {
          i++;
          listItems.push(lines[i].replace("- ", ""));
        }
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-2 my-4 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-lg leading-relaxed text-neutral-700">
                {item}
              </li>
            ))}
          </ul>
        );
      }
      // Regular paragraph
      else if (line.trim() !== "") {
        // Handle italic text
        const text = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        elements.push(
          <p
            key={key++}
            className="text-lg leading-relaxed text-neutral-700 my-4"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        );
      }
      // Empty line
      else {
        elements.push(<div key={key++} className="h-2" />);
      }
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <button
          onClick={() => navigate("/actualites")}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour aux actualités</span>
        </button>
      </div>

      {/* Hero image */}
      <div className="w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden bg-neutral-100">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article content */}
      <article className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${categoryColors[article.category]}`}>
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar className="w-4 h-4" />
            <time>{article.date}</time>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-6">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-xl text-neutral-600 leading-relaxed mb-12 pb-12 border-b border-neutral-200">
          {article.description}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {renderContent(article.content)}
        </div>

        {/* External link if available */}
        {article.link && (
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold hover:bg-[#FF4A3E] transition-colors"
            >
              Lire l'article original sur gary.ch
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Back to list */}
        <div className="mt-16 text-center">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voir toutes les actualités
          </Link>
        </div>
      </article>
    </div>
  );
}
