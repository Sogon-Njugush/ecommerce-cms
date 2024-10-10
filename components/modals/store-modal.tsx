"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const formSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
})

export const StoreModal = () => {

    const storeModal = useStoreModal();

    const  [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(formSchema),  
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            
            const response = await axios.post('/api/stores', data);
            window.location.assign(`/${response.data.id}`);
            // toast.success("Store created");

        } catch (error) {  
            console.log(error);
            toast.error("Failed to create store");
    }finally{
        setLoading(false);
    }
    };

    return (
        <Modal title="Create new store" description="Add a new store to manage products and categories" 
        isOpen = {storeModal.isOpen} onClose={storeModal.onClose}>
            <div>
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} type="text" placeholder="Enter store name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>      
                        )} /> 
                        <div className="pt-6 space-x-2 flex items-center justify-end">
                            <Button disabled={loading} variant="outline" className="btn btn-ghost" onClick={storeModal.onClose}>Cancel</Button>    
                            <Button disabled={loading} type="submit" className="btn btn-primary">Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
            </div>
        </Modal>
    )
}