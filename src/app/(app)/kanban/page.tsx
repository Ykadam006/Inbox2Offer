"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { useApplications } from "@/hooks/use-applications";
import type { Application, ApplicationStage } from "@/types";
import { STAGE_LABELS, STAGE_COLORS } from "@/types";
import { StageBadge } from "@/components/applications/stage-badge";
import { cn } from "@/lib/utils";
import { ExternalLink, GripVertical } from "lucide-react";

const VISIBLE_STAGES: ApplicationStage[] = [
  "saved",
  "applied",
  "oa",
  "recruiter_screen",
  "interview_1",
  "interview_2",
  "final_round",
  "offer",
  "rejected",
  "ghosted",
  "withdrawn",
];

function KanbanCardContent({ app }: { app: Application }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{app.company_name}</p>
          <p className="text-xs text-muted-foreground truncate">{app.role_title}</p>
        </div>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {app.work_mode && (
            <span className="text-xs text-muted-foreground bg-muted rounded-lg px-1.5 py-0.5">
              {app.work_mode}
            </span>
          )}
          {app.priority === "high" && (
            <span className="text-xs text-red-500 bg-red-500/10 rounded-lg px-1.5 py-0.5">
              High
            </span>
          )}
        </div>
        {app.job_link && (
          <a
            href={app.job_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </>
  );
}

function KanbanCard({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: app.id,
    data: { app },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-xl border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:-translate-y-0.5"
      {...listeners}
      {...attributes}
    >
      <KanbanCardContent app={app} />
    </div>
  );
}

function KanbanCardOverlay({ app }: { app: Application }) {
  return (
    <div className="group rounded-xl border bg-card p-3 shadow-2xl opacity-90 rotate-3 scale-105">
      <KanbanCardContent app={app} />
    </div>
  );
}

function KanbanColumn({
  stage,
  apps,
}: {
  stage: ApplicationStage;
  apps: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-2xl border bg-muted/30 transition-colors",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: STAGE_COLORS[stage] }}
          />
          <span className="text-xs font-semibold">{STAGE_LABELS[stage]}</span>
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
          {apps.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-2 min-h-[200px]">
        {apps.map((app) => (
          <KanbanCard key={app.id} app={app} />
        ))}
        {apps.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground py-8">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { applications, isLoading, updateStage } = useApplications();
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const byStage = useMemo(() => {
    const map: Record<ApplicationStage, Application[]> = {} as Record<
      ApplicationStage,
      Application[]
    >;
    VISIBLE_STAGES.forEach((s) => (map[s] = []));
    applications.forEach((a) => {
      if (VISIBLE_STAGES.includes(a.current_stage)) {
        map[a.current_stage].push(a);
      }
    });
    return map;
  }, [applications]);

  function onDragStart(event: DragStartEvent) {
    const app = applications.find((a) => a.id === event.active.id);
    if (app) setActiveApp(app);
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveApp(null);
    const { active, over } = event;
    if (!over) return;

    const appId = String(active.id);
    const newStage = String(over.id) as ApplicationStage;
    const app = applications.find((a) => a.id === appId);

    if (app && app.current_stage !== newStage && VISIBLE_STAGES.includes(newStage)) {
      await updateStage(appId, newStage);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-in">
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Loading your applications...</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {VISIBLE_STAGES.slice(0, 5).map((stage) => (
            <div
              key={stage}
              className="w-64 shrink-0 rounded-2xl border bg-muted/30 h-48 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 animate-in">
      <div>
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Drag and drop to move applications between stages
        </p>
      </div>

      <div className="overflow-x-auto pb-4">
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-3" style={{ minWidth: "max-content" }}>
            {VISIBLE_STAGES.map((stage) => (
              <KanbanColumn key={stage} stage={stage} apps={byStage[stage]} />
            ))}
          </div>

          <DragOverlay>
            {activeApp && <KanbanCardOverlay app={activeApp} />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
