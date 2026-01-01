import { Users, MessageCircle } from "lucide-react";
import FeatureHeader from "../../components/common/FeatureHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const leaderboard = [
  { rank: 1, name: "Jane Doe", score: 950 },
  { rank: 5, name: "John Doe", score: 850 },
];

export default function Friends() {
  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Friends & Leaderboard"
        description="Track rankings, manage friends, and chat."
        additionalActions={<Button variant="secondary">Add Friend</Button>}
      />

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
            <p className="text-sm text-gray-500">Top performers this week.</p>
          </div>
          <Users className="h-4 w-4 text-gray-400" />
        </div>
        <div className="mt-3 space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <span className="text-sm font-semibold text-gray-900">
                #{entry.rank} {entry.name}
              </span>
              <span className="text-sm font-semibold text-primary-700">
                {entry.score} pts
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle className="h-4 w-4" />
          <span>
            Chat module placeholder – connect to real-time service later.
          </span>
        </div>
      </Card>
    </div>
  );
}
