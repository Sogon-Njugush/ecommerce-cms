"use client"
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Store } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { useStoreModal } from '@/hooks/use-store-modal'
import { Button } from '@/components/ui/button'
import {Check, ChevronsUpDown, PlusCircleIcon, Store as StoreIcon} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items:Store[]
}

export default function StoreSwitcher({className,items=[]}:StoreSwitcherProps) {

    const storeModal = useStoreModal();
    const params = useParams();
    const routes = useRouter();
    
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const[open, setOpen] = useState(false);

    const onStoreSelect = (store: {value: string, label: string}) => {
       setOpen(false);
       routes.push(`/${store.value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size={"sm"} role='combobox' aria-expanded={open} aria-label='Select a store' className={cn('w-[200px] justify-between',className)}>
                   <StoreIcon className='mr-2 h-4 w-4'/>
                   {currentStore?.label || "Select a store"}
                   <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandList>
                        <CommandInput placeholder='Search store...' />
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading='Stores'>
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                    className="text-sm" value={store.value}
                                >
                                    <StoreIcon className='mr-2 h-4 w-4'/>
                                    {store.label}
                                    <Check className={cn('ml-auto h-4 w-4', currentStore?.value === store.value ? 'opacity-100' : 'opacity-0')}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem className='cursor-pointer' onSelect={() => {setOpen(false); storeModal.onOpen()}}>
                                <PlusCircleIcon className='mr-2 h-5 w-5'/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>

        </Popover>
    )
};  