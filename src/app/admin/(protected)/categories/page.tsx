import Link from "next/link";

import { CategoryDeleteButton } from "@/components/admin/category-delete-button";
import { CategoryForm } from "@/components/admin/category-form";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function loadCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    include: { _count: { select: { products: true, children: true } } },
  });
}

type CategoryWithCounts = Awaited<ReturnType<typeof loadCategories>>[number];
type CategoryNode = CategoryWithCounts & { children: CategoryNode[] };

function buildTree(categories: CategoryWithCounts[]) {
  const nodes = new Map<string, CategoryNode>(categories.map((category) => [category.id, { ...category, children: [] }]));
  const roots: CategoryNode[] = [];
  for (const category of categories) {
    const node = nodes.get(category.id)!;
    const parent = category.parentId ? nodes.get(category.parentId) : null;
    if (parent) parent.children.push(node); else roots.push(node);
  }
  return roots;
}

function descendants(node: CategoryNode): string[] { return [node.id, ...node.children.flatMap(descendants)]; }
function findNode(nodes: CategoryNode[], id: string): CategoryNode | undefined {
  for (const node of nodes) { if (node.id === id) return node; const found = findNode(node.children, id); if (found) return found; }
  return undefined;
}

function Tree({ nodes, depth = 0 }: { nodes: CategoryNode[]; depth?: number }) {
  return <ul className={depth ? "mt-2 border-s border-black/10 ps-4" : "space-y-2"}>{nodes.map((node) => <li key={node.id} className="rounded-xl border border-black/10 bg-white p-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{node.nameAr} <span dir="ltr" className="font-latin text-sm font-normal text-muted-foreground">— {node.nameEn}</span></p><p dir="ltr" className="font-latin mt-1 text-xs text-muted-foreground">{node.slug}</p><p className="mt-1 text-xs text-muted-foreground">{node._count.products} منتجات · {node._count.children} فروع · {node.isActive ? "نشط" : "غير نشط"}</p></div><div className="flex items-center gap-3"><Link href={`/admin/categories?edit=${node.id}`} className="text-sm font-bold text-primary hover:underline">تعديل</Link><CategoryDeleteButton id={node.id} /></div></div>{node.children.length > 0 && <Tree nodes={node.children} depth={depth + 1} />}</li>)}</ul>;
}

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const [categories, query] = await Promise.all([loadCategories(), searchParams]);
  const edit = query.edit ? categories.find((item) => item.id === query.edit) : undefined;
  const tree = buildTree(categories);
  const excluded = edit ? new Set(findNode(tree, edit.id) ? descendants(findNode(tree, edit.id)!) : [edit.id]) : new Set<string>();
  const parentOptions = categories.filter((item) => !excluded.has(item.id));
  return <div><div><p className="text-sm font-semibold text-muted-foreground">إدارة الكتالوج</p><h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">التصنيفات</h2></div><div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_24rem]"><section><Tree nodes={tree} /></section><aside className="xl:sticky xl:top-6 xl:self-start"><CategoryForm category={edit} parentOptions={parentOptions} /></aside></div></div>;
}
