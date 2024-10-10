import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { SettingsForm } from './components/settings-form';

interface SettingPageProps{
    params:{
        storeId : string;
    }
}

const SettingsPage: React.FC<SettingPageProps> = async({params}) => {

  const {userId} = auth();

  if (!userId) {
    redirect('/sign-in');
    return null;
  }

  const store = await prismadb.store.findFirst({
    where : {
      id : params.storeId,
      userId : userId
    }
  });

  if (!store) {
    redirect('/');
  }
  



  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={store}/>
        </div>  
      </div>
  )
}

export default SettingsPage