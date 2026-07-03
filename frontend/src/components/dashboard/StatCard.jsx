export default function StatCard({ icon: Icon, label, value, accent = 'primary' }) {
  const accentMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  }

  return (
    <div className="card card-hover flex items-center gap-4 p-5 animate-fade-in">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentMap[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}
