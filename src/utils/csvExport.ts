import Papa from 'papaparse';

interface JobData {
  id: string;
  company: string;
  title: string;
  status: string;
  appliedAt?: any;
  notes?: string;
}

export function exportToCSV(jobs: JobData[], filename: string = 'job-applications.csv') {
  // Transform dates and remove internal fields
  const data = jobs.map(job => ({
    company: job.company,
    title: job.title,
    status: job.status,
    appliedAt: job.appliedAt?.toDate?.()?.toLocaleDateString() || '',
    notes: job.notes || ''
  }));

  // Convert to CSV
  const csv = Papa.unparse(data, {
    header: true,
    skipEmptyLines: true
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}