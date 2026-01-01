import { useState } from "react";
import FeatureHeader from "../../components/common/FeatureHeader";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";

const achievements = [
  { id: "badge_1", title: "Fast Learner", rarity: "rare" },
  { id: "badge_2", title: "Perfect Score", rarity: "epic" },
];

export default function StudentProfile() {
  return (
    <div className="space-y-6">
      <FeatureHeader
        title="Profile"
        description="Read-only academic and performance overview."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">Personal Info</h3>
          <p className="mt-2 text-sm text-gray-600">
            Contact admin to update your details.
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          <div className="mt-3 space-y-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {ach.title}
                </span>
                <span className="text-xs uppercase text-gray-500">
                  {ach.rarity}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
