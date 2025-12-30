import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

import Seat from './Seat';
import { toast } from 'sonner';
import EmptySeat from './EmptySeat';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import SeatLayoutStats from './SeatLayoutStats';
import SeatLayoutLegend from './SeatLayoutLegend';
import SeatTypeButtonGroup from './SeatTypeButtonGroup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Save, RotateCcw, SquarePower, MousePointerClick, Sparkles, Loader2 } from 'lucide-react';

import { Seat as ISeat } from '@/interfaces/Seat.interface';
import { dummySeatTypes } from '@/features/seat-type/constants/dummyData.constant';
import { useSeatsByRoom } from '@/features/seat/queries';
import { useSeatTypes } from '@/features/seat-type/queries';
import { SeatType } from '@/interfaces/SeatType.interface';
import { queryClient } from '@/lib/queryClient.config';
import { usePatchSeat } from '@/features/seat/mutations';
import { LayoutEditModeEnum, useSeatLayoutStore } from '@/features/seat/useLayoutStore';

export type EditMode = 'select' | 'add' | 'delete' | 'toggle-active' | 'change-type';

const CinemaSeatAdmin: React.FC = () => {
    const { roomId } = useParams<{ id: string; roomId: string }>();
    const {
        data: remoteSeatsData = [],
        isPending: remoteSeatsPending,
        isError: remoteSeatsError,
    } = useSeatsByRoom(roomId);
    const { data: seatTypesData = [], isPending: seatTypesPending, isError: seatTypesError } = useSeatTypes({});
    const fetchedSeatTypes = seatTypesData as SeatType[];
    const fetchedRemoteSeats = remoteSeatsData as ISeat[];

    const { mutateAsync: patchSeatAsync } = usePatchSeat();

    const {
        seatTypes,
        localSeats,
        initializeFromAPI,
        rows,
        selectRow,
        columns,
        selectColumn,
        editMode,
        setEditMode,
        handleSeatClick,
        selectedSeatTypeId,
        setSelectedSeatTypeId,
        selectedSeats,
        deleteSeatSelected,
        changeTypeSeatSelected,
        toggleActiveSeatSelected,
        resetLayout,
        getChangeSummary,
        getChanges,
        hasUnsavedChanges,
    } = useSeatLayoutStore();

    const getSeatColor = (seat: ISeat) => {
        if (selectedSeats.findIndex((s) => s.id === seat.id) !== -1) {
            return 'bg-green-500 ring-4 ring-green-300';
        }
        if (!seat.isActive) {
            return 'bg-gray-300 border-2 border-gray-400 opacity-50';
        }
        let color: string = '';
        switch (seat.seatType.toLowerCase()) {
            case 'standard':
                color = 'bg-blue-400 hover:bg-blue-500';
                break;
            case 'premium':
                color = 'bg-purple-400 hover:bg-purple-500';
                break;
            case 'recliner':
                color = 'bg-yellow-400 hover:bg-yellow-500';
                break;
            case 'vip sofa':
                color = 'bg-pink-400 hover:bg-pink-500';
                break;
            case 'loveseat':
                color = 'bg-orange-400 hover:bg-orange-500';
                break;
            default:
                break;
        }

        return color;
    };

    const saveLayout = async () => {
        try {
            const changes = getChanges();

            // Save all changes in sequence
            const promises = [];

            // Handle activation changes
            if (changes.activatedSeats.size > 0) {
                promises.push(
                    patchSeatAsync({
                        data: {
                            ids: Array.from(changes.activatedSeats),
                            isActive: true,
                        },
                    }),
                );
            }

            // Handle deactivation changes
            if (changes.deactivatedSeats.size > 0) {
                promises.push(
                    patchSeatAsync({
                        data: {
                            ids: Array.from(changes.deactivatedSeats),
                            isActive: false,
                        },
                    }),
                );
            }

            // Handle type changes (group by new type)
            const typeGroups = new Map<string, string[]>();
            changes.typeChanges.forEach((newType, seatId) => {
                const newTypeId = seatTypes.filter((type) => type.type === newType)[0]?.id ?? seatTypes[0]?.id;
                if (!typeGroups.has(newTypeId)) {
                    typeGroups.set(newTypeId, []);
                }
                typeGroups.get(newTypeId)!.push(seatId);
            });
            console.log(typeGroups);

            typeGroups.forEach((seatIds, typeId) => {
                const seat = localSeats.find((s) => seatIds.includes(s.id!));
                promises.push(
                    patchSeatAsync({
                        data: {
                            ids: seatIds,
                            isActive: seat?.isActive ?? true,
                            seatTypeId: typeId,
                        },
                    }),
                );
            });

            // TODO: Handle deletedSeats and addedSeats when you have DELETE and POST endpoints
            if (changes.deletedSeats.size > 0) {
                console.warn('Seat deletion not yet implemented - need DELETE endpoint');
            }
            if (changes.addedSeats.length > 0) {
                console.warn('Seat creation not yet implemented - need POST endpoint');
            }

            await Promise.all(promises);

            // Invalidate and refetch
            await queryClient.invalidateQueries({ queryKey: ['seats', roomId] });

            toast.success('Seat layout saved successfully!', { richColors: true });
        } catch (error) {
            toast.error('Failed to save seat layout. Please try again.', { richColors: true });
            console.error('Error saving layout:', error);
        }
    };

    const groupedSeats = localSeats.reduce(
        (acc, seat) => {
            if (!acc[seat.label.charAt(0)]) acc[seat.label.charAt(0)] = {};
            acc[seat.label.charAt(0)][seat.columnIndex] = seat;
            return acc;
        },
        {} as Record<string, Record<number, ISeat>>,
    );

    const allRows = Array.from(
        new Set([...Object.keys(groupedSeats), ...Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i))]),
    ).sort();

    const maxCols = Math.max(columns, ...localSeats.map((s) => s.columnIndex));

    useEffect(() => {
        if (!remoteSeatsPending && !seatTypesPending && fetchedRemoteSeats && fetchedSeatTypes) {
            initializeFromAPI(fetchedRemoteSeats, fetchedSeatTypes);
        }
    }, [remoteSeatsPending, seatTypesPending, fetchedRemoteSeats, fetchedSeatTypes, initializeFromAPI]);

    // Loading state
    if (remoteSeatsPending || seatTypesPending) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading seats...</span>
            </div>
        );
    }

    // Error state
    if (remoteSeatsError || seatTypesError) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load seats</p>
                    <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['seats', roomId] })}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    console.log(localSeats);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2">
                {/* Control Panel */}
                <Card className="lg:col-span-1">
                    <CardHeader className="md:px-6 px-3">
                        <CardTitle className="text-xl">Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 md:px-4 px-2">
                        {/* Edit Mode */}
                        <div className="space-y-2 max-w-full">
                            <Label className="">Edit Mode</Label>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 w-full">
                                    <Button
                                        variant={editMode === LayoutEditModeEnum.SELECT ? 'default' : 'outline'}
                                        className="flex-1 justify-start"
                                        onClick={() => setEditMode(LayoutEditModeEnum.SELECT)}
                                    >
                                        <MousePointerClick className="h-4 w-4" />
                                        Select Seats
                                    </Button>
                                    <Button
                                        variant={editMode === LayoutEditModeEnum.TOGGLE_ACTIVE ? 'default' : 'outline'}
                                        className="flex-1 justify-start"
                                        onClick={() => setEditMode(LayoutEditModeEnum.TOGGLE_ACTIVE)}
                                    >
                                        <SquarePower className="h-4 w-4" />
                                        Toggle Active
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full">
                                    <Button
                                        variant={editMode === LayoutEditModeEnum.ADD ? 'default' : 'outline'}
                                        className="flex-1 justify-start"
                                        disabled
                                        onClick={() => setEditMode(LayoutEditModeEnum.ADD)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Seat
                                    </Button>
                                    <Button
                                        variant={editMode === LayoutEditModeEnum.DELETE ? 'default' : 'outline'}
                                        className="flex-1 justify-start"
                                        disabled
                                        onClick={() => setEditMode(LayoutEditModeEnum.DELETE)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Seat
                                    </Button>
                                </div>
                                <SeatTypeButtonGroup
                                    types={seatTypes}
                                    isActive={editMode === LayoutEditModeEnum.CHANGE_TYPE}
                                    selectedType={selectedSeatTypeId}
                                    onClick={() => setEditMode(LayoutEditModeEnum.CHANGE_TYPE)}
                                    onSelectType={(type) => setSelectedSeatTypeId(type)}
                                />
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedSeats.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-slate-700">
                                <Label className="">Bulk Actions ({selectedSeats.length} selected)</Label>
                                <Button variant="destructive" className="w-full" onClick={deleteSeatSelected}>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Selected
                                </Button>
                                <Button variant="outline" className="w-full" onClick={toggleActiveSeatSelected}>
                                    Toggle Active
                                </Button>
                                <SeatTypeButtonGroup
                                    types={seatTypes}
                                    isActive={false}
                                    selectedType={selectedSeatTypeId}
                                    onClick={changeTypeSeatSelected}
                                    onSelectType={(type) => setSelectedSeatTypeId(type)}
                                />
                            </div>
                        )}

                        {/* Save */}
                        <div className="pt-4 border-t border-slate-700 space-y-2">
                            {hasUnsavedChanges && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <Label className="text-base font-semibold text-amber-900 dark:text-amber-300">
                                        Unsaved Changes
                                    </Label>
                                    <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-400">
                                        {getChangeSummary().map((change, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                                                {change}
                                            </li>
                                        ))}
                                        {getChangeSummary().length === 0 && (
                                            <li className="italic">No changes detected</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                            <div className="flex gap-2 w-full">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={resetLayout}
                                    disabled={!hasUnsavedChanges}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Discard Changes
                                </Button>
                                <Button
                                    className=" flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={saveLayout}
                                    disabled={!hasUnsavedChanges}
                                >
                                    <Save className="h-4 w-4" />
                                    Save Layout
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <SeatLayoutStats seats={localSeats} seatTypes={seatTypes} />
                    </CardContent>
                </Card>

                {/* Seat Grid */}
                <Card className="lg:col-span-3">
                    <CardHeader className="md:px-6 px-3">
                        <CardTitle className="text-xl">Seat Layout Review</CardTitle>
                    </CardHeader>
                    <CardContent className="md:px-6 px-3">
                        {/* Instructions */}
                        <div className="mb-4 p-3 border-2 rounded-lg">
                            <p className="text-sm ">
                                <strong>Current Mode: {editMode.toUpperCase()}</strong>
                                {editMode === LayoutEditModeEnum.SELECT && ' - Click seats to select them'}
                                {editMode === LayoutEditModeEnum.ADD && ' - Click empty cells to add seats'}
                                {editMode === LayoutEditModeEnum.DELETE && ' - Click seats to remove them'}
                                {editMode === LayoutEditModeEnum.TOGGLE_ACTIVE && ' - Click to enable/disable seats'}
                                {editMode === LayoutEditModeEnum.CHANGE_TYPE && ' - Click to toggle VIP/Standard'}
                            </p>
                        </div>

                        {/* Screen */}
                        <div className="relative mb-8">
                            <div className="h-2 bg-gradient-to-r from-transparent via-black to-transparent rounded-full mb-4" />
                            <p className="text-center text-sm">SCREEN</p>
                        </div>

                        {/* Seat Grid */}
                        <div className="flex justify-center relative">
                            <div className="space-y-2 overflow-auto max-h-screen p-2 items-start flex flex-col ">
                                {/* NEW: Column Headers */}
                                <div className="flex items-center justify-center gap-2 sticky top-0 z-10 -translate-y-2 backdrop-filter backdrop-blur-lg bg-background/30 shadow-sm border-b border-border">
                                    <span className="w-8 h-8 text-center leading-loose font-semibold sticky left-0 -translate-x-2 backdrop-filter backdrop-blur-lg bg-background/30">
                                        {/* Empty corner */}
                                    </span>
                                    <div className="flex gap-2">
                                        {Array.from({ length: maxCols }, (_, i) => i + 1).map((col) => (
                                            <span
                                                key={col}
                                                className="w-8 h-8 text-center leading-loose font-semibold cursor-pointer hover:bg-slate-200"
                                                onClick={() => selectColumn(col)}
                                            >
                                                {col}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {allRows.map((row) => (
                                    <div key={row} className="flex items-center justify-center gap-2 relative">
                                        <span
                                            onClick={() => selectRow(row)}
                                            className="w-8 h-8 text-center leading-loose font-semibold sticky left-0 -translate-x-2 z-10 cursor-pointer hover:bg-slate-200 border-r border-border backdrop-filter backdrop-blur-lg bg-background/30"
                                        >
                                            {row}
                                        </span>
                                        <div className="flex gap-2">
                                            {Array.from({ length: maxCols }, (_, i) => i + 1).map((col) => {
                                                const seat = groupedSeats[row]?.[col];
                                                if (seat) {
                                                    return (
                                                        <Seat
                                                            key={seat.seatCode}
                                                            seat={seat}
                                                            onClick={handleSeatClick}
                                                            seatColor={getSeatColor(seat)}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <EmptySeat
                                                        key={`${row}-${col}`}
                                                        mode={editMode}
                                                        row={row}
                                                        col={col}
                                                        onClick={() => {}}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <SeatLayoutLegend types={dummySeatTypes} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CinemaSeatAdmin;
