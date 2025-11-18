import React, { useState } from 'react';
import { useParams } from 'next/navigation';

import Seat from './Seat';
import EmptySeat from './EmptySeat';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import SeatLayoutStats from './SeatLayoutStats';
import SeatLayoutLegend from './SeatLayoutLegend';
import SeatTypeButtonGroup from './SeatTypeButtonGroup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Save, RotateCcw, SquarePower, MousePointerClick, Sparkles } from 'lucide-react';

import { SeatStatus, Seat as ISeat } from '@/interfaces/Seat.interface';
import { dummySeatTypes } from '@/features/seat-type/constants/dummyData.constant';
import { dummyRooms } from '@/features/room/constants/dummyData.constant';
import { generateMockSeats } from '@/features/seat/constant/dummyData.constant';

export type EditMode = 'select' | 'add' | 'delete' | 'toggle-active' | 'change-type';

const CinemaSeatAdmin: React.FC = () => {
    const dynamicParams = useParams();
    const room = dummyRooms.filter((item) => item.id === dynamicParams.roomId)[0];

    const [seats, setSeats] = useState<ISeat[]>(generateMockSeats(room));
    const [editMode, setEditMode] = useState<EditMode>('select');
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedSeatTypeId, setSelectedSeatTypeId] = useState<string>(dummySeatTypes[0].id);
    const [rows, setRows] = useState(8);
    const [columns, setColumns] = useState(12);

    const handleSeatClick = (seat: ISeat) => {
        if (editMode === 'select') {
            setSelectedSeats((prev) =>
                prev.includes(seat.seatCode) ? prev.filter((code) => code !== seat.seatCode) : [...prev, seat.seatCode],
            );
        } else if (editMode === 'delete') {
            setSeats((prev) => prev.filter((s) => s.seatCode !== seat.seatCode));
            setSelectedSeats((prev) => prev.filter((code) => code !== seat.seatCode));
        } else if (editMode === 'toggle-active') {
            setSeats((prev) => prev.map((s) => (s.seatCode === seat.seatCode ? { ...s, isActive: !s.isActive } : s)));
        } else if (editMode === 'change-type') {
            setSeats((prev) =>
                prev.map((s) => (s.seatCode === seat.seatCode ? { ...s, seatTypeId: selectedSeatTypeId } : s)),
            );
        }
    };

    const handleEmptyCellClick = (row: string, col: number) => {
        if (editMode === 'add') {
            const seatCode = `${row}${col}`;
            if (!seats.find((s) => s.seatCode === seatCode)) {
                const newSeat: ISeat = {
                    label: row,
                    columnIndex: col,
                    displayNumber: col,
                    seatCode,
                    isActive: true,
                    status: SeatStatus.AVAILABLE,
                    seatTypeId: 'st-001',
                    roomId: 'room-1',
                    id: 'seat-001',
                    createdAt: new Date('2023-06-16T09:00:00Z'),
                    updatedAt: new Date('2023-06-16T09:00:00Z'),
                    createdBy: 'usr_001',
                    updatedBy: 'usr_001',
                    isDeleted: false,
                };
                setSeats((prev) => [...prev, newSeat]);
            }
        }
    };

    const getSeatColor = (seat: ISeat) => {
        if (!seat.isActive) {
            return 'bg-gray-300 border-2 border-gray-400 opacity-50';
        }
        if (selectedSeats.includes(seat.seatCode)) {
            return 'bg-green-500 ring-4 ring-green-300';
        }
        let color: string = '';
        switch (seat.seatTypeId) {
            case 'st-001':
                color = 'bg-blue-400 hover:bg-blue-500';
                break;
            case 'st-002':
                color = 'bg-purple-400 hover:bg-purple-500';
                break;
            case 'st-003':
                color = 'bg-yellow-400 hover:bg-yellow-500';
                break;
            case 'st-004':
                color = 'bg-pink-400 hover:bg-pink-500';
                break;
            case 'st-005':
                color = 'bg-orange-400 hover:bg-orange-500';
                break;
            default:
                break;
        }

        return color;
    };

    const regenerateLayout = () => {
        const newSeats: ISeat[] = [];
        const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

        rowLabels.forEach((row) => {
            for (let col = 1; col <= columns; col++) {
                newSeats.push({
                    label: row,
                    columnIndex: col,
                    displayNumber: col,
                    seatCode: `${row}${col}`,
                    isActive: true,
                    status: SeatStatus.AVAILABLE,
                    seatTypeId: 'st-001',
                    roomId: 'room-1',
                    id: 'seat-001',
                    createdAt: new Date('2023-06-16T09:00:00Z'),
                    updatedAt: new Date('2023-06-16T09:00:00Z'),
                    createdBy: 'usr_001',
                    updatedBy: 'usr_001',
                    isDeleted: false,
                });
            }
        });

        setSeats(newSeats);
        setSelectedSeats([]);
    };

    const deleteSeatSelected = () => {
        setSeats((prev) => prev.filter((s) => !selectedSeats.includes(s.seatCode)));
        setSelectedSeats([]);
    };

    const toggleActiveSeatSelected = () => {
        setSeats((prev) => prev.map((s) => (selectedSeats.includes(s.seatCode) ? { ...s, isActive: !s.isActive } : s)));
    };

    const changeTypeSeatSelected = () => {
        setSeats((prev) =>
            prev.map((s) => (selectedSeats.includes(s.seatCode) ? { ...s, seatTypeId: selectedSeatTypeId } : s)),
        );
        setSelectedSeats([]);
    };

    const saveLayout = () => {
        console.log('Saving layout:', seats);
        alert('Layout saved! Check console for data.');
    };

    const resetSeatLayout = () => {
        setSeats(generateMockSeats(room));
        setColumns(room.total_Column);
        setRows(room.total_Row);
    };

    const groupedSeats = seats.reduce(
        (acc, seat) => {
            if (!acc[seat.label]) acc[seat.label] = {};
            acc[seat.label][seat.columnIndex] = seat;
            return acc;
        },
        {} as Record<string, Record<number, ISeat>>,
    );

    const allRows = Array.from(
        new Set([...Object.keys(groupedSeats), ...Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i))]),
    ).sort();

    const maxCols = Math.max(columns, ...seats.map((s) => s.columnIndex));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {/* Control Panel */}
                <Card className="lg:col-span-1">
                    <CardHeader className="md:px-6 px-3">
                        <CardTitle className="text-xl">Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 md:px-6 px-3">
                        {/* Edit Mode */}
                        <div className="space-y-2 max-w-full">
                            <Label className="">Edit Mode</Label>
                            <div className="space-y-2">
                                <Button
                                    variant={editMode === 'select' ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    onClick={() => setEditMode('select')}
                                >
                                    <MousePointerClick className="h-4 w-4" />
                                    Select Seats
                                </Button>
                                <Button
                                    variant={editMode === 'add' ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    onClick={() => setEditMode('add')}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Seat
                                </Button>
                                <Button
                                    variant={editMode === 'delete' ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    onClick={() => setEditMode('delete')}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Seat
                                </Button>
                                <Button
                                    variant={editMode === 'toggle-active' ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    onClick={() => setEditMode('toggle-active')}
                                >
                                    <SquarePower className="h-4 w-4" />
                                    Toggle Active
                                </Button>
                                <SeatTypeButtonGroup
                                    types={dummySeatTypes}
                                    isActive={editMode === 'change-type'}
                                    selectedType={selectedSeatTypeId}
                                    onClick={() => setEditMode('change-type')}
                                    onSelectType={(type) => setSelectedSeatTypeId(type)}
                                />
                            </div>
                        </div>

                        {/* Grid Size */}
                        <div className="space-y-2 pt-4 border-t border-slate-700">
                            <Label className="">Grid Size</Label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Label className="text-sm">Rows</Label>
                                        <Input
                                            type="number"
                                            value={rows}
                                            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                                            min={1}
                                            max={26}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-sm">Columns</Label>
                                        <Input
                                            type="number"
                                            value={columns}
                                            onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                                            min={1}
                                            max={30}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={regenerateLayout}>
                                        <Sparkles className="h-4 w-4" />
                                        Generate
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={resetSeatLayout}>
                                        <RotateCcw className="h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>
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
                                    types={dummySeatTypes}
                                    isActive={false}
                                    selectedType={selectedSeatTypeId}
                                    onClick={changeTypeSeatSelected}
                                    onSelectType={(type) => setSelectedSeatTypeId(type)}
                                />
                            </div>
                        )}

                        {/* Save */}
                        <div className="pt-4 border-t border-slate-700">
                            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={saveLayout}>
                                <Save className="h-4 w-4" />
                                Save Layout
                            </Button>
                        </div>

                        {/* Stats */}
                        <SeatLayoutStats seats={seats} seatTypes={dummySeatTypes} />
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
                                {editMode === 'select' && ' - Click seats to select them'}
                                {editMode === 'add' && ' - Click empty cells to add seats'}
                                {editMode === 'delete' && ' - Click seats to remove them'}
                                {editMode === 'toggle-active' && ' - Click to enable/disable seats'}
                                {editMode === 'change-type' && ' - Click to toggle VIP/Standard'}
                            </p>
                        </div>

                        {/* Screen */}
                        <div className="relative mb-8">
                            <div className="h-2 bg-gradient-to-r from-transparent via-black to-transparent rounded-full mb-4" />
                            <p className="text-center text-sm">SCREEN</p>
                        </div>

                        {/* Seat Grid */}
                        <div className="flex justify-center">
                            <div className="space-y-2 overflow-x-auto p-2 items-start flex flex-col">
                                {allRows.map((row) => (
                                    <div key={row} className="flex items-center justify-center gap-2 relative">
                                        <span className="w-8 h-8 text-center leading-loose font-semibold sticky left-0 -translate-x-2 backdrop-filter backdrop-blur-lg bg-background/30">
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
                                                        onClick={handleEmptyCellClick}
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
