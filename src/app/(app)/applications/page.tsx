"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StageBadge } from "@/components/applications/stage-badge";
import { ApplicationForm } from "@/components/forms/application-form";
import { useApplications } from "@/hooks/use-applications";
import type { Application, ApplicationStage } from "@/types";
import { STAGE_LABELS, SOURCE_LABELS } from "@/types";
import { formatDate, getSalaryDisplay } from "@/lib/utils";
import type { ApplicationFormData } from "@/lib/validations/application";
import { toast } from "sonner";

type SortKey = "company_name" | "role_title" | "applied_date" | "current_stage" | "created_at";
type SortDir = "asc" | "desc";

export default function ApplicationsPage() {
  const { applications, isLoading, createApplication, updateApplication, deleteApplication } =
    useApplications();

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...applications];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.company_name.toLowerCase().includes(q) ||
          a.role_title.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q)
      );
    }

    if (stageFilter !== "all") {
      result = result.filter((a) => a.current_stage === stageFilter);
    }

    if (sourceFilter !== "all") {
      result = result.filter((a) => a.source === sourceFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [applications, search, stageFilter, sourceFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  }

  async function handleAdd(data: ApplicationFormData) {
    setIsFormLoading(true);
    await createApplication(data as Omit<Application, "id" | "user_id" | "created_at" | "updated_at">);
    setIsFormLoading(false);
    setIsAddOpen(false);
  }

  async function handleEdit(data: ApplicationFormData) {
    if (!editApp) return;
    setIsFormLoading(true);
    await updateApplication(editApp.id, data as Partial<Application>);
    setIsFormLoading(false);
    setEditApp(null);
  }

  async function handleDelete(id: string) {
    await deleteApplication(id);
    setDeleteConfirm(null);
  }

  const priorityColors: Record<string, string> = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-emerald-500",
  };

  return (
    <div className="p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} of {applications.length} applications
          </p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search company, role, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={stageFilter}
            onValueChange={(v) => setStageFilter(v as ApplicationStage | "all")}
          >
            <SelectTrigger className="w-44">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="All stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {(Object.entries(STAGE_LABELS) as [ApplicationStage, string][]).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {Object.entries(SOURCE_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              Loading applications...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="text-4xl">📭</div>
              <p className="font-medium">No applications found</p>
              <p className="text-sm text-muted-foreground">
                {applications.length === 0
                  ? "Add your first application to get started"
                  : "Try adjusting your filters"}
              </p>
              {applications.length === 0 && (
                <Button variant="gradient" size="sm" onClick={() => setIsAddOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add Application
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th
                      className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("company_name")}
                    >
                      <div className="flex items-center gap-1">
                        Company <SortIcon col="company_name" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden md:table-cell"
                      onClick={() => toggleSort("role_title")}
                    >
                      <div className="flex items-center gap-1">
                        Role <SortIcon col="role_title" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("current_stage")}
                    >
                      <div className="flex items-center gap-1">
                        Stage <SortIcon col="current_stage" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                      Source
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden lg:table-cell"
                      onClick={() => toggleSort("applied_date")}
                    >
                      <div className="flex items-center gap-1">
                        Applied <SortIcon col="applied_date" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden xl:table-cell">
                      Salary
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {app.priority && (
                            <span
                              className={`text-xs ${priorityColors[app.priority]}`}
                              title={`${app.priority} priority`}
                            >
                              ●
                            </span>
                          )}
                          <div>
                            <span className="font-medium">{app.company_name}</span>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {app.role_title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {app.role_title}
                      </td>
                      <td className="px-4 py-3">
                        <StageBadge stage={app.current_stage} />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {app.source ? SOURCE_LABELS[app.source] || app.source : "—"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {formatDate(app.applied_date)}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground text-xs">
                        {getSalaryDisplay(app.salary_min, app.salary_max)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {app.job_link && (
                            <a
                              href={app.job_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                              title="Open job link"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => setEditApp(app)}
                            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(app.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Application</DialogTitle>
          </DialogHeader>
          <ApplicationForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddOpen(false)}
            isLoading={isFormLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editApp} onOpenChange={(o) => !o && setEditApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {editApp && (
            <ApplicationForm
              defaultValues={editApp}
              onSubmit={handleEdit}
              onCancel={() => setEditApp(null)}
              isLoading={isFormLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete this application and all
            its data.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
