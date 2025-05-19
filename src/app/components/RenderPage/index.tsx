import type { Page } from '@payload-types'

import React from 'react'

export const RenderPage = ({ data }: { data: Page }) => {
  return (
    <React.Fragment>
      <a href="/">
        <button type="button">Home</button>
      </a>
      <h2>Here you can decide how you would like to render the page data!</h2>

      <code>{JSON.stringify(data)}</code>
      <div>
      <h1>{data.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
    </React.Fragment>
  )
  
}
