'use client';

import { OramaSearchBox, OramaSearchButton } from '@orama/react-components';

const API_KEY = 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J'
const ENDPOINT = 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd'

const Orama = () => {
  return <div>
    <OramaSearchButton />
    <OramaSearchBox index={{ api_key: API_KEY, endpoint: ENDPOINT }} colorScheme={"light"}/>
  </div>
}

export default Orama