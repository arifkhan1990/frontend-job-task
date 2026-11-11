import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Columns3,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { EmptyState } from '../shared/EmptyState.jsx';
import { ErrorState } from '../shared/ErrorState.jsx';
import { Pagination } from './Pagination.jsx';
import { Select } from './Select.jsx';
import { TableSkeleton } from './Skeleton.jsx';

function SortIcon({ direction }) {
  if (direction === 'asc') {
    return <ArrowUp size={14} aria-hidden="true" />;
  }

  if (direction === 'desc') {
    return <ArrowDown size={14} aria-hidden="true" />;
  }

  return <ArrowUpDown size={14} aria-hidden="true" />;
}

export function DataTable({
  columns,
  data = [],
  loading = false,
  error = '',
  onRetry,
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  bulkActions,
  emptyTitle,
  emptyDescription,
  searchPlaceholder,
  renderMobileCard,
  getRowId = (row) => row._id,
  enableSelection = true,
  canSelectRow,
}) {
  const isMobile = useMediaQuery('(max-width: 760px)');
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 300);
  const [localPageSize, setLocalPageSize] = useState(10);

  const effectivePageSize = meta?.limit || localPageSize;

  const tableColumns = useMemo(() => {
    if (!enableSelection) {
      return columns;
    }

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            aria-label={'Select all'}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={'Select row'}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter: debouncedFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    getRowId,
    enableRowSelection: canSelectRow
      ? (row) => canSelectRow(row.original)
      : undefined,
  });

  useEffect(() => {
    setRowSelection({});
  }, [data, meta?.page]);

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const clearSelection = () => setRowSelection({});

  function handlePageSizeChange(value) {
    const nextSize = Number(value);
    setLocalPageSize(nextSize);
    onPageSizeChange?.(nextSize);
  }

  return (
    <div className="ui-datatable">
      <div className="ui-table-toolbar">
        <label className="ui-table-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">{'Search'}</span>
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={searchPlaceholder || 'Search…'}
          />
        </label>

        <div className="ui-table-toolbar__actions">
          <span className="ui-muted ui-small">{'Rows per page'}</span>
          <Select
            value={String(effectivePageSize)}
            onValueChange={handlePageSizeChange}
            ariaLabel={'Rows per page'}
            options={pageSizeOptions.map((size) => ({
              value: String(size),
              label: String(size),
            }))}
            className="ui-select-trigger--compact"
          />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button" className="ui-button ui-button--ghost ui-button--sm">
                <Columns3 size={16} aria-hidden="true" />
                {'Columns'}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="ui-menu" sideOffset={8} align="end">
                <p className="ui-menu__label">{'Toggle columns'}</p>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenu.CheckboxItem
                      key={column.id}
                      className="ui-menu__item"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(value)}
                    >
                      <span>{column.columnDef.meta?.label || column.id}</span>
                      <DropdownMenu.ItemIndicator>
                        <Check size={14} aria-hidden="true" />
                      </DropdownMenu.ItemIndicator>
                    </DropdownMenu.CheckboxItem>
                  ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {selectedRows.length > 0 && bulkActions ? (
        <div className="ui-table-selection">
          <span>Selected {selectedRows.length}</span>
          <div className="ui-row">
            {bulkActions({ selectedRows, clearSelection })}
            <button
              type="button"
              className="ui-button ui-button--ghost ui-button--sm"
              onClick={clearSelection}
            >
              {'Clear'}
            </button>
          </div>
        </div>
      ) : null}

      {loading ? <TableSkeleton columns={tableColumns.length} /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={onRetry} /> : null}

      {!loading && !error && data.length === 0 ? (
        <EmptyState
          title={emptyTitle || 'No data'}
          description={emptyDescription}
        />
      ) : null}

      {!loading && !error && data.length > 0 && isMobile && renderMobileCard ? (
        <div className="ui-mobile-list">
          {table.getRowModel().rows.map((row) => (
            <article className="ui-mobile-card" key={row.id}>
              {enableSelection ? (
                <input
                  type="checkbox"
                  aria-label={'Select row'}
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={row.getToggleSelectedHandler()}
                />
              ) : null}
              {renderMobileCard(row.original)}
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !error && data.length > 0 && (!isMobile || !renderMobileCard) ? (
        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} scope="col">
                      {header.isPlaceholder ? null : (
                        <div className="ui-table__header">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() ? (
                            <button
                              type="button"
                              className="ui-table__sort"
                              onClick={header.column.getToggleSortingHandler()}
                              aria-label={
                                header.column.getIsSorted() === 'asc'
                                  ? 'Sort descending'
                                  : 'Sort ascending'
                              }
                            >
                              <SortIcon direction={header.column.getIsSorted()} />
                            </button>
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length} className="ui-table__empty">
                    {'No results'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      <Pagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
