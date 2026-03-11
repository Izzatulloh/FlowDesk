"use client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ModuleRegistry, AllCommunityModule, ColDef,
  GridReadyEvent, GridApi
} from "ag-grid-community";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Save, PenLine, RotateCcw, Trash2, BookMarked,
  Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { updateView } from "@/app/actions/views/updateView";
import { createView } from "@/app/actions/views/createView";
import { deleteView } from "@/app/actions/views/deleteView";

ModuleRegistry.registerModules([AllCommunityModule]);

export type GridViewConfig = {
  columnState: any;
  filterModel: any;
};

type GenericGridProps = {
  title: string;
  page: string;
  rowData: any[];
  columnDefs: ColDef[];
  defaultVisibleColumns?: string[];
  savedViewState?: GridViewConfig | null;
  savedViews?: any[];
  onViewsUpdated?: () => void;
  onServerRefetch?: (filterModel: Record<string, any>) => void;
  isRefetching?: boolean;
};

export default function GenericGrid({
  title, page, rowData, columnDefs, defaultVisibleColumns,
  savedViewState, savedViews = [], onViewsUpdated,
  onServerRefetch, isRefetching = false,
}: GenericGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const gridApiRef = useRef<GridApi | null>(null);

  const [unsaved, setUnsaved] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saveMode, setSaveMode] = useState<"new" | "update">("new");
  const [newViewName, setNewViewName] = useState("");
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  const [selectedViewName, setSelectedViewName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const processedColumnDefs = useMemo(() => {
    if (!defaultVisibleColumns || defaultVisibleColumns.length === 0) return columnDefs;
    return columnDefs.map((col) => ({
      ...col, sortable: true, filter: true,
      hide: col.field ? !defaultVisibleColumns.includes(col.field) : false,
    }));
  }, [columnDefs, defaultVisibleColumns]);

  const defaultColDef = useMemo(() => ({
    sortable: true, filter: true, resizable: true, flex: 1, minWidth: 120,
  }), []);

  const applyViewConfig = useCallback((config: GridViewConfig, api: GridApi) => {
    try {
      if (config.columnState?.length > 0) {
        api.applyColumnState({ state: config.columnState, applyOrder: true });
      }
      if (config.filterModel) api.setFilterModel(config.filterModel);
    } catch (err) {
      console.error("Error applying view config:", err);
    }
  }, []);

  const handleGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    if (savedViewState) applyViewConfig(savedViewState, params.api);
    setUnsaved(false);
  }, [savedViewState, applyViewConfig]);

  useEffect(() => {
    if (savedViewState && gridApiRef.current) {
      applyViewConfig(savedViewState, gridApiRef.current);
      setUnsaved(false);
    }
  }, [savedViewState, applyViewConfig]);

  const getGridState = useCallback((): GridViewConfig | null => {
    if (!gridApiRef.current) return null;
    try {
      const api = gridApiRef.current;
      return { columnState: api.getColumnState() ?? [], filterModel: api.getFilterModel() ?? {} };
    } catch { return null; }
  }, []);

  const markUnsaved = useCallback(() => setUnsaved(true), []);

  const handleSortChanged = useCallback(() => markUnsaved(), [markUnsaved]);

  const handleFilterChanged = useCallback(() => {
    markUnsaved();
    if (!onServerRefetch || !gridApiRef.current) return;
    onServerRefetch(gridApiRef.current.getFilterModel() ?? {});
  }, [onServerRefetch, markUnsaved]);

  const handleReset = useCallback(() => {
    if (!gridApiRef.current) return;
    gridApiRef.current.setFilterModel({});
    gridApiRef.current.resetColumnState();
    setUnsaved(false);
    setSelectedViewId(null);
    setSelectedViewName("");
    onServerRefetch?.({});
  }, [onServerRefetch]);

  const openSaveDialog = useCallback((mode: "new" | "update") => {
    setSaveMode(mode);
    setNewViewName(mode === "update" ? selectedViewName : "");
    setShowSaveDialog(true);
  }, [selectedViewName]);

  const handleSaveView = async () => {
    const state = getGridState();
    if (!state) return;
    const viewName = newViewName.trim() || `${title} View ${new Date().toLocaleDateString()}`;
    setIsSaving(true);
    try {
      if (saveMode === "update" && selectedViewId) {
        await updateView(selectedViewId, viewName, state);
        setSelectedViewName(viewName);
      } else {
        const created = await createView(viewName, page, state);
        if (created) { setSelectedViewId(created.id); setSelectedViewName(viewName); }
      }
      setUnsaved(false);
      setShowSaveDialog(false);
      setNewViewName("");
      onViewsUpdated?.();
    } catch {
      alert("Failed to save view");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteView = async () => {
    if (!selectedViewId) return;
    setIsDeleting(true);
    try {
      await deleteView(selectedViewId);
      setSelectedViewId(null);
      setSelectedViewName("");
      setShowDeleteDialog(false);
      onViewsUpdated?.();
    } catch {
      alert("Failed to delete view");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectView = useCallback((viewId: string) => {
    if (!viewId) return;
    const view = savedViews.find(v => v.id === viewId);
    if (!view || !gridApiRef.current) return;
    setSelectedViewId(viewId);
    setSelectedViewName(view.view_name);
    applyViewConfig({ columnState: view.column_state, filterModel: view.filter_model }, gridApiRef.current);
    setUnsaved(false);
    onServerRefetch?.(view.filter_model ?? {});
  }, [savedViews, applyViewConfig, onServerRefetch]);

  return (
    <>
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold">{title}</h2>
              {isRefetching && (
                <Badge variant="secondary" className="gap-1 text-xs font-normal">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Refreshing...
                </Badge>
              )}
              {unsaved && (
                <Badge variant="outline" className="gap-1 text-xs font-normal border-orange-200 bg-orange-50 text-orange-700">
                  <AlertCircle className="h-3 w-3" />
                  Unsaved changes
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tooltip content="Save current grid state as a new view">
                <Button size="sm" onClick={() => openSaveDialog("new")} className="gap-1.5">
                  <Save className="h-3.5 w-3.5" />
                  Save as New View
                </Button>
              </Tooltip>

              {selectedViewId && (
                <Tooltip content={`Update "${selectedViewName}" with current state`}>
                  <Button size="sm" variant="secondary" onClick={() => openSaveDialog("update")} className="gap-1.5">
                    <PenLine className="h-3.5 w-3.5" />
                    Update View
                  </Button>
                </Tooltip>
              )}

              <Tooltip content="Reset columns, filters to defaults">
                <Button size="sm" variant="outline" onClick={handleReset} className="gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="flex">
            {savedViews.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                  <BookMarked className="h-3.5 w-3.5" />
                  <span className="font-medium">Saved Views:</span>
                </div>
                <Select
                  value={selectedViewId || ""}
                  onChange={(e) => handleSelectView(e.target.value)}
                  className="w-52 h-10 text-s"
                >
                  <option value="" disabled>Select a view</option>
                  {savedViews.map(view => (
                    <option key={view.id} value={view.id}>{view.view_name}</option>
                  ))}
                </Select>
                {selectedViewId && (
                  <Tooltip content="Delete this saved view">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowDeleteDialog(true)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
          <Separator className="mt-4" />
        </CardHeader>

        <CardContent className="pt-4 px-4 pb-4">
          <div className="ag-theme-quartz h-[540px] w-full rounded-lg overflow-hidden border">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={processedColumnDefs}
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={20}
              onGridReady={handleGridReady}
              onColumnMoved={markUnsaved}
              onColumnVisible={markUnsaved}
              onColumnResized={markUnsaved}
              onSortChanged={handleSortChanged}
              onFilterChanged={handleFilterChanged}
              suppressMovableColumns={false}
              animateRows
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{saveMode === "update" ? "Update View" : "Save as New View"}</DialogTitle>
            <DialogDescription>
              {saveMode === "update"
                ? `Update "${selectedViewName}" with the current column arrangement and filters.`
                : "Save the current grid configuration as a named view you can reload anytime."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="view-name">View Name</Label>
            <Input
              id="view-name"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSaving && handleSaveView()}
              placeholder={`e.g. ${title} — Paid Only`}
              disabled={isSaving}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSaveView} disabled={isSaving} className="gap-1.5">
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSaving ? "Saving..." : saveMode === "update" ? "Update" : "Save View"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete View</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold">{selectedViewName}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteView} disabled={isDeleting} className="gap-1.5">
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete View"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}