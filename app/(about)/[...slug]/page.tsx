import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/mdx/mdx-components";

import "@/styles/mdx.css";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPageFromParams(params: { slug: string[] }) {
  const slug = params?.slug?.join("/");
  const page = allPosts.find((page) => page.slugAsParams === slug);

  if (!page) {
    return null;
  }

  return page;
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return allPosts.map((page) => ({
    slug: page.slugAsParams?.split("/") || [],
  }));
}

export default async function PagePage({ params }: PageProps) {
  const resolvedParams = await params;
  const page = await getPageFromParams(resolvedParams);

  if (!page) {
    notFound();
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-xl text-muted-foreground">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx code={page.body.code} />
    </article>
  );
}
