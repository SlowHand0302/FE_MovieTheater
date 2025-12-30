import React from 'react';

import { Tags, ChevronDownIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { SeatType } from '@/interfaces/SeatType.interface';

interface SeatTypeButtonGroupProps {
    types: SeatType[];
    isActive: boolean;
    onClick: () => void;
    selectedType: string;
    onSelectType: (typeId: string) => void;
}

const SeatTypeButtonGroup = ({ types, selectedType, onSelectType, onClick, isActive }: SeatTypeButtonGroupProps) => {
    return (
        <ButtonGroup className="!max-w-full w-full justify-start">
            <Button variant={isActive ? 'default' : 'outline'} className="flex-1 justify-start" onClick={onClick}>
                <Tags className="h-4 w-4" />
                Change Type to {`${types.filter((type) => type.id === selectedType)[0]?.type ?? types[0]?.type}`}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="!pl-2">
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="[--radius:1rem]">
                    <DropdownMenuRadioGroup value={selectedType} onValueChange={onSelectType}>
                        {types.map((type) => {
                            return (
                                <DropdownMenuRadioItem key={type.id} value={type.id}>
                                    {type.type}
                                </DropdownMenuRadioItem>
                            );
                        })}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    );
};

export default SeatTypeButtonGroup;
