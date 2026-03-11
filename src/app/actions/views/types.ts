import { ColumnState, FilterModel, } from "ag-grid-community";
export type GridViewConfig = {
    columnState: ColumnState[];
    filterModel: FilterModel[];
};

export interface GridView {
    id: string;
    user_id: string;
    view_name: string;
    page: string;
    column_state: any;
    filter_model: any;
    sort_model: any;
    created_at: string;
    updated_at: string;
}