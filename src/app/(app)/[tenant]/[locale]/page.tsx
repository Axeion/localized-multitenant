import Page from './[...slug]/page'

import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'

export default async function TenantLocalePage({
  params,
}: {
  params: { tenant: string; locale: string }
}) {
  try {
    // Redirect to the home page for this tenant/locale
    return redirect(`/${params.locale}/home`);
  } catch (error) {
    console.error('Error in tenant locale page:', error);
    return <div>Error loading tenant home page</div>;
  }
}