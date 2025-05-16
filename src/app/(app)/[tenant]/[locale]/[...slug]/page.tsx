import type { Where } from 'payload'

import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderPage } from '../../../../components/RenderPage'
type Locale = 'all' | 'en' | 'fr' | undefined
export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string; locale: string }>
}) {
  const params = await paramsPromise
  let slug = undefined
  let locale: Locale = undefined

  if (params?.slug) {
    slug = params.slug
  }
  if (params?.locale) {
    locale = params.locale as Locale
  }

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  try {
    const tenantsQuery = await payload.find({
      collection: 'tenants',
      overrideAccess: true,
      user,
      where: {
        domain: {
          equals: params.tenant,
        },
      },
    })

    // If no tenant is found, the user does not have access
    // Show the login view
    if (tenantsQuery.docs.length === 0) {
      redirect(
        `/${locale}/login?redirect=${encodeURIComponent(
          `/${slug}`,
        )}`,
      )
    }
  } catch (e) {
    console.log('Error querying tenants:', e)
    redirect(
      `/${locale}/login?redirect=${encodeURIComponent(
        `/${slug}`,
      )}`,
    )
  }

  // If there is no slug, we cannot find the page
  if (!slug) {
    return notFound()
  }

  const slugConstraint: Where = {
    slug: {
      equals: slug.join('/'),
    },
  }

  const pageQuery = await payload.find({
    collection: 'pages',
    overrideAccess: true,
    user,
    where: {
      and: [
        {
          'tenant.domain': {
            equals: params.tenant,
          },
        },
        slugConstraint,
      ],
    },
    locale: locale,
  })

  const pageData = pageQuery.docs?.[0]

  // The page with the provided slug could not be found
  if (!pageData) {
    return notFound()
  }

  // The page was found, render the page with data
  return <RenderPage data={pageData} />
}
