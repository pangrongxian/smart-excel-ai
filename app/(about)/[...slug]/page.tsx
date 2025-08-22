import "@/styles/mdx.css";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function PagePage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
    </article>
  );
}
