import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/schema";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav className="breadcrumbs" aria-label="Broodkruimel">
        <ol>
          {items.map((item, index) => (
            <li key={item.path}>
              {index === items.length - 1
                ? <span aria-current="page">{item.name}</span>
                : <Link href={item.path}>{item.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
