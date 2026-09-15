import { AppShell } from "@/components/life/app-shell";
import { PageHeader, Panel, EmptyState } from "@/components/life/primitives";

export function SoonPage({
  eyebrow,
  title,
  description,
  hint,
}: {
  eyebrow: string;
  title: string;
  description: string;
  hint: string;
}) {
  return (
    <AppShell>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Panel>
        <EmptyState title="Este módulo entra na próxima etapa" hint={hint} />
      </Panel>
    </AppShell>
  );
}
