import Papa from "papaparse";

interface JobData {
  id: string;
  company: string;
  title: string;
  status: string;
  appliedAt?: any;
  notes?: string;
}

export function exportToCSV(
  jobs: JobData[],
  filename: string = "job-applications.csv"
) {
  // map jobs to export format and safely convert Firestore timestamps
  const data = jobs.map((job) => ({
    company: job.company,
    title: job.title,
    status: job.status,
    // convert Firestore Timestamp to string date (if present)
    appliedAt:
      typeof job.appliedAt?.toDate === "function"
        ? job.appliedAt.toDate().toLocaleDateString()
        : "",
    notes: job.notes || "",
  }));

  // convert to CSV string
  const csv = Papa.unparse(data, {
    header: true,
    skipEmptyLines: true,
  });

  // prepend UTF-8 BOM for Excel compatibility
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

  // create a temporary download link and trigger it
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
