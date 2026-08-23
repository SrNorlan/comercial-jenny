import { useEffect, useState } from 'react';
import { loadResources } from '../api/resources.api';

const emptyData = { clients: [], products: [], sales: [], installments: [], purchases: [], suppliers: [], employees: [], returns: [], summary: null };

export default function useResources(user, view) {
  const [data, setData] = useState(emptyData);

  function reload() {
    return loadResources(view)
      .then((partialData) => setData((current) => ({ ...current, ...partialData })))
      .catch(() => undefined);
  }

  useEffect(() => {
    if (user) reload();
  }, [user, view]);

  return { data, reload };
}
