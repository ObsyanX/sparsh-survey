const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export async function uploadDataset(file: File) {
  console.log('Uploading dataset:', file.name);
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Upload failed:', errorText);
    throw new Error(errorText);
  }
  const result = await res.json();
  console.log('Upload successful:', result);
  return result as Promise<{ dataset_id: string; filename: string; preview: any[] }>;
}

export async function listDatasets() {
  const res = await fetch(`${API_BASE}/datasets`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createSchemaMap(dataset_id: string, mapping: Record<string, string>) {
  console.log('Creating schema map for dataset:', dataset_id, 'with mapping:', mapping);
  const res = await fetch(`${API_BASE}/schema-map`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataset_id, mapping }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Schema map creation failed:', errorText);
    throw new Error(errorText);
  }
  const result = await res.json();
  console.log('Schema map created:', result);
  return result;
}

export async function cleanDataset(dataset_id: string, config: any) {
  console.log('Cleaning dataset:', dataset_id, 'with config:', config);
  const res = await fetch(`${API_BASE}/clean/${dataset_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Dataset cleaning failed:', errorText);
    throw new Error(errorText);
  }
  const result = await res.json();
  console.log('Dataset cleaned:', result);
  return result;
}

export async function analyzeDataset(dataset_id: string, weight_col?: string) {
  console.log('Analyzing dataset:', dataset_id, 'with weight_col:', weight_col);
  const url = new URL(`${API_BASE}/analyze/${dataset_id}`);
  if (weight_col) url.searchParams.set('weight_col', weight_col);
  const res = await fetch(url.toString(), { method: 'POST' });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Dataset analysis failed:', errorText);
    throw new Error(errorText);
  }
  const result = await res.json();
  console.log('Dataset analyzed:', result);
  return result;
}


