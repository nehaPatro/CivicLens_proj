/**
 * Simple passthrough layout for public (non-authenticated) pages.
 * Kept as a dedicated layout so global public-page chrome can be added later.
 */
export default function PublicLayout({ children }) {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-950">{children}</div>
}
