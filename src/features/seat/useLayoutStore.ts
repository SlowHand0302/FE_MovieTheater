import { Auditable } from '@/interfaces/Auditable.interface';
import { SeatStatus, Seat as ISeat } from '@/interfaces/Seat.interface';
import { SeatType } from '@/interfaces/SeatType.interface';
import { queryClient } from '@/lib/queryClient.config';
import { toast } from 'sonner';
import { create } from 'zustand';

export enum LayoutEditModeEnum {
    SELECT = 'select',
    ADD = 'add',
    DELETE = 'delete',
    TOGGLE_ACTIVE = 'toggle_active',
    CHANGE_TYPE = 'change_type',
}

export interface SeatChanges {
    activatedSeats: Set<string>;
    deactivatedSeats: Set<string>;
    typeChanges: Map<string, string>; // seatId -> newTypeId
    deletedSeats: Set<string>;
    addedSeats: ISeat[];
}

interface SeatLayoutState {
    // State
    localSeats: ISeat[];
    remoteSeats: ISeat[];
    seatTypes: Omit<SeatType, keyof Omit<keyof Auditable, 'id'>>[];
    editMode: LayoutEditModeEnum;
    selectedSeats: ISeat[];
    selectedSeatTypeId: string;
    rows: number;
    columns: number;
    hasUnsavedChanges: boolean;

    // Actions
    setLocalSeats: (seats: ISeat[]) => void;
    setRemoteSeats: (seats: ISeat[]) => void;
    setSeatTypes: (types: SeatType[]) => void;
    setEditMode: (mode: LayoutEditModeEnum) => void;
    setSelectedSeats: (seats: ISeat[]) => void;
    setSelectedSeatTypeId: (typeId: string) => void;
    setRows: (rows: number) => void;
    setColumns: (columns: number) => void;

    // Seats Operations
    handleSeatClick: (seat: ISeat) => void;
    handleEmptyCellClick: (row: string, col: number, roomId: string) => void;
    deleteSeatSelected: () => void;
    toggleActiveSeatSelected: () => void;
    changeTypeSeatSelected: () => void;
    selectRow: (row: string) => void; // NEW: Added for full row selection
    selectColumn: (col: number) => void; // NEW: Added for full column selection

    // Layout Operations
    resetLayout: () => void;

    // Change tracking
    getChanges: () => SeatChanges;
    getChangeSummary: () => string[];

    // Initialize from API data
    initializeFromAPI: (seats: ISeat[], types: SeatType[]) => void;
}

export const useSeatLayoutStore = create<SeatLayoutState>((set, get) => ({
    localSeats: [],
    remoteSeats: [],
    seatTypes: [],
    editMode: LayoutEditModeEnum.SELECT,
    selectedSeats: [],
    selectedSeatTypeId: '',
    rows: 0,
    columns: 0,
    hasUnsavedChanges: false,

    setLocalSeats(seats) {
        set({ localSeats: seats, hasUnsavedChanges: true });
    },

    setRemoteSeats(seats) {
        set({ remoteSeats: seats });
    },

    setSeatTypes(types) {
        set({ seatTypes: types });
    },

    setEditMode(mode) {
        set({ editMode: mode });
    },

    setSelectedSeats(seats) {
        set({ selectedSeats: seats });
    },

    setSelectedSeatTypeId(typeId) {
        set({ selectedSeatTypeId: typeId });
    },

    setRows(rows) {
        set({ rows });
    },

    setColumns(columns) {
        set({ columns });
    },

    initializeFromAPI(seats, types) {
        let maxRow = 0,
            maxCol = 0;

        if (seats.length > 0) {
            maxRow = Math.max(...seats.map((s) => s.label.charCodeAt(0) - 64));
            maxCol = Math.max(...seats.map((s) => s.columnIndex));
        }

        set({
            localSeats: seats,
            remoteSeats: seats,
            seatTypes: types,
            rows: maxRow,
            columns: maxCol,
            hasUnsavedChanges: false,
            selectedSeats: [],
        });
    },

    handleSeatClick(seat) {
        const { editMode, seatTypes, selectedSeatTypeId, selectedSeats } = get();
        if (editMode === LayoutEditModeEnum.SELECT) {
            set({
                selectedSeats:
                    selectedSeats.findIndex((s) => s.id === seat.id) !== -1
                        ? selectedSeats.filter((s) => s.id !== seat.id)
                        : [...selectedSeats, seat],
            });
        } else if (editMode === LayoutEditModeEnum.DELETE) {
            set((state) => ({
                localSeats: state.localSeats.filter((s) => s.id !== seat.id),
                selectedSeats: state.selectedSeats.filter((s) => s.id !== seat.id),
                hasUnsavedChanges: true,
            }));
        } else if (editMode === LayoutEditModeEnum.TOGGLE_ACTIVE) {
            set((state) => ({
                localSeats: state.localSeats.map((s) => (s.id === seat.id ? { ...s, isActive: !s.isActive } : s)),
                hasUnsavedChanges: true,
            }));
        } else if (editMode === LayoutEditModeEnum.CHANGE_TYPE) {
            set((state) => ({
                localSeats: state.localSeats.map((s) => {
                    const type = seatTypes.find((type) => type.id === selectedSeatTypeId)?.type ?? seatTypes[0].type;
                    return s.id === seat.id ? { ...s, seatType: type } : s;
                }),
                hasUnsavedChanges: true,
            }));
        }
    },

    deleteSeatSelected() {
        const { selectedSeats } = get();
        const selectedIds = new Set(selectedSeats.map((s) => s.id));

        set((state) => ({
            localSeats: state.localSeats.filter((s) => !selectedIds.has(s.id)),
            selectedSeats: [],
            hasUnsavedChanges: true,
        }));
    },

    changeTypeSeatSelected() {
        const { seatTypes, selectedSeatTypeId, selectedSeats } = get();
        const type = seatTypes.find((type) => type.id === selectedSeatTypeId)?.type ?? seatTypes[0].type;
        console.log(selectedSeatTypeId);

        set((state) => ({
            localSeats: state.localSeats.map((s) => {
                const isSelected = selectedSeats.findIndex((selected) => selected.id === s.id) !== -1;
                return isSelected ? { ...s, seatType: type } : s;
            }),
            selectedSeats: [],
            hasUnsavedChanges: true,
        }));
    },

    toggleActiveSeatSelected() {
        const { selectedSeats } = get();
        set((state) => ({
            localSeats: state.localSeats.map((s) => {
                const isSelected = selectedSeats.findIndex((selected) => selected.id === s.id) !== -1;
                return isSelected ? { ...s, isActive: !s.isActive } : s;
            }),
            selectedSeats: [],
            hasUnsavedChanges: true,
        }));
    },

    selectColumn(col) {
        const { editMode, localSeats, selectedSeats } = get();
        if (editMode !== LayoutEditModeEnum.SELECT) return;

        const colSeats = localSeats.filter((s) => s.columnIndex === col);
        const allSelected = colSeats.every((s) => selectedSeats.some((sel) => sel.id === s.id));

        let newSelected;
        if (allSelected) {
            // Deselect all in column
            newSelected = selectedSeats.filter((s) => !colSeats.some((cs) => cs.id === s.id));
        } else {
            // Select any unselected in column (additive)
            const toAdd = colSeats.filter((s) => !selectedSeats.some((sel) => sel.id === s.id));
            newSelected = [...selectedSeats, ...toAdd];
        }

        set({ selectedSeats: newSelected });
    },

    selectRow(row) {
        const { editMode, localSeats, selectedSeats } = get();
        if (editMode !== LayoutEditModeEnum.SELECT) return;

        const rowSeats = localSeats.filter((s) => s.label.charAt(0) === row);
        const allSelected = rowSeats.every((s) => selectedSeats.some((sel) => sel.id === s.id));

        let newSelected;
        if (allSelected) {
            // Deselect all in row
            newSelected = selectedSeats.filter((s) => !rowSeats.some((rs) => rs.id === s.id));
        } else {
            // Select any unselected in row (additive)
            const toAdd = rowSeats.filter((s) => !selectedSeats.some((sel) => sel.id === s.id));
            newSelected = [...selectedSeats, ...toAdd];
        }

        set({ selectedSeats: newSelected });
    },

    // TODO
    handleEmptyCellClick(row, col, roomId) {
        console.warn('handleEmptyCellClick function not yet implemented');
    },

    resetLayout() {
        const { remoteSeats, hasUnsavedChanges } = get();
        if (hasUnsavedChanges) {
            if (confirm('Are you sure you want to discard all unsaved changes?')) {
                set({
                    localSeats: remoteSeats,
                    selectedSeats: [],
                    hasUnsavedChanges: false,
                    columns: Math.max(...remoteSeats.map((s) => s.label.charCodeAt(0) - 64)),
                    rows: Math.max(...remoteSeats.map((s) => s.label.charCodeAt(0) - 64)),
                });
                toast.success('Layout reset to last saved state', {
                    richColors: true,
                });
            }
        } else {
            toast.info('No changes to reset', {
                richColors: true,
            });
        }
    },

    getChanges() {
        const { localSeats, remoteSeats } = get();

        const changes: SeatChanges = {
            activatedSeats: new Set(),
            deactivatedSeats: new Set(),
            typeChanges: new Map(),
            deletedSeats: new Set(),
            addedSeats: [],
        };

        // Find deleted seats
        remoteSeats.forEach((origSeat) => {
            if (!localSeats.find((s) => s.id === origSeat.id)) {
                if (origSeat.id) {
                    changes.deletedSeats.add(origSeat.id);
                }
            }
        });

        // Find added seats
        localSeats.forEach((seat) => {
            if (!seat.id || !remoteSeats.find((s) => s.id === seat.id)) {
                changes.addedSeats.push(seat);
            }
        });

        // Find modified seats
        localSeats.forEach((seat) => {
            const original = remoteSeats.find((s) => s.id === seat.id);
            if (original && seat.id) {
                // Check active status changes
                if (seat.isActive !== original.isActive) {
                    if (seat.isActive) {
                        changes.activatedSeats.add(seat.id);
                    } else {
                        changes.deactivatedSeats.add(seat.id);
                    }
                }

                // Check type changes
                if (seat.seatType !== original.seatType) {
                    changes.typeChanges.set(seat.id, seat.seatType);
                }
            }
        });

        return changes;
    },

    getChangeSummary() {
        const changes = get().getChanges();
        const summary = [];

        if (changes.addedSeats.length > 0) {
            summary.push(`${changes.addedSeats.length} seat(s) to add`);
        }
        if (changes.deletedSeats.size > 0) {
            summary.push(`${changes.deletedSeats.size} seat(s) to delete`);
        }
        if (changes.activatedSeats.size > 0) {
            summary.push(`${changes.activatedSeats.size} seat(s) to activate`);
        }
        if (changes.deactivatedSeats.size > 0) {
            summary.push(`${changes.deactivatedSeats.size} seat(s) to deactivate`);
        }
        if (changes.typeChanges.size > 0) {
            summary.push(`${changes.typeChanges.size} seat type change(s)`);
        }

        return summary;
    },
}));
