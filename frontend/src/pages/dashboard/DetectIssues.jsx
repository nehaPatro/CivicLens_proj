import { Construction, Waves, ImageIcon, Video } from 'lucide-react'
import DetectionCard from '../../components/dashboard/DetectionCard'

export default function DetectIssues() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Detect Issues</h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Upload images or videos to run AI-powered pothole and flood detection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DetectionCard
          title="Pothole Image Detection"
          description="Detect potholes in a single photo"
          icon={Construction}
          accent="orange"
          detectionType="pothole"
          mediaType="image"
        />
        <DetectionCard
          title="Pothole Video Detection"
          description="Detect potholes across video footage"
          icon={Video}
          accent="orange"
          detectionType="pothole"
          mediaType="video"
        />
        <DetectionCard
          title="Flood Image Detection"
          description="Detect flooded areas in a single photo"
          icon={Waves}
          accent="cyan"
          detectionType="flood"
          mediaType="image"
        />
        <DetectionCard
          title="Flood Video Detection"
          description="Detect flooded areas across video footage"
          icon={ImageIcon}
          accent="cyan"
          detectionType="flood"
          mediaType="video"
        />
      </div>
    </div>
  )
}
