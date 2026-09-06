import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

export default function ArticleCard({ article }) {
  return (
    <article className="group">
      <Link to="/about" className="block">
        <div className="overflow-hidden ">
          <img
            src={article.image}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] rounded-2xl"
          />
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-nova-muted">
          {article.category} · {article.readTime}
        </p>
        <h3 className="mt-2 font-display text-3xl leading-tight">{article.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-nova-muted">{article.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em]">
          Read
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rounded-2xl"
          />
        </span>
      </Link>
    </article>
  )
}
