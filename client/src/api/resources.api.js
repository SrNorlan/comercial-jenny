import { api } from './client';

const resourcePaths = {
  clients: '/clients',
  products: '/products',
  sales: '/sales',
  installments: '/installments',
  purchases: '/purchases',
  suppliers: '/suppliers',
  employees: '/employees',
  returns: '/returns',
  summary: '/reports/summary',
};

const resourcesByView = {
  dashboard: ['clients', 'products', 'sales'],
  products: ['products'],
  clients: ['clients'],
  pos: ['products', 'clients'],
  installments: ['installments'],
  returns: ['sales', 'products', 'returns'],
  reports: ['summary'],
  sales: ['sales'],
  purchases: ['purchases', 'products', 'suppliers'],
  suppliers: ['suppliers'],
  employees: ['employees'],
};

export async function loadResources(view = 'dashboard') {
  const resources = resourcesByView[view] || resourcesByView.dashboard;
  const responses = await Promise.all(resources.map((resource) => api(resourcePaths[resource])));

  return Object.fromEntries(
    resources.map((resource, index) => {
      const payload = responses[index];
      const data = payload?.data;

      if (Array.isArray(data)) return [resource, data];
      if (data && typeof data === 'object' && Array.isArray(data.data))
        return [resource, data.data];
      if (resource === 'summary') return [resource, data || null];
      return [resource, []];
    }),
  );
}
