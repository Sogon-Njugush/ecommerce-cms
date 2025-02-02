import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


//UPDATE STORE API
export async function PATCH(request: Request, {params}: {params: {storeId: string}}) {
   try {
     const {userId}  = auth();

     const body = await request.json();
     const {name} = body;

     if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 })
     }

     if (!name) {
        return new NextResponse('Name is required', { status: 400 })
     }

     if(!params.storeId) {      
        return new NextResponse('Store id is required', { status: 400 })
     }

     const store = await prismadb.store.updateMany({
        where: {
            id: params.storeId,
            userId
        },
        data: {
            name
        }
    }); 

    return new NextResponse(JSON.stringify(store), { status: 200 });

   } catch (error) {
    console.log('[STORE_PATCH]' , error);
    return new NextResponse('Internal Server Error', { status: 500 })   
   }
}

//DELETE STORE API

export async function DELETE(request: Request, {params}: {params: {storeId: string}}) {
    try {
      const {userId}  = auth();
 
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }
 
      if(!params.storeId) {      
         return new NextResponse('Store id is required', { status: 400 })
      }
 
      const store = await prismadb.store.deleteMany({
         where: {
             id: params.storeId,
             userId
         }
     }); 
 
     return new NextResponse(JSON.stringify(store), { status: 200 });
 
    } catch (error) {
     console.log('[STORE_DELETE]' , error);
     return new NextResponse('Internal Server Error', { status: 500 })   
    }
 }